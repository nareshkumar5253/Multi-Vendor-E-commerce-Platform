import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";

function CustomerDashboard() {
  return (
    <DashboardLayout role="customer">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 rounded-3xl p-10 text-white shadow-xl">
        <h1 className="text-4xl font-bold">
          Welcome Back 👋
        </h1>

        <p className="mt-3 text-lg text-blue-100">
          Discover amazing products, manage your cart and track every order
          from one place.
        </p>

        <div className="mt-8 flex gap-4 flex-wrap">
          <Link
            to="/customer/products"
            className="bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100"
          >
            Shop Now
          </Link>

          <Link
            to="/customer/orders"
            className="border border-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-700"
          >
            View Orders
          </Link>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">

        <div className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500">Products</p>
              <h2 className="text-4xl font-bold mt-2">250+</h2>
            </div>

            <div className="h-16 w-16 rounded-2xl bg-blue-100 flex items-center justify-center text-3xl">
              🛍️
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500">Cart Items</p>
              <h2 className="text-4xl font-bold mt-2">3</h2>
            </div>

            <div className="h-16 w-16 rounded-2xl bg-green-100 flex items-center justify-center text-3xl">
              🛒
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500">Orders</p>
              <h2 className="text-4xl font-bold mt-2">12</h2>
            </div>

            <div className="h-16 w-16 rounded-2xl bg-orange-100 flex items-center justify-center text-3xl">
              📦
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500">Wishlist</p>
              <h2 className="text-4xl font-bold mt-2">7</h2>
            </div>

            <div className="h-16 w-16 rounded-2xl bg-pink-100 flex items-center justify-center text-3xl">
              ❤️
            </div>
          </div>
        </div>

      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

        <Link
          to="/customer/products"
          className="bg-white rounded-3xl p-6 shadow-lg hover:-translate-y-2 transition"
        >
          <div className="text-5xl">🛍️</div>

          <h2 className="text-2xl font-bold mt-4">
            Browse Products
          </h2>

          <p className="text-gray-500 mt-2">
            Discover products from trusted vendors.
          </p>
        </Link>

        <Link
          to="/customer/cart"
          className="bg-white rounded-3xl p-6 shadow-lg hover:-translate-y-2 transition"
        >
          <div className="text-5xl">🛒</div>

          <h2 className="text-2xl font-bold mt-4">
            My Cart
          </h2>

          <p className="text-gray-500 mt-2">
            Complete your purchases quickly.
          </p>
        </Link>

        <Link
          to="/customer/orders"
          className="bg-white rounded-3xl p-6 shadow-lg hover:-translate-y-2 transition"
        >
          <div className="text-5xl">📦</div>

          <h2 className="text-2xl font-bold mt-4">
            Track Orders
          </h2>

          <p className="text-gray-500 mt-2">
            Check delivery status anytime.
          </p>
        </Link>

      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">
        <h2 className="text-2xl font-bold mb-6">
          Recent Orders
        </h2>

        <table className="w-full">
          <thead className="border-b">
            <tr>
              <th className="text-left py-3">Order ID</th>
              <th className="text-left py-3">Product</th>
              <th className="text-left py-3">Price</th>
              <th className="text-left py-3">Status</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-b">
              <td className="py-4">#1001</td>
              <td>Wireless Headphones</td>
              <td>₹2,999</td>
              <td>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  Delivered
                </span>
              </td>
            </tr>

            <tr className="border-b">
              <td className="py-4">#1002</td>
              <td>Smart Watch</td>
              <td>₹4,999</td>
              <td>
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                  Shipped
                </span>
              </td>
            </tr>

            <tr>
              <td className="py-4">#1003</td>
              <td>Laptop Bag</td>
              <td>₹1,299</td>
              <td>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                  Processing
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Featured Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">

        <div className="bg-blue-100 rounded-3xl p-6 text-center">
          <div className="text-5xl">💻</div>
          <h3 className="font-bold mt-3">Electronics</h3>
        </div>

        <div className="bg-green-100 rounded-3xl p-6 text-center">
          <div className="text-5xl">👕</div>
          <h3 className="font-bold mt-3">Fashion</h3>
        </div>

        <div className="bg-orange-100 rounded-3xl p-6 text-center">
          <div className="text-5xl">🏠</div>
          <h3 className="font-bold mt-3">Home</h3>
        </div>

        <div className="bg-pink-100 rounded-3xl p-6 text-center">
          <div className="text-5xl">📱</div>
          <h3 className="font-bold mt-3">Mobiles</h3>
        </div>

      </div>

      {/* Bottom Banner */}
      <div className="mt-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 text-white shadow-lg">
        <h2 className="text-3xl font-bold">
          🎉 Special Offers Waiting For You
        </h2>

        <p className="mt-3 text-emerald-100">
          Explore exclusive deals, discounts and new arrivals today.
        </p>

        <Link
          to="/customer/products"
          className="inline-block mt-6 bg-white text-emerald-700 px-6 py-3 rounded-xl font-bold"
        >
          Start Shopping
        </Link>
      </div>

    </DashboardLayout>
  );
}

export default CustomerDashboard;