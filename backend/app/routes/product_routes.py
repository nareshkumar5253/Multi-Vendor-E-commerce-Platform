from fastapi import APIRouter, Depends, Form, UploadFile, File
from sqlalchemy.orm import Session

from app.dependencies import get_db, require_role
from app.models import User
from app.schemas import ProductResponse
from app.services.product_service import ProductService


router = APIRouter(prefix="/products", tags=["Products"])


@router.post("/", response_model=ProductResponse)
def create_product(
    name: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    stock: int = Form(...),
    category: str = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["vendor"]))
):
    return ProductService.create_product(
        db=db,
        current_user=current_user,
        name=name,
        description=description,
        price=price,
        stock=stock,
        category=category,
        image=image
    )


@router.get("/", response_model=list[ProductResponse])
def get_all_products(
    db: Session = Depends(get_db),
    search: str | None = None,
    category: str | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
    sort_by: str = "newest",
    page: int = 1,
    limit: int = 10
):
    return ProductService.get_all_products(
        db=db,
        search=search,
        category=category,
        min_price=min_price,
        max_price=max_price,
        sort_by=sort_by,
        page=page,
        limit=limit
    )


@router.get("/my-products", response_model=list[ProductResponse])
def get_my_products(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["vendor"]))
):
    return ProductService.get_my_products(
        db=db,
        vendor_id=current_user.id
    )


@router.get("/low-stock", response_model=list[ProductResponse])
def get_low_stock_products(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["vendor"]))
):
    return ProductService.get_low_stock_products(
        db=db,
        vendor_id=current_user.id
    )


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    return ProductService.get_product(
        db=db,
        product_id=product_id
    )


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    name: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    stock: int = Form(...),
    category: str = Form(...),
    image: UploadFile | None = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["vendor"]))
):
    return ProductService.update_product(
        db=db,
        current_user=current_user,
        product_id=product_id,
        name=name,
        description=description,
        price=price,
        stock=stock,
        category=category,
        image=image
    )


@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["vendor"]))
):
    return ProductService.delete_product(
        db=db,
        current_user=current_user,
        product_id=product_id
    )