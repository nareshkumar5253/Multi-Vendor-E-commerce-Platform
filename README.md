# Multi-Vendor E-commerce Platform

A modern, full-stack Multi-Vendor E-commerce Platform built using **FastAPI**, **React.js**, **PostgreSQL**, and **Tailwind CSS**. The platform enables multiple vendors to sell products, customers to purchase products, and administrators to efficiently manage the marketplace through dedicated dashboards.

---

##  Project Overview

This project provides a complete online marketplace where:

- Customers can browse products, manage carts, apply coupons, and place orders.
- Vendors can add, edit, and manage their products while tracking sales and revenue.
- Administrators can monitor the entire platform, approve vendors, manage users, and analyze marketplace performance through interactive dashboards.

The application follows a modular architecture with secure authentication, RESTful APIs, responsive dashboards, and role-based access control.

---

#  Features

##  Customer Module

- User Registration & Login
- JWT Authentication
- Browse Products
- Product Details
- Shopping Cart
- Quantity Management
- Coupon System
- Checkout
- Order History
- Profile Management
- Responsive Dashboard

---

## 🏪Vendor Module

- Vendor Registration
- Admin Approval System
- Vendor Dashboard
- Product Management
- Add Products
- Edit Products
- Delete Products
- Order Management
- Revenue Analytics
- Monthly Sales Reports
- Top Selling Products
- Low Stock Monitoring

---

##  Admin Module

- Admin Dashboard
- User Management
- Vendor Approval
- Customer Management
- Product Monitoring
- Order Management
- Revenue Tracking
- Monthly Revenue Analytics
- Monthly Orders Analytics
- Platform Statistics
- Interactive Charts

---

# Dashboard Analytics

The platform provides professional dashboards with real-time analytics.

### Admin Dashboard

- Total Users
- Total Vendors
- Total Customers
- Pending Vendor Requests
- Total Products
- Total Revenue
- Monthly Revenue Graph
- Monthly Orders Graph
- Marketplace Overview

### Vendor Dashboard

- Total Products
- Total Orders
- Revenue
- Low Stock Products
- Monthly Revenue Chart
- Monthly Orders Chart
- Top Selling Products

### Customer Dashboard

- Browse Products
- Shopping Cart
- Order History
- Quick Actions
- Featured Shopping Section

---

#  Tech Stack

## Frontend

- React.js
- React Router DOM
- Axios
- Tailwind CSS
- Recharts

---

## Backend

- FastAPI
- SQLAlchemy ORM
- Pydantic
- JWT Authentication
- Passlib (Password Hashing)
- Uvicorn

---

## Database

- PostgreSQL

---

## Additional Technologies

- REST APIs
- Role-Based Authentication
- Email Notifications
- Coupon Management
- Image Upload
- Responsive UI
- Git & GitHub

---

# Project Structure

```
Multi-Vendor-E-commerce-Platform
│
├── backend
│   ├── app
│   │   ├── models
│   │   ├── routes
│   │   ├── services
│   │   ├── schemas
│   │   ├── database
│   │   ├── middleware
│   │   └── main.py
│   │
│   └── requirements.txt
│
├── frontend
│   ├── src
│   │   ├── api
│   │   ├── components
│   │   ├── layouts
│   │   ├── pages
│   │   ├── routes
│   │   └── App.jsx
│   │
│   └── package.json
│
└── README.md
```

---

# Authentication

The platform uses **JWT (JSON Web Token)** based authentication with role-based authorization.

Supported Roles:

- Customer
- Vendor
- Admin

Each role has its own protected dashboard and permissions.

---

#  Major Functionalities

- Multi-Vendor Marketplace
- Secure Authentication
- Vendor Approval Workflow
- Product Management
- Shopping Cart
- Coupon System
- Checkout Process
- Order Tracking
- Dashboard Analytics
- Revenue Monitoring
- Inventory Management
- Responsive User Interface

---

#  Installation

## Clone Repository

```bash
git clone https://github.com/nareshkumar5253/Multi-Vendor-E-commerce-Platform.git
```

```
cd Multi-Vendor-E-commerce-Platform
```

---

## Backend Setup

```
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Backend URL

```
http://127.0.0.1:8000
```

Swagger Documentation

```
http://127.0.0.1:8000/docs
```

---

## Frontend Setup

```
cd frontend

npm install

npm run dev
```

Frontend URL

```
http://localhost:5173
```

---

#  Screenshots

Add screenshots of:

- Home Page
- Login Page
- Customer Dashboard
- Vendor Dashboard
- Admin Dashboard
- Product Listing
- Shopping Cart
- Orders Page
- Analytics Dashboard

---

#  Future Enhancements

- Online Payment Gateway Integration
- Wishlist
- Product Reviews & Ratings
- AI Product Recommendation
- Email Verification
- SMS Notifications
- Inventory Forecasting
- Live Chat Support
- Mobile Application
- Docker Deployment
- Cloud Deployment (AWS/Azure)




