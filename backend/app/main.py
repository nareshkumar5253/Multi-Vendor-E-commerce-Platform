from fastapi import FastAPI
from app.database import Base, engine
from app.routes import (
    auth_routes,
    product_routes,
    cart_routes,
    order_routes,
    admin_routes,
    
)
import os
from fastapi.exceptions import RequestValidationError
from fastapi import HTTPException
from fastapi.staticfiles import StaticFiles
from app.routes import payment_routes

from app.routes import vendor_dashboard_routes
from app.routes import profile_routes

from fastapi.middleware.cors import CORSMiddleware

from app.exception_handlers import (
    http_exception_handler,
    validation_exception_handler,
    global_exception_handler
)
from starlette.middleware.base import BaseHTTPMiddleware
from app.middleware import log_requests



app = FastAPI(title="Multi-Vendor E-commerce Platform")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth_routes.router)
app.include_router(product_routes.router)
app.include_router(cart_routes.router)
app.include_router(order_routes.router)
app.include_router(admin_routes.router)
app.include_router(payment_routes.router)
app.include_router(vendor_dashboard_routes.router)
app.include_router(profile_routes.router)

os.makedirs("uploads/products", exist_ok=True)

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)
app.add_middleware(
    BaseHTTPMiddleware,
    dispatch=log_requests
)
app.add_exception_handler(
    HTTPException,
    http_exception_handler
)

app.add_exception_handler(
    RequestValidationError,
    validation_exception_handler
)

app.add_exception_handler(
    Exception,
    global_exception_handler
)


@app.get("/")
def root():
    return {"message": "Multi-Vendor E-commerce API running"}