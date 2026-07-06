from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, extract

from app.services.email_service import EmailService
from app.models import User, Product, Order, OrderStatus


class AdminService:

    @staticmethod
    def get_all_users(db: Session):
        return db.query(User).all()

    @staticmethod
    def get_all_vendors(db: Session):
        return db.query(User).filter(User.role == "vendor").all()

    @staticmethod
    def get_all_products(db: Session):
        return db.query(Product).all()

    @staticmethod
    def get_all_orders(db: Session):
        return db.query(Order).all()

    @staticmethod
    def approve_vendor(db: Session, vendor_id: int):
        vendor = (
            db.query(User)
            .filter(
                User.id == vendor_id,
                User.role == "vendor"
            )
            .first()
        )

        if not vendor:
            raise HTTPException(
                status_code=404,
                detail="Vendor not found"
            )

        vendor.is_approved = True

        db.commit()
        db.refresh(vendor)

        EmailService.send_email(
            to_email=vendor.email,
            subject="Vendor Account Approved",
            body=f"""
Hello {vendor.name},

Congratulations!

Your vendor account has been approved successfully.

You can now login to MarketHub and start adding products.

Regards,
MarketHub Team
"""
        )

        return {
            "message": "Vendor approved successfully"
        }

    @staticmethod
    def delete_customer(db: Session, customer_id: int):
        customer = (
            db.query(User)
            .filter(
                User.id == customer_id,
                User.role == "customer"
            )
            .first()
        )

        if not customer:
            raise HTTPException(
                status_code=404,
                detail="Customer not found"
            )

        db.delete(customer)
        db.commit()

        return {
            "message": "Customer deleted successfully"
        }

    @staticmethod
    def dashboard(db: Session):

        total_users = db.query(User).count()

        total_vendors = (
            db.query(User)
            .filter(User.role == "vendor")
            .count()
        )

        total_customers = (
            db.query(User)
            .filter(User.role == "customer")
            .count()
        )

        pending_vendors = (
            db.query(User)
            .filter(
                User.role == "vendor",
                User.is_approved == False
            )
            .count()
        )

        total_products = db.query(Product).count()

        total_orders = db.query(Order).count()

        total_revenue = (
            db.query(
                func.coalesce(func.sum(Order.total_amount), 0)
            )
            .filter(
                Order.status.in_([
                    OrderStatus.paid,
                    OrderStatus.shipped,
                    OrderStatus.delivered
                ])
            )
            .scalar()
        )

        monthly_stats = (
            db.query(
                extract("month", Order.created_at).label("month"),
                func.count(Order.id).label("orders"),
                func.coalesce(
                    func.sum(Order.total_amount),
                    0
                ).label("revenue"),
            )
            .filter(
                Order.status.in_([
                    OrderStatus.paid,
                    OrderStatus.shipped,
                    OrderStatus.delivered
                ])
            )
            .group_by(extract("month", Order.created_at))
            .order_by(extract("month", Order.created_at))
            .all()
        )

        users_by_role = (
            db.query(
                User.role,
                func.count(User.id).label("count")
            )
            .group_by(User.role)
            .all()
        )

        month_names = {
            1: "Jan",
            2: "Feb",
            3: "Mar",
            4: "Apr",
            5: "May",
            6: "Jun",
            7: "Jul",
            8: "Aug",
            9: "Sep",
            10: "Oct",
            11: "Nov",
            12: "Dec",
        }

        return {
            "total_users": total_users,
            "total_vendors": total_vendors,
            "total_customers": total_customers,
            "pending_vendors": pending_vendors,
            "total_products": total_products,
            "total_orders": total_orders,
            "total_revenue": float(total_revenue),

            "monthly_stats": [
                {
                    "month": month_names.get(int(row.month), str(row.month)),
                    "orders": row.orders,
                    "revenue": float(row.revenue)
                }
                for row in monthly_stats
            ],

            "users_by_role": [
                {
                    "role": str(row.role),
                    "count": row.count
                }
                for row in users_by_role
            ]
        }