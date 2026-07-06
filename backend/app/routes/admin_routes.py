from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_db, require_role
from app.models import User
from app.services.admin_service import AdminService


router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/users")
def get_all_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    return AdminService.get_all_users(db)


@router.get("/vendors")
def get_all_vendors(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    return AdminService.get_all_vendors(db)


@router.get("/products")
def get_all_products_admin(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    return AdminService.get_all_products(db)


@router.get("/orders")
def get_all_orders_admin(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    return AdminService.get_all_orders(db)


@router.put("/vendors/{vendor_id}/approve")
def approve_vendor(
    vendor_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    return AdminService.approve_vendor(db, vendor_id)


@router.get("/dashboard")
def admin_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    return AdminService.dashboard(db)
@router.delete("/customers/{customer_id}")
def delete_customer(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(["admin"]))
):
    return AdminService.delete_customer(
        db,
        customer_id
    )