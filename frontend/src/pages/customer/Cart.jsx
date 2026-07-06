import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../api/axios";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [showCoupons, setShowCoupons] = useState(false);

  const fetchCart = async () => {
    const res = await api.get("/cart/");
    setCartItems(res.data);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const total = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  );

  const payableAmount = finalAmount !== null ? finalAmount : total;

  const clearCoupon = () => {
    setCouponCode("");
    setDiscount(0);
    setFinalAmount(null);
    setAppliedCoupon("");
    setShowCoupons(false);
  };

  const fetchAvailableCoupons = async () => {
    try {
      const res = await api.get("/coupons/available", {
        params: { cart_total: total },
      });

      setAvailableCoupons(res.data);
      setShowCoupons(true);
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to load coupons");
    }
  };

  const applyCoupon = async (selectedCode) => {
    try {
      const res = await api.post("/coupons/apply", {
        code: selectedCode,
        cart_total: total,
      });

      setCouponCode(selectedCode);
      setDiscount(res.data.discount_amount);
      setFinalAmount(res.data.final_amount);
      setAppliedCoupon(res.data.coupon_code);
      setShowCoupons(false);

      alert("Coupon applied successfully");
    } catch (err) {
      alert(err.response?.data?.detail || "Invalid coupon");
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;

    await api.put(`/cart/${itemId}`, {
      quantity: Number(quantity),
    });

    clearCoupon();
    fetchCart();
  };

  const removeItem = async (itemId) => {
    await api.delete(`/cart/${itemId}`);

    clearCoupon();
    fetchCart();
  };

  const checkout = async () => {
    setLoading(true);

    try {
      await api.post("/orders/checkout", {
        payment_method: "UPI",
        coupon_code: appliedCoupon || null,
      });

      alert("Checkout completed");
      fetchCart();
      clearCoupon();
    } catch (err) {
      alert(err.response?.data?.detail || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="customer">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900">My Cart</h1>
        <p className="text-slate-500 mt-1">
          Review your products before checkout.
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-white rounded-3xl shadow p-12 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold">Your cart is empty</h2>
          <p className="text-slate-500 mt-2">
            Add products to your cart and checkout easily.
          </p>

          <Link
            to="/customer/products"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold mt-6"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl shadow p-5 flex flex-col md:flex-row gap-5 md:items-center justify-between"
              >
                <div className="flex gap-4">
                  <div className="h-24 w-24 bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden">
                    {item.product?.image ? (
                      <img
                        src={`http://127.0.0.1:8000/${item.product.image
                          .replaceAll("\\", "/")
                          .replace(/^\/+/, "")}`}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl">🛍️</span>
                    )}
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      {item.product.name}
                    </h2>
                    <p className="text-slate-500 text-sm">
                      {item.product.category}
                    </p>
                    <p className="font-bold mt-2">₹{item.product.price}</p>
                    <p className="text-sm text-slate-500">
                      Available Stock: {item.product.stock}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={item.quantity}
                    min="1"
                    className="border rounded-xl p-3 w-24 outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => updateQuantity(item.id, e.target.value)}
                  />

                  <button
                    onClick={() => removeItem(item.id)}
                    className="bg-red-100 text-red-700 px-4 py-3 rounded-xl font-semibold hover:bg-red-600 hover:text-white"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-3xl shadow p-6 h-fit">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Order Summary
            </h2>

            <div className="space-y-3 border-b pb-4">
              <div className="flex justify-between">
                <span className="text-slate-500">Items</span>
                <span>{cartItems.length}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal</span>
                <span>₹{total}</span>
              </div>

              {appliedCoupon && (
                <>
                  <div className="flex justify-between text-green-700 font-semibold">
                    <span>Coupon Applied</span>
                    <span>{appliedCoupon} ✅</span>
                  </div>

                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                </>
              )}

              <div className="flex justify-between">
                <span className="text-slate-500">Delivery</span>
                <span className="text-green-600 font-semibold">Free</span>
              </div>
            </div>

            <div className="mt-5">
              {!appliedCoupon ? (
                <>
                  <button
                  onClick={() => {
                    if (showCoupons) {
                      setShowCoupons(false);
                    } else {
                      fetchAvailableCoupons();
                    }
                  }}
                  className="w-full bg-blue-50 border border-blue-200 rounded-xl py-3 font-semibold text-blue-700 hover:bg-blue-100 transition"
                >
                  {showCoupons ? "Hide Coupons" : "🏷 View Available Coupons"}
                </button>

                  {showCoupons && (
                    <div className="space-y-3 mt-4">
                      {availableCoupons.length === 0 ? (
                        <p className="text-sm text-slate-500 text-center">
                          No active coupons available.
                        </p>
                      ) : (
                        availableCoupons.map((coupon) => (
                          <div
                            key={coupon.id}
                            className={`border rounded-2xl p-4 bg-slate-50 ${
                              coupon.eligible
                                ? "border-blue-300"
                                : "border-slate-200 opacity-70"
                            }`}
                          >
                            <div className="flex justify-between items-center gap-3">
                              <div>
                                <h3 className="text-lg font-extrabold text-slate-900">
                                  {coupon.code}
                                </h3>

                                <p className="text-sm text-slate-500 mt-1">
                                  {coupon.discount_type === "percentage"
                                    ? `${coupon.discount_value}% OFF`
                                    : `₹${coupon.discount_value} OFF`}
                                </p>

                                <p className="text-xs text-slate-400 mt-1">
                                  Minimum order ₹{coupon.min_order_amount}
                                </p>

                                {!coupon.eligible && (
                                  <p className="text-xs text-red-500 mt-2">
                                    Add ₹{coupon.amount_needed} more to unlock
                                  </p>
                                )}
                              </div>

                              <button
                                disabled={!coupon.eligible}
                                onClick={() => applyCoupon(coupon.code)}
                                className={`px-4 py-2 rounded-xl font-semibold ${
                                  coupon.eligible
                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                                }`}
                              >
                                Apply
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-green-700 font-semibold">
                        Coupon Applied ✅
                      </p>
                      <h3 className="font-extrabold text-green-800">
                        {appliedCoupon}
                      </h3>
                    </div>

                    <button
                      onClick={() => {
                        clearCoupon();
                        setTimeout(fetchAvailableCoupons, 0);
                      }}
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      Change
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between mt-5 text-xl font-extrabold">
              <span>Total</span>
              <span>₹{payableAmount}</span>
            </div>

            <button
              onClick={checkout}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-xl font-semibold mt-6 disabled:opacity-60"
            >
              {loading ? "Processing..." : "Checkout with UPI"}
            </button>

            <p className="text-xs text-slate-500 mt-4 text-center">
              Payment is simulated for demo purpose.
            </p>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Cart;