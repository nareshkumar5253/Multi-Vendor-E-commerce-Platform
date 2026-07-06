import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);

      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const role = res.data.user.role;

      if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "vendor") {
        navigate("/vendor/dashboard");
      } else {
        navigate("/customer/dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">

      
      {/* Center */}
      <div className="flex-1 flex items-center justify-center p-6">

        <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-10">

          <div className="text-center mb-8">

            <h2 className="text-9x9 font-extra bold text-slate-6000">
              Multi-Vendor E-commerce Platform 
            </h2>

            <p className="text-slate-500 mt-2">
              Sign in to continue
            </p>

          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div>

              <label className="block mb-2 font-semibold text-slate-700">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />

            </div>

            <div>

              <label className="block mb-2 font-semibold text-slate-700">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-indigo-600 text-white py-3 rounded-xl font-bold hover:scale-[1.02] transition disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          <div className="text-center mt-8">

            <p className="text-slate-600">
              Don't have an account?
            </p>

            <Link
              to="/register"
              className="text-blue-600 font-bold hover:underline"
            >
              Create Account
            </Link>

            <div className="mt-5">
              <Link
                to="/"
                className="text-slate-500 hover:text-blue-600"
              >
                ← Back to Home
              </Link>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;