import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../api/axios";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [reviewStatus, setReviewStatus] = useState({});

  const fetchOrders = async () => {
    const res = await api.get("/orders/my-orders");
    setOrders(res.data);

    const status = {};

    for (const order of res.data) {
      for (const item of order.items) {
        try {
          const review = await api.get(`/reviews/check/${item.product_id}`);
          status[item.product_id] = review.data;
        } catch {
          status[item.product_id] = { reviewed: false };
        }
      }
    }

    setReviewStatus(status);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const statusClass = (status) => {
    if (status === "paid") return "bg-blue-100 text-blue-700";
    if (status === "shipped") return "bg-yellow-100 text-yellow-700";
    if (status === "delivered") return "bg-green-100 text-green-700";
    if (status === "failed") return "bg-red-100 text-red-700";
    return "bg-slate-100 text-slate-700";
  };

  const canReview = (status) => {
    return status === "paid" || status === "shipped" || status === "delivered";
  };

  return (
    <DashboardLayout role="customer">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900">My Orders</h1>
        <p className="text-slate-500 mt-1">
          Track your order status and review purchased products.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl shadow p-12 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold">No orders yet</h2>
          <p className="text-slate-500 mt-2">
            Your placed orders will appear here.
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
                    Vendor ID: {order.vendor_id}
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

              <div className="mt-4 space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 rounded-2xl p-4"
                  >
                    <div>
                      <p className="font-semibold">
                        Product ID: {item.product_id}
                      </p>
                      <p className="text-sm text-slate-500">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm text-slate-500">
                        Price: ₹{item.price}
                      </p>
                    </div>

                    {canReview(order.status) &&
                      (reviewStatus[item.product_id]?.reviewed ? (
                        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-xl font-semibold">
                          <span>
                            {"⭐".repeat(reviewStatus[item.product_id].rating)}
                          </span>
                          Reviewed
                        </div>
                      ) : (
                        <Link
                          to={`/customer/products/${item.product_id}/review`}
                          className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold text-center"
                        >
                          ⭐ Review Product
                        </Link>
                      ))}
                  </div>
                ))}
              </div>

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

export default Orders;