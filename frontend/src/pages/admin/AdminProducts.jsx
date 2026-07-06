import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../api/axios";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    api.get("/admin/products").then((res) => setProducts(res.data));
  }, []);

  const filteredProducts = products
    .filter((product) =>
      product.name?.toLowerCase().includes(search.toLowerCase())
    )
    .filter((product) =>
      category
        ? product.category?.toLowerCase().includes(category.toLowerCase())
        : true
    )
    .sort((a, b) => {
      if (sortBy === "price_low") return a.price - b.price;
      if (sortBy === "price_high") return b.price - a.price;
      if (sortBy === "stock_low") return a.stock - b.stock;
      if (sortBy === "stock_high") return b.stock - a.stock;
      return b.id - a.id;
    });

  const stockClass = (stock) => {
    if (stock === 0) return "bg-red-100 text-red-700";
    if (stock <= 5) return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  const stockText = (stock) => {
    if (stock === 0) return "Out of Stock";
    if (stock <= 5) return "Low Stock";
    return "In Stock";
  };

  return (
    <DashboardLayout role="admin">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900">Products</h1>
        <p className="text-slate-500 mt-1">
          Monitor all products listed by vendors.
        </p>
      </div>

      <div className="bg-white p-4 rounded-3xl shadow mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          className="border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search product"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          className="border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <select
          className="border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
          <option value="stock_low">Stock: Low to High</option>
          <option value="stock_high">Stock: High to Low</option>
        </select>

        <button
          onClick={() => {
            setSearch("");
            setCategory("");
            setSortBy("newest");
          }}
          className="bg-slate-700 text-white rounded-xl font-semibold"
        >
          Reset
        </button>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl shadow p-12 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold">No products found</h2>
          <p className="text-slate-500 mt-2">
            Try changing search or filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-3xl shadow hover:shadow-xl transition overflow-hidden"
            >
              <div className="h-48 bg-slate-100">
                {product.image ? (
                  <img
                    src={`http://127.0.0.1:8000/${product.image}`}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-5xl">
                    📦
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="flex justify-between gap-3">
                  <div>
                    <h2 className="font-bold text-lg text-slate-900">
                      {product.name}
                    </h2>
                    <p className="text-sm text-slate-500">
                      Vendor ID: {product.vendor_id}
                    </p>
                  </div>

                  <span
                    className={`text-xs px-3 py-1 rounded-full h-fit ${stockClass(
                      product.stock
                    )}`}
                  >
                    {stockText(product.stock)}
                  </span>
                </div>

                <p className="text-slate-500 text-sm mt-3 line-clamp-2">
                  {product.description}
                </p>

                <div className="grid grid-cols-2 gap-3 mt-5">
                  <div className="bg-slate-50 rounded-2xl p-3">
                    <p className="text-xs text-slate-500">Price</p>
                    <p className="font-bold">₹{product.price}</p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-3">
                    <p className="text-xs text-slate-500">Stock</p>
                    <p className="font-bold">{product.stock}</p>
                  </div>
                </div>

                <div className="mt-4 bg-slate-50 rounded-2xl p-3">
                  <p className="text-xs text-slate-500">Category</p>
                  <p className="font-semibold">{product.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default AdminProducts;