from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models import Coupon

from app.models import (
    CartItem,
    Product,
    Order,
    OrderItem,
    Payment,
    OrderStatus
)
from app.services.payment_service import PaymentService
from app.services.email_service import EmailService


class OrderService:

    @staticmethod
    def checkout(db: Session, current_user, payment_request):
        cart_items = db.query(CartItem).filter(
            CartItem.customer_id == current_user.id
        ).all()

        if not cart_items:
            raise HTTPException(status_code=400, detail="Cart is empty")

        try:
            vendor_groups = {}

            for cart_item in cart_items:
                product = (
                    db.query(Product)
                    .filter(Product.id == cart_item.product_id)
                    .with_for_update()
                    .first()
                )

                if not product:
                    raise HTTPException(status_code=404, detail="Product not found")

                if product.stock < cart_item.quantity:
                    raise HTTPException(
                        status_code=400,
                        detail=f"{product.name} is out of stock"
                    )

                vendor_groups.setdefault(product.vendor_id, []).append(
                    (cart_item, product)
                )

            created_orders = []

            for vendor_id, items in vendor_groups.items():
                total_amount = sum(
                    item.quantity * product.price
                    for item, product in items
                ) 
                discount_amount = 0

                if payment_request.coupon_code:
                    coupon = db.query(Coupon).filter(
                        Coupon.code == payment_request.coupon_code.upper(),
                        Coupon.is_active == True
                    ).first()

                    if not coupon:
                        raise HTTPException(status_code=404, detail="Invalid or inactive coupon")

                    if total_amount < coupon.min_order_amount:
                        raise HTTPException(
                            status_code=400,
                            detail=f"Minimum order amount should be ₹{coupon.min_order_amount}"
                        )

                    if coupon.discount_type == "percentage":
                        discount_amount = total_amount * coupon.discount_value / 100
                    else:
                        discount_amount = coupon.discount_value

                    if discount_amount > total_amount:
                        discount_amount = total_amount

                total_amount = total_amount - discount_amount

                order = Order(
                    customer_id=current_user.id,
                    vendor_id=vendor_id,
                    total_amount=total_amount,
                    status=OrderStatus.pending
                )

                db.add(order)
                db.flush()

                for item, product in items:
                    order_item = OrderItem(
                        order_id=order.id,
                        product_id=product.id,
                        quantity=item.quantity,
                        price=product.price
                    )
                    db.add(order_item)

                payment_result = PaymentService.process_payment(
                    amount=total_amount,
                    payment_method=payment_request.payment_method
                )

                payment = Payment(
                    order_id=order.id,
                    amount=total_amount,
                    payment_method=payment_request.payment_method,
                    transaction_id=payment_result["transaction_id"],
                    status="SUCCESS" if payment_result["success"] else "FAILED"
                )

                db.add(payment)

                if payment_result["success"]:
                    order.status = OrderStatus.paid

                    for item, product in items:
                        product.stock -= item.quantity

                    EmailService.send_email(
                        to_email=current_user.email,
                        subject="Order Confirmed",
                        body=f"""
                Hello {current_user.name},

                Your order #{order.id} has been placed successfully.

                Total Amount: ₹{total_amount}
                Payment Method: {payment_request.payment_method}
                Order Status: Paid

                Thank you for shopping with MarketHub.
                """
                    ) 
                else:
                    order.status = OrderStatus.failed

                created_orders.append(order)

            if all(order.status == OrderStatus.paid for order in created_orders):
                db.query(CartItem).filter(
                    CartItem.customer_id == current_user.id
                ).delete()

            db.commit()

            for order in created_orders:
                db.refresh(order)

            return created_orders

        except HTTPException:
            db.rollback()
            raise

        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=500,
                detail=f"Checkout failed: {str(e)}"
            )

    @staticmethod
    def get_customer_orders(db: Session, customer_id: int):
        return db.query(Order).filter(
            Order.customer_id == customer_id
        ).all()

    @staticmethod
    def get_vendor_orders(db: Session, vendor_id: int):
        return db.query(Order).filter(
            Order.vendor_id == vendor_id
        ).all()

    @staticmethod
    def update_order_status(db: Session, order_id: int, vendor_id: int, status):
        order = db.query(Order).filter(
            Order.id == order_id,
            Order.vendor_id == vendor_id
        ).first()

        if not order:
            raise HTTPException(status_code=404, detail="Order not found")

        if order.status == OrderStatus.failed:
            raise HTTPException(status_code=400, detail="Failed order cannot be updated")

        allowed_updates = {
            OrderStatus.paid: [OrderStatus.shipped],
            OrderStatus.shipped: [OrderStatus.delivered],
            OrderStatus.delivered: []
        }

        if status not in allowed_updates.get(order.status, []):
            raise HTTPException(
                status_code=400,
                detail=f"Cannot change status from {order.status.value} to {status.value}"
            )

        order.status = status

        db.commit()
        db.refresh(order)

        return order