import { Link, useLocation, useNavigate } from "react-router-dom";

function DashboardLayout({ children, role }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menuItems = {
    customer: [
      { name: "Dashboard", path: "/customer/dashboard", icon: "🏠" },
      { name: "Products", path: "/customer/products", icon: "🛍️" },
      { name: "Wishlist", path: "/customer/wishlist", icon: "❤️" },
      { name: "Cart", path: "/customer/cart", icon: "🛒" },
      { name: "My Orders", path: "/customer/orders", icon: "📦" },
      { name: "Profile", path: "/customer/profile", icon: "👤" },
    ],

    vendor: [
      { name: "Dashboard", path: "/vendor/dashboard", icon: "🏠" },
      { name: "My Products", path: "/vendor/products", icon: "📦" },
      { name: "Add Product", path: "/vendor/add-product", icon: "➕" },
      { name: "Orders", path: "/vendor/orders", icon: "🧾" },
      { name: "Profile", path: "/vendor/profile", icon: "👤" },
    ],

    admin: [
      { name: "Dashboard", path: "/admin/dashboard", icon: "📊" },
      { name: "Users", path: "/admin/users", icon: "👥" },
      { name: "Vendors", path: "/admin/vendors", icon: "🏪" },
      { name: "Products", path: "/admin/products", icon: "📦" },
      { name: "Orders", path: "/admin/orders", icon: "🧾" },
      { name: "Profile", path: "/admin/profile", icon: "👤" },
      { name: "Coupons", path: "/admin/coupons", icon: "🏷️" },
    ],
  };

  const firstLetter = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Top Navbar */}
      <header className="bg-slate-950 shadow-lg sticky top-0 z-50">
        <div className="flex items-center justify-between px-8 h-20">

          {/* Logo */}
          <div>
            <h1 className="text-3xl font-extrabold text-white">
              Market<span className="text-blue-500">Hub</span>
            </h1>

            <p className="text-xs text-slate-400 capitalize">
              {role} Panel
            </p>
          </div>

          {/* Menu */}
          <nav className="hidden lg:flex items-center gap-3">
            {menuItems[role].map((item) => {
              const active = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    active
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-5">

            <div className="hidden md:flex items-center gap-3">

              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                {firstLetter}
              </div>

              <div>
                <p className="font-semibold text-white">
                  {user?.name}
                </p>

                <p className="text-xs text-slate-400 capitalize">
                  {role}
                </p>
              </div>

            </div>

            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl font-semibold transition"
            >
              Logout
            </button>

          </div>

        </div>
      </header>

      {/* Page Content */}
      <main className="p-8">
        {children}
      </main>

    </div>
  );
}

export default DashboardLayout;