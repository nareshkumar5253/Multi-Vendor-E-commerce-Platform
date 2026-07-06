from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models import Product
import os
import uuid
import shutil
from sqlalchemy.exc import IntegrityError


class ProductService:

    @staticmethod
    def get_stock_status(stock: int):
        if stock == 0:
            return "Out of Stock"
        elif stock <= 5:
            return "Low Stock"
        return "In Stock"

    @staticmethod
    def product_response(product: Product):
        return {
            "id": product.id,
            "vendor_id": product.vendor_id,
            "name": product.name,
            "description": product.description,
            "price": product.price,
            "stock": product.stock,
            "category": product.category,
            "image": product.image,
            "stock_status": ProductService.get_stock_status(product.stock),
        }

    @staticmethod
    def create_product(db, current_user, name, description, price, stock, category, image):
        if current_user.is_approved != 1:
            raise HTTPException(status_code=403, detail="Vendor account is not approved by admin")

        if price <= 0:
            raise HTTPException(status_code=400, detail="Price must be greater than 0")

        if stock < 0:
            raise HTTPException(status_code=400, detail="Stock cannot be negative")

        os.makedirs("uploads/products", exist_ok=True)

        filename = f"{uuid.uuid4()}_{image.filename}"
        filepath = os.path.join("uploads", "products", filename)

        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        product = Product(
            vendor_id=current_user.id,
            name=name,
            description=description,
            price=price,
            stock=stock,
            category=category,
            image=filepath,
        )

        db.add(product)
        db.commit()
        db.refresh(product)

        return ProductService.product_response(product)

    @staticmethod
    def get_all_products(
            db,
            search=None,
            category=None,
            min_price=None,
            max_price=None,
            sort_by="newest",
            page=1,
            limit=10
        ):
            if page < 1:
                raise HTTPException(status_code=400, detail="Page must be greater than 0")

            if limit < 1 or limit > 100:
                raise HTTPException(status_code=400, detail="Limit must be between 1 and 100")

            query = db.query(Product)

            if search:
                query = query.filter(
                    Product.name.ilike(f"%{search}%")
                )

            if category:
                query = query.filter(
                    Product.category.ilike(f"%{category}%")
                )

            if min_price is not None:
                query = query.filter(Product.price >= min_price)

            if max_price is not None:
                query = query.filter(Product.price <= max_price)

            if sort_by == "price_low":
                query = query.order_by(Product.price.asc())
            elif sort_by == "price_high":
                query = query.order_by(Product.price.desc())
            elif sort_by == "stock_low":
                query = query.order_by(Product.stock.asc())
            elif sort_by == "stock_high":
                query = query.order_by(Product.stock.desc())
            else:
                query = query.order_by(Product.created_at.desc())

            offset = (page - 1) * limit
            products = query.offset(offset).limit(limit).all()

            return [ProductService.product_response(product) for product in products]
    
    @staticmethod
    def get_my_products(db: Session, vendor_id: int):
        products = db.query(Product).filter(Product.vendor_id == vendor_id).all()
        return [ProductService.product_response(product) for product in products]

    @staticmethod
    def get_low_stock_products(db: Session, vendor_id: int):
        products = db.query(Product).filter(
            Product.vendor_id == vendor_id,
            Product.stock <= 5
        ).all()

        return [ProductService.product_response(product) for product in products]

    @staticmethod
    def get_product(db: Session, product_id: int):
        product = db.query(Product).filter(Product.id == product_id).first()

        if not product:
            raise HTTPException(status_code=404, detail="Product not found")

        return ProductService.product_response(product)

    @staticmethod
    def update_product(
        db,
        current_user,
        product_id,
        name,
        description,
        price,
        stock,
        category,
        image=None,
    ):
        if current_user.is_approved != 1:
            raise HTTPException(status_code=403, detail="Vendor account is not approved by admin")

        product = db.query(Product).filter(Product.id == product_id).first()

        if not product:
            raise HTTPException(status_code=404, detail="Product not found")

        if product.vendor_id != current_user.id:
            raise HTTPException(status_code=403, detail="You can update only your own products")

        if price <= 0:
            raise HTTPException(status_code=400, detail="Price must be greater than 0")

        if stock < 0:
            raise HTTPException(status_code=400, detail="Stock cannot be negative")

        product.name = name
        product.description = description
        product.price = price
        product.stock = stock
        product.category = category

        if image:
            if product.image and os.path.exists(product.image):
                os.remove(product.image)

            os.makedirs("uploads/products", exist_ok=True)

            filename = f"{uuid.uuid4()}_{image.filename}"
            filepath = os.path.join("uploads", "products", filename)

            with open(filepath, "wb") as buffer:
                shutil.copyfileobj(image.file, buffer)

            product.image = filepath

        db.commit()
        db.refresh(product)

        return ProductService.product_response(product)
    

    @staticmethod
    def delete_product(db, current_user, product_id):
        if current_user.is_approved != 1:
            raise HTTPException(
                status_code=403,
                detail="Vendor account is not approved by admin"
            )

        product = db.query(Product).filter(Product.id == product_id).first()

        if not product:
            raise HTTPException(status_code=404, detail="Product not found")

        if product.vendor_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="You can delete only your own products"
            )

        # Soft delete: don't remove product if it may be linked to orders
        product.stock = 0
        product.name = product.name + " (Inactive)"

        db.commit()
        db.refresh(product)

        return {"message": "Product disabled successfully"}