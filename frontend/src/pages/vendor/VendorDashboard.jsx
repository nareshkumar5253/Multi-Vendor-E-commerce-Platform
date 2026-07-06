import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../api/axios";

function VendorDashboard() {
  const [stats, setStats] = useState(null);

  const fetchDashboard = async () => {
    const res = await api.get("/vendor-dashboard/overview");
    setStats(res.data);
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <DashboardLayout role="vendor">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">
          Vendor Dashboard
        </h1>
        <p className="text-slate-500 mt-1">
          Track products, orders, revenue, and sales performance.
        </p>
      </div>

      {!stats ? (
        <div className="bg-white rounded-3xl shadow p-10 text-center">
          Loading dashboard...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl shadow">
              <div className="text-3xl mb-3">📦</div>
              <p className="text-slate-500">Total Products</p>
              <h2 className="text-3xl font-extrabold">{stats.total_products}</h2>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow">
              <div className="text-3xl mb-3">🧾</div>
              <p className="text-slate-500">Total Orders</p>
              <h2 className="text-3xl font-extrabold">{stats.total_orders}</h2>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow">
              <div className="text-3xl mb-3">💰</div>
              <p className="text-slate-500">Revenue</p>
              <h2 className="text-3xl font-extrabold">₹{stats.revenue}</h2>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow">
              <div className="text-3xl mb-3">⚠️</div>
              <p className="text-slate-500">Low Stock</p>
              <h2 className="text-3xl font-extrabold">
                {stats.low_stock_products}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
            <div className="bg-white rounded-3xl shadow p-6">
              <h2 className="text-xl font-bold mb-4">Monthly Revenue</h2>

              {stats.monthly_stats.length === 0 ? (
                <p className="text-slate-500">No revenue data yet.</p>
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.monthly_stats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#8B5CF6"
                        strokeWidth={4}
                        dot={{
                       r: 6,
                       fill: "#2563EB",
                      }}
                      LabelList
                     dataKey="revenue"
                     position="top"
                     formatter={(value) => `₹${value}`}
                      fill="#2563EB"
                     />
                     

                      
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl shadow p-6">
              <h2 className="text-xl font-bold mb-4">Monthly Orders</h2>

              {stats.monthly_stats.length === 0 ? (
                <p className="text-slate-500">No order data yet.</p>
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.monthly_stats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="orders" fill="#8B5CF6" radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6 mt-8">
            <div className="bg-white rounded-3xl shadow p-6">
              <h2 className="text-xl font-bold mb-4">Top Selling Products</h2>

              {stats.top_products.length === 0 ? (
                <p className="text-slate-500">No sales data yet.</p>
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.top_products}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="sold_count" fill="#8B5CF6" radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-blue-600 rounded-3xl shadow p-6 text-white">
              <h2 className="text-2xl font-bold">Grow Your Store</h2>
              <p className="mt-3 text-blue-100">
                Add more products, manage low stock, and fulfill orders faster.
              </p>

              <Link
                to="/vendor/add-product"
                className="inline-block bg-white text-blue-700 px-5 py-3 rounded-xl font-semibold mt-6"
              >
                Add New Product
              </Link>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

export default VendorDashboard;