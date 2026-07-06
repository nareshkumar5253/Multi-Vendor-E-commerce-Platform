import { Routes, Route, Link } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProtectedRoute from "./routes/ProtectedRoute";



import CustomerDashboard from "./pages/customer/CustomerDashboard";
import Products from "./pages/customer/Products";

import Cart from "./pages/customer/Cart";
import Orders from "./pages/customer/Orders";
import ProductDetails from "./pages/customer/ProductDetails";


import VendorDashboard from "./pages/vendor/VendorDashboard";
import MyProducts from "./pages/vendor/MyProducts";
import AddProduct from "./pages/vendor/AddProduct";

import VendorOrders from "./pages/vendor/VendorOrders";

import AdminDashboard from "./pages/admin/AdminDashboard";
import Vendors from "./pages/admin/Vendors";
import Users from "./pages/admin/Users";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";


function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white">
      <nav className="flex items-center justify-between px-10 py-6">
        <h1 className="text-2xl font-bold">MarketHub</h1>

        <div className="flex gap-4">
          <Link
            to="/login"
            className="px-5 py-2 rounded-lg border border-white/30 hover:bg-white hover:text-slate-900"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600"
          >
            Register
          </Link>
        </div>
      </nav>

      <section className="px-10 py-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-emerald-400 font-semibold mb-4">
            Multi-Vendor E-commerce Platform
          </p>

          <h2 className="text-5xl font-extrabold leading-tight mb-6">
            Buy, Sell, and Manage Orders in One Smart Marketplace
          </h2>

          <p className="text-slate-300 text-lg mb-8">
            A full-stack marketplace where vendors list products, customers shop,
            and admins manage the complete platform.
          </p>

          
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white text-slate-900 rounded-2xl p-5">
              <h3 className="font-bold text-lg">Vendors</h3>
              <p className="text-sm text-slate-600 mt-2">
                Add products, manage inventory, and track orders.
              </p>
            </div>

            <div className="bg-emerald-400 text-slate-900 rounded-2xl p-5">
              <h3 className="font-bold text-lg">Customers</h3>
              <p className="text-sm mt-2">
                Browse products, cart items, and checkout easily.
              </p>
            </div>

            <div className="bg-indigo-400 text-white rounded-2xl p-5">
              <h3 className="font-bold text-lg">Admins</h3>
              <p className="text-sm mt-2">
                Approve vendors and monitor platform activity.
              </p>
            </div>

            <div className="bg-white text-slate-900 rounded-2xl p-5">
              <h3 className="font-bold text-lg">Orders</h3>
              <p className="text-sm text-slate-600 mt-2">
                Automatic multi-vendor order splitting.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/customer/dashboard" element={<ProtectedRoute allowedRoles={["customer"]}><CustomerDashboard /></ProtectedRoute>} />
      <Route path="/customer/products" element={<ProtectedRoute allowedRoles={["customer"]}><Products /></ProtectedRoute>} />
      <Route path="/customer/cart" element={<ProtectedRoute allowedRoles={["customer"]}><Cart /></ProtectedRoute>} />
      <Route path="/customer/orders" element={<ProtectedRoute allowedRoles={["customer"]}><Orders /></ProtectedRoute>} />
      <Route path="/customer/products/:id" element={<ProtectedRoute allowedRoles={["customer"]}><ProductDetails /></ProtectedRoute>}/>
      

      <Route path="/vendor/dashboard" element={<ProtectedRoute allowedRoles={["vendor"]}><VendorDashboard /></ProtectedRoute>} />
      <Route path="/vendor/products" element={<ProtectedRoute allowedRoles={["vendor"]}><MyProducts /></ProtectedRoute>} />
      <Route path="/vendor/add-product" element={<ProtectedRoute allowedRoles={["vendor"]}><AddProduct /></ProtectedRoute>} />
      <Route path="/vendor/orders" element={<ProtectedRoute allowedRoles={["vendor"]}><VendorOrders /></ProtectedRoute>} />

      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/vendors" element={<ProtectedRoute allowedRoles={["admin"]}><Vendors /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute allowedRoles={["admin"]}><Users /></ProtectedRoute>} />
      <Route path="/admin/products" element={<ProtectedRoute allowedRoles={["admin"]}><AdminProducts /></ProtectedRoute>} />
      <Route path="/admin/orders" element={<ProtectedRoute allowedRoles={["admin"]}><AdminOrders /></ProtectedRoute>} />
      
   
  
    </Routes>
  );
}

export default App;