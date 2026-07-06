from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_db, require_role
from app.models import User
from app.schemas import CartItemCreate, CartItemUpdate, CartItemResponse
from app.services.cart_service import CartService


router = APIRouter(prefix="/cart", tags=["Cart"])


@router.post("/add", response_model=CartItemResponse)
def add_to_cart(
    cart_data: CartItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["customer"]))
):
    return CartService.add_to_cart(db, current_user, cart_data)


@router.get("/", response_model=list[CartItemResponse])
def get_cart(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["customer"]))
):
    return CartService.get_cart(db, current_user.id)


@router.put("/{item_id}", response_model=CartItemResponse)
def update_cart_item(
    item_id: int,
    cart_data: CartItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["customer"]))
):
    return CartService.update_cart_item(db, current_user, item_id, cart_data)


@router.delete("/{item_id}")
def remove_cart_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["customer"]))
):
    return CartService.remove_cart_item(db, current_user, item_id)


@router.delete("/")
def clear_cart(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["customer"]))
):
    return CartService.clear_cart(db, current_user.id)