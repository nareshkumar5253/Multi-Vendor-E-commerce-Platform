import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../api/axios";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/admin/orders").then((res) => setOrders(res.data));
  }, []);

  const statusClass = (status) => {
    if (status === "paid") return "bg-blue-100 text-blue-700";
    if (status === "shipped") return "bg-yellow-100 text-yellow-700";
    if (status === "delivered") return "bg-green-100 text-green-700";
    if (status === "failed") return "bg-red-100 text-red-700";
    return "bg-slate-100 text-slate-700";
  };

  return (
    <DashboardLayout role="admin">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900">Orders</h1>
        <p className="text-slate-500 mt-1">
          Monitor all customer orders across vendors.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl shadow p-12 text-center">
          <div className="text-6xl mb-4">🧾</div>
          <h2 className="text-2xl font-bold">No orders found</h2>
          <p className="text-slate-500 mt-2">
            Customer orders will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-3xl shadow p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
                <div>
                  <h2 className="text-xl font-bold">Order #{order.id}</h2>
                  <p className="text-sm text-slate-500">
                    Customer ID: {order.customer_id} • Vendor ID:{" "}
                    {order.vendor_id}
                  </p>
                </div>

                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${statusClass(
                    order.status
                  )}`}
                >
                  {order.status.toUpperCase()}
                </span>
              </div>

              {order.items && order.items.length > 0 && (
                <div className="mt-4 space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50 rounded-2xl p-4"
                    >
                      <div>
                        <p className="text-xs text-slate-500">Product ID</p>
                        <p className="font-semibold">{item.product_id}</p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">Quantity</p>
                        <p className="font-semibold">{item.quantity}</p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">Price</p>
                        <p className="font-semibold">₹{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between items-center mt-5 pt-4 border-t">
                <p className="text-slate-500">Total Amount</p>
                <p className="text-2xl font-extrabold text-slate-900">
                  ₹{order.total_amount}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default AdminOrders;