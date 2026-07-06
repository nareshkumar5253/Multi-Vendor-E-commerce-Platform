from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract

from app.dependencies import get_db, require_role
from app.models import User, Product, Order, OrderItem, OrderStatus


router = APIRouter(prefix="/vendor-dashboard", tags=["Vendor Dashboard"])


@router.get("/overview")
def vendor_dashboard_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["vendor"]))
):
    total_products = db.query(Product).filter(
        Product.vendor_id == current_user.id
    ).count()

    total_orders = db.query(Order).filter(
        Order.vendor_id == current_user.id
    ).count()

    low_stock_products = db.query(Product).filter(
        Product.vendor_id == current_user.id,
        Product.stock <= 5
    ).count()

    revenue = db.query(func.coalesce(func.sum(Order.total_amount), 0)).filter(
        Order.vendor_id == current_user.id,
        Order.status.in_([
            OrderStatus.paid,
            OrderStatus.shipped,
            OrderStatus.delivered
        ])
    ).scalar()

    top_products = (
        db.query(
            Product.name,
            func.coalesce(func.sum(OrderItem.quantity), 0).label("sold_count")
        )
        .join(OrderItem, Product.id == OrderItem.product_id)
        .join(Order, Order.id == OrderItem.order_id)
        .filter(
            Product.vendor_id == current_user.id,
            Order.status.in_([
                OrderStatus.paid,
                OrderStatus.shipped,
                OrderStatus.delivered
            ])
        )
        .group_by(Product.name)
        .order_by(func.sum(OrderItem.quantity).desc())
        .limit(5)
        .all()
    )

    monthly_stats = (
        db.query(
            extract("month", Order.created_at).label("month"),
            func.count(Order.id).label("orders"),
            func.coalesce(func.sum(Order.total_amount), 0).label("revenue")
        )
        .filter(
            Order.vendor_id == current_user.id,
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
        "total_products": total_products,
        "total_orders": total_orders,
        "low_stock_products": low_stock_products,
        "revenue": revenue,
        "top_products": [
            {
                "name": product.name,
                "sold_count": product.sold_count
            }
            for product in top_products
        ],
        "monthly_stats": [
            {
                "month": month_names.get(int(row.month), str(row.month)),
                "orders": row.orders,
                "revenue": float(row.revenue)
            }
            for row in monthly_stats
        ]
    }