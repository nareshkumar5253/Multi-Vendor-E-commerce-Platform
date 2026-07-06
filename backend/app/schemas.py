from pydantic import BaseModel, EmailStr
from app.models import UserRole
from app.models import OrderStatus


class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: UserRole


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: UserRole
    is_approved: int

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse
class ProductCreate(BaseModel):
    name: str
    description: str | None = None
    price: float
    stock: int
    category: str | None = None


class ProductUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    price: float | None = None
    stock: int | None = None
    category: str | None = None


class ProductResponse(BaseModel):
    id: int
    vendor_id: int
    name: str
    description: str | None
    price: float
    stock: int
    category: str | None
    image: str | None
    stock_status: str

    class Config:
        from_attributes = True
class CartItemCreate(BaseModel):
    product_id: int
    quantity: int


class CartItemUpdate(BaseModel):
    quantity: int


class CartProductResponse(BaseModel):
    id: int
    vendor_id: int
    name: str
    description: str | None
    price: float
    stock: int
    category: str | None
    image: str | None
    stock_status: str

    class Config:
        from_attributes = True


class CartItemResponse(BaseModel):
    id: int
    customer_id: int
    product_id: int
    quantity: int
    product: CartProductResponse

    class Config:
        from_attributes = True



class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    price: float

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    id: int
    customer_id: int
    vendor_id: int
    total_amount: float
    status: OrderStatus
    items: list[OrderItemResponse]

    class Config:
        from_attributes = True


class PaymentRequest(BaseModel):
    payment_success: bool

class OrderStatusUpdate(BaseModel):
    status: OrderStatus
class ReviewCreate(BaseModel):
    product_id: int
    rating: int
    comment: str | None = None


class ReviewResponse(BaseModel):
    id: int
    customer_id: int
    product_id: int
    rating: int
    comment: str | None

    class Config:
        from_attributes = True
class PaymentRequest(BaseModel):
    payment_method: str
    coupon_code: str | None = None


class PaymentResponse(BaseModel):
    id: int
    order_id: int
    amount: float
    payment_method: str
    transaction_id: str
    status: str

    class Config:
        from_attributes = True
class WishlistCreate(BaseModel):
    product_id: int


class WishlistResponse(BaseModel):
    id: int
    customer_id: int
    product_id: int
    product: ProductResponse

    class Config:
        from_attributes = True
class CouponCreate(BaseModel):
    code: str
    discount_type: str
    discount_value: float
    min_order_amount: float = 0


class CouponResponse(BaseModel):
    id: int
    code: str
    discount_type: str
    discount_value: float
    min_order_amount: float
    is_active: bool

    class Config:
        from_attributes = True


class ApplyCouponRequest(BaseModel):
    code: str
    cart_total: float