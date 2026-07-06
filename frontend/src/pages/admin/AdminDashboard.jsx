import { useEffect, useState } from "react";
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
  LabelList,
} from "recharts";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../api/axios";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/admin/dashboard");
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center h-[70vh]">
          <div className="bg-white rounded-3xl shadow-xl px-10 py-8">
            <h2 className="text-3xl font-bold text-blue-600">
              Loading Dashboard...
            </h2>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!stats) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center h-[70vh]">
          <div className="bg-red-50 rounded-3xl shadow-xl px-10 py-8">
            <h2 className="text-3xl font-bold text-red-600">
              Failed to Load Dashboard
            </h2>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const cards = [
    {
      title: "Total Users",
      value: stats.total_users,
      icon: "👥",
      color: "from-blue-500 to-blue-700",
    },
    {
      title: "Vendors",
      value: stats.total_vendors,
      icon: "🏪",
      color: "from-purple-500 to-purple-700",
    },
    {
      title: "Customers",
      value: stats.total_customers,
      icon: "🛍️",
      color: "from-green-500 to-green-700",
    },
    {
      title: "Pending Vendors",
      value: stats.pending_vendors,
      icon: "⏳",
      color: "from-yellow-500 to-orange-500",
    },
    {
      title: "Products",
      value: stats.total_products,
      icon: "📦",
      color: "from-indigo-500 to-indigo-700",
    },
    {
      title: "Revenue",
      value: `₹${stats.total_revenue}`,
      icon: "💰",
      color: "from-emerald-500 to-green-700",
    },
  ];

  return (
    <DashboardLayout role="admin">
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-2">

        {/* Header */}

        <div className="flex justify-between items-center mb-8">

          <div>
            <h1 className="text-5xl font-black text-slate-900">
              Admin Dashboard
            </h1>

            <p className="text-slate-500 text-lg mt-2">
              Monitor your marketplace performance in real time.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg border p-6">
            <p className="text-slate-500">Total Revenue</p>

            <h2 className="text-4xl font-black text-emerald-600">
              ₹{stats.total_revenue}
            </h2>
          </div>

        </div>

        {/* Cards */}

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-7">

          {cards.map((card) => (

            <div
              key={card.title}
              className="bg-white rounded-3xl border shadow-md hover:shadow-2xl hover:-translate-y-2 duration-300 p-7"
            >

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-slate-500 font-medium">
                    {card.title}
                  </p>

                  <h2 className="text-5xl font-black mt-3">
                    {card.value}
                  </h2>

                </div>

                <div
                  className={`bg-gradient-to-r ${card.color} h-16 w-16 rounded-2xl flex items-center justify-center text-3xl text-white shadow-lg`}
                >
                  {card.icon}
                </div>

              </div>

            </div>

          ))}

        </div>

        {/* Charts */}

        <div className="grid xl:grid-cols-2 gap-7 mt-8">

          <div className="bg-white rounded-3xl shadow-xl border p-7">

            <h2 className="text-2xl font-bold mb-6">
              Monthly Revenue
            </h2>

            {stats.monthly_stats.length === 0 ? (

              <div className="h-80 flex items-center justify-center text-slate-500">
                No Revenue Data
              </div>

            ) : (

              <div className="h-80">

                <ResponsiveContainer>

                  <LineChart data={stats.monthly_stats}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="month" />

                    <YAxis />

                    <Tooltip />

                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#10B981"
                      strokeWidth={5}
                      dot={{
                        r: 7,
                        fill: "#10B981",
                        stroke: "#fff",
                        strokeWidth: 3,
                      }}
                    >
                      <LabelList
                        dataKey="revenue"
                        position="top"
                      />
                    </Line>

                  </LineChart>

                </ResponsiveContainer>

              </div>

            )}

          </div>

          <div className="bg-white rounded-3xl shadow-xl border p-7">

            <h2 className="text-2xl font-bold mb-6">
              Monthly Orders
            </h2>

            {stats.monthly_stats.length === 0 ? (

              <div className="h-80 flex items-center justify-center text-slate-500">
                No Orders Data
              </div>

            ) : (

              <div className="h-80">

                <ResponsiveContainer>

                  <BarChart data={stats.monthly_stats}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="month" />

                    <YAxis />

                    <Tooltip />

                    <Bar
                      dataKey="orders"
                      fill="#8B5CF6"
                      radius={[12,12,0,0]}
                    >
                      <LabelList
                        dataKey="orders"
                        position="top"
                      />
                    </Bar>

                  </BarChart>

                </ResponsiveContainer>

              </div>

            )}

          </div>

        </div>
                {/* Platform Overview */}

        <div className="mt-8">

          <div className="rounded-[32px] bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 shadow-2xl p-10 text-white">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-3xl font-black">
                  Platform Overview
                </h2>

                <p className="text-slate-300 mt-2">
                  Real-time insights into your marketplace performance.
                </p>

              </div>

              <div className="hidden lg:block text-7xl opacity-20">
                📊
              </div>

            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-8">

              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-7 hover:bg-white/20 duration-300">

                <p className="text-blue-100">
                  Total Orders
                </p>

                <h2 className="text-5xl font-black mt-3">
                  {stats.total_orders}
                </h2>

                <p className="text-green-300 mt-3">
                  Active Marketplace Orders
                </p>

              </div>

              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-7 hover:bg-white/20 duration-300">

                <p className="text-blue-100">
                  Pending Vendors
                </p>

                <h2 className="text-5xl font-black mt-3">
                  {stats.pending_vendors}
                </h2>

                <p className="text-yellow-300 mt-3">
                  Awaiting Approval
                </p>

              </div>

              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-7 hover:bg-white/20 duration-300">

                <p className="text-blue-100">
                  Products Listed
                </p>

                <h2 className="text-5xl font-black mt-3">
                  {stats.total_products}
                </h2>

                <p className="text-cyan-300 mt-3">
                  Available Products
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* Quick Actions */}

        <div className="mt-8">

          <h2 className="text-3xl font-black text-slate-900 mb-6">
            Quick Actions
          </h2>

          <div className="grid md:grid-cols-4 gap-6">

            <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-3xl p-7 shadow-xl hover:scale-105 duration-300">

              <div className="text-5xl">
                👥
              </div>

              <h3 className="text-2xl font-bold mt-4">
                Users
              </h3>

              <p className="text-blue-100 mt-2">
                View & Manage Users
              </p>

            </button>

            <button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-3xl p-7 shadow-xl hover:scale-105 duration-300">

              <div className="text-5xl">
                🏪
              </div>

              <h3 className="text-2xl font-bold mt-4">
                Vendors
              </h3>

              <p className="text-green-100 mt-2">
                Approve Vendors
              </p>

            </button>

            <button className="bg-purple-600 hover:bg-purple-700 text-white rounded-3xl p-7 shadow-xl hover:scale-105 duration-300">

              <div className="text-5xl">
                📦
              </div>

              <h3 className="text-2xl font-bold mt-4">
                Products
              </h3>

              <p className="text-purple-100 mt-2">
                Marketplace Products
              </p>

            </button>

            <button className="bg-orange-500 hover:bg-orange-600 text-white rounded-3xl p-7 shadow-xl hover:scale-105 duration-300">

              <div className="text-5xl">
                💰
              </div>

              <h3 className="text-2xl font-bold mt-4">
                Revenue
              </h3>

              <p className="text-orange-100 mt-2">
                Revenue Analytics
              </p>

            </button>

          </div>

        </div>

        {/* Bottom Statistics */}

        <div className="grid md:grid-cols-3 gap-6 mt-8">

          <div className="bg-white rounded-3xl shadow-lg border p-7">

            <p className="text-slate-500">
              Marketplace Health
            </p>

            <h2 className="text-4xl font-black text-green-600 mt-3">
              Excellent
            </h2>

            <div className="w-full bg-slate-200 rounded-full h-3 mt-5">
              <div className="bg-green-500 h-3 rounded-full w-[92%]"></div>
            </div>

          </div>

          <div className="bg-white rounded-3xl shadow-lg border p-7">

            <p className="text-slate-500">
              Active Customers
            </p>

            <h2 className="text-4xl font-black text-blue-600 mt-3">
              {stats.total_customers}
            </h2>

            <p className="mt-3 text-slate-500">
              Registered Customers
            </p>

          </div>

          <div className="bg-white rounded-3xl shadow-lg border p-7">

            <p className="text-slate-500">
              Registered Vendors
            </p>

            <h2 className="text-4xl font-black text-purple-600 mt-3">
              {stats.total_vendors}
            </h2>

            <p className="mt-3 text-slate-500">
              Marketplace Sellers
            </p>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default AdminDashboard;