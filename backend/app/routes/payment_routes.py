from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db, require_role
from app.models import Order, Payment, User, OrderStatus, Product, OrderItem
from app.services.payment_service import PaymentService

router = APIRouter(prefix="/payments", tags=["Payments"])


@router.post("/retry/{order_id}")
def retry_payment(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["customer"]))
):
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.customer_id == current_user.id
    ).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if order.status != OrderStatus.failed:
        raise HTTPException(
            status_code=400,
            detail="Only failed orders can be retried"
        )

    order_items = db.query(OrderItem).filter(
        OrderItem.order_id == order.id
    ).all()

    for item in order_items:
        product = db.query(Product).filter(
            Product.id == item.product_id
        ).with_for_update().first()

        if not product:
            raise HTTPException(status_code=404, detail="Product not found")

        if product.stock < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Not enough stock for {product.name}"
            )

    payment_result = PaymentService.process_payment(
        amount=order.total_amount,
        payment_method="RETRY"
    )

    payment = Payment(
        order_id=order.id,
        amount=order.total_amount,
        payment_method="RETRY",
        transaction_id=payment_result["transaction_id"],
        status="SUCCESS" if payment_result["success"] else "FAILED"
    )

    db.add(payment)

    if payment_result["success"]:
        order.status = OrderStatus.paid

        for item in order_items:
            product = db.query(Product).filter(
                Product.id == item.product_id
            ).first()
            product.stock -= item.quantity
    else:
        order.status = OrderStatus.failed

    db.commit()
    db.refresh(order)

    return {
        "message": "Payment retry completed",
        "payment_status": payment.status,
        "order_status": order.status
    }