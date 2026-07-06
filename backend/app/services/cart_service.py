from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models import CartItem, Product


class CartService:

    @staticmethod
    def product_stock_status(stock: int):
        if stock == 0:
            return "Out of Stock"
        elif stock <= 5:
            return "Low Stock"
        return "In Stock"

    @staticmethod
    def cart_response(cart_item: CartItem):
        product = cart_item.product

        return {
            "id": cart_item.id,
            "customer_id": cart_item.customer_id,
            "product_id": cart_item.product_id,
            "quantity": cart_item.quantity,
            "product": {
                "id": product.id,
                "vendor_id": product.vendor_id,
                "name": product.name,
                "description": product.description,
                "price": product.price,
                "stock": product.stock,
                "category": product.category,
                "image": product.image,
                "stock_status": CartService.product_stock_status(product.stock),
            },
        }

    @staticmethod
    def add_to_cart(db: Session, current_user, cart_data):
        if cart_data.quantity <= 0:
            raise HTTPException(status_code=400, detail="Quantity must be greater than 0")

        product = db.query(Product).filter(Product.id == cart_data.product_id).first()

        if not product:
            raise HTTPException(status_code=404, detail="Product not found")

        if product.stock == 0:
            raise HTTPException(status_code=400, detail="Product is out of stock")

        if product.stock < cart_data.quantity:
            raise HTTPException(status_code=400, detail="Not enough stock available")

        existing_item = db.query(CartItem).filter(
            CartItem.customer_id == current_user.id,
            CartItem.product_id == cart_data.product_id
        ).first()

        if existing_item:
            new_quantity = existing_item.quantity + cart_data.quantity

            if product.stock < new_quantity:
                raise HTTPException(status_code=400, detail="Not enough stock available")

            existing_item.quantity = new_quantity
            db.commit()
            db.refresh(existing_item)

            return CartService.cart_response(existing_item)

        cart_item = CartItem(
            customer_id=current_user.id,
            product_id=cart_data.product_id,
            quantity=cart_data.quantity
        )

        db.add(cart_item)
        db.commit()
        db.refresh(cart_item)

        return CartService.cart_response(cart_item)

    @staticmethod
    def get_cart(db: Session, customer_id: int):
        cart_items = db.query(CartItem).filter(
            CartItem.customer_id == customer_id
        ).all()

        return [CartService.cart_response(item) for item in cart_items]

    @staticmethod
    def update_cart_item(db: Session, current_user, item_id: int, cart_data):
        if cart_data.quantity <= 0:
            raise HTTPException(status_code=400, detail="Quantity must be greater than 0")

        cart_item = db.query(CartItem).filter(
            CartItem.id == item_id,
            CartItem.customer_id == current_user.id
        ).first()

        if not cart_item:
            raise HTTPException(status_code=404, detail="Cart item not found")

        product = db.query(Product).filter(Product.id == cart_item.product_id).first()

        if product.stock < cart_data.quantity:
            raise HTTPException(status_code=400, detail="Not enough stock available")

        cart_item.quantity = cart_data.quantity

        db.commit()
        db.refresh(cart_item)

        return CartService.cart_response(cart_item)

    @staticmethod
    def remove_cart_item(db: Session, current_user, item_id: int):
        cart_item = db.query(CartItem).filter(
            CartItem.id == item_id,
            CartItem.customer_id == current_user.id
        ).first()

        if not cart_item:
            raise HTTPException(status_code=404, detail="Cart item not found")

        db.delete(cart_item)
        db.commit()

        return {"message": "Cart item removed successfully"}

    @staticmethod
    def clear_cart(db: Session, customer_id: int):
        db.query(CartItem).filter(
            CartItem.customer_id == customer_id
        ).delete()

        db.commit()

        return {"message": "Cart cleared successfully"}