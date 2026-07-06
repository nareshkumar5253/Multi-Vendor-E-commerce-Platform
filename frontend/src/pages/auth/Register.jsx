import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/register", form);
      alert("Registration successful");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-5 py-4">
      <div className="h-full max-w-6xl mx-auto flex flex-col">
        <header className="h-12 flex items-center justify-between">
          <Link to="/" className="text-2xl font-extrabold text-slate-900">
            Market<span className="text-blue-600">Hub</span>
          </Link>

          <div className="text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="ml-2 border border-blue-600 text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 hover:text-white"
            >
              Login
            </Link>
          </div>
        </header>

        <main className="flex-1 min-h-0 flex items-center">
          <div className="w-full h-[calc(100vh-96px)] bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-[35%_65%]">
            <aside className="hidden lg:flex bg-gradient-to-br from-blue-50 to-indigo-100 p-8 flex-col justify-between">
              <div>
                <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                  🚀 Start Your Journey
                </span>

                <h1 className="text-4xl font-extrabold text-slate-900 mt-8 leading-tight">
                  Create your <br />
                  Market<span className="text-blue-600">Hub</span> account
                </h1>

                <p className="text-slate-600 mt-4 text-base">
                  Join customers and vendors in one growing marketplace.
                </p>

                <div className="space-y-5 mt-8">
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center text-xl">
                      🛒
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Sell & Grow</h3>
                      <p className="text-slate-600 text-sm">
                        List products and grow your business.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-xl">
                      🛡️
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Shop Smart</h3>
                      <p className="text-slate-600 text-sm">
                        Find products at great prices.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-purple-100 flex items-center justify-center text-xl">
                      🎧
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">24/7 Support</h3>
                      <p className="text-slate-600 text-sm">
                        Help available anytime.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              
                
            </aside>

            <section className="flex items-center justify-center px-5 sm:px-8 py-5 overflow-y-auto lg:overflow-hidden">
              <form onSubmit={handleSubmit} className="w-full max-w-2xl">
                <div className="text-center mb-5">
                  <div className="mx-auto h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center text-2xl mb-3">
                    👤
                  </div>

                  <h2 className="text-3xl font-extrabold text-slate-900">
                    Create Account
                  </h2>

                  <p className="text-slate-500 mt-1">
                    Join as customer or vendor
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-sm">Full Name</label>
                    <input
                      className="border rounded-xl px-4 py-3 w-full mt-1 outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your full name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-sm">
                      Email Address
                    </label>
                    <input
                      className="border rounded-xl px-4 py-3 w-full mt-1 outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your email"
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-sm">Password</label>
                    <input
                      className="border rounded-xl px-4 py-3 w-full mt-1 outline-none focus:ring-2 focus:ring-blue-500"
                      type="password"
                      placeholder="Create password"
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-sm">
                      Confirm Password
                    </label>
                    <input
                      className="border rounded-xl px-4 py-3 w-full mt-1 outline-none focus:ring-2 focus:ring-blue-500"
                      type="password"
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="font-semibold text-sm">Choose Role</label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, role: "customer" })}
                      className={`border rounded-2xl p-4 text-left transition ${
                        form.role === "customer"
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-full bg-blue-100 flex items-center justify-center text-xl">
                          🛍️
                        </div>
                        <div>
                          <h3 className="font-bold">Customer</h3>
                          <p className="text-sm text-slate-500">
                            Shop from multiple vendors.
                          </p>
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setForm({ ...form, role: "vendor" })}
                      className={`border rounded-2xl p-4 text-left transition ${
                        form.role === "vendor"
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-full bg-green-100 flex items-center justify-center text-xl">
                          🏪
                        </div>
                        <div>
                          <h3 className="font-bold">Vendor</h3>
                          <p className="text-sm text-slate-500">
                            Sell products and manage orders.
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                <button
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold mt-5 hover:opacity-90 disabled:opacity-60"
                >
                  {loading ? "Creating account..." : "Create Account →"}
                </button>

                <p className="text-center mt-4 text-slate-600 text-sm lg:hidden">
                  Already have an account?{" "}
                  <Link to="/login" className="text-blue-600 font-semibold">
                    Login here
                  </Link>
                </p>
              </form>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Register;