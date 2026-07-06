from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_db, require_role
from app.models import User
from app.schemas import OrderResponse, PaymentRequest, OrderStatusUpdate
from app.services.order_service import OrderService


router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("/checkout", response_model=list[OrderResponse])
def checkout(
    payment_request: PaymentRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["customer"]))
):
    return OrderService.checkout(db, current_user, payment_request)


@router.get("/my-orders", response_model=list[OrderResponse])
def get_my_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["customer"]))
):
    return OrderService.get_customer_orders(db, current_user.id)


@router.get("/vendor-orders", response_model=list[OrderResponse])
def get_vendor_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["vendor"]))
):
    return OrderService.get_vendor_orders(db, current_user.id)


@router.put("/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: int,
    status_data: OrderStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["vendor"]))
):
    return OrderService.update_order_status(
        db,
        order_id,
        current_user.id,
        status_data.status
    )