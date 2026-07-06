import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../api/axios";
import { Link } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    min_price: "",
    max_price: "",
    sort_by: "newest",
    page: 1,
    limit: 10,
  });

  const fetchProducts = async () => {
    const res = await api.get("/products/", {
      params: {
        search: filters.search || undefined,
        category: filters.category || undefined,
        min_price: filters.min_price || undefined,
        max_price: filters.max_price || undefined,
        sort_by: filters.sort_by,
        page: filters.page,
        limit: filters.limit,
      },
    });

    setProducts(res.data);
  };
  const resetFilters = () => {
      setFilters({
        search: "",
        category: "",
        min_price: "",
        max_price: "",
        sort_by: "newest",
        page: 1,
        limit: 10,
      });
    };

  const addToCart = async (productId) => {
    try {
      await api.post("/cart/add", {
        product_id: productId,
        quantity: 1,
      });

      alert("Added to cart");
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to add to cart");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters.page]);

  const applyFilters = (e) => {
    e.preventDefault();
    setFilters({ ...filters, page: 1 });
    setTimeout(fetchProducts, 0);
  };

  return (
    <DashboardLayout role="customer">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Products</h1>
          <p className="text-slate-500 mt-1">
            Discover products from multiple vendors.
          </p>
        </div>
      </div>

      <form
        onSubmit={applyFilters}
        className="bg-white p-4 rounded-3xl shadow mb-6 grid grid-cols-1 md:grid-cols-7 gap-3"
      >
        <input
          className="border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search product"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />

        <input
          className="border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Category"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        />

        <input
          className="border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
          type="number"
          placeholder="Min Price"
          value={filters.min_price}
          onChange={(e) => setFilters({ ...filters, min_price: e.target.value })}
        />

        <input
          className="border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
          type="number"
          placeholder="Max Price"
          value={filters.max_price}
          onChange={(e) => setFilters({ ...filters, max_price: e.target.value })}
        />
        <select
          className="border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.sort_by}
          onChange={(e) => setFilters({ ...filters, sort_by: e.target.value })}
        >
          <option value="newest">Newest</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
          <option value="stock_low">Stock: Low to High</option>
          <option value="stock_high">Stock: High to Low</option>
        </select>
        

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-semibold">
          Search
        </button>
        <button
          type="button"
          onClick={resetFilters}
          className="bg-slate-700 hover:bg-slate-800 text-white px-4 py-3 rounded-xl font-semibold"
        >
          Reset
        </button>
      </form>

      {products.length === 0 ? (
        <div className="bg-white rounded-3xl shadow p-10 text-center">
          <div className="text-5xl mb-3">🔍</div>
          <h2 className="text-xl font-bold">No products found</h2>
          <p className="text-slate-500 mt-2">Try changing search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-3xl shadow hover:shadow-xl transition overflow-hidden"
            >
              <Link to={`/customer/products/${product.id}`}>
                <div className="h-48 bg-slate-100 cursor-pointer">
                  {product.image ? (
                    <img
                      src={`http://127.0.0.1:8000/${product.image}`}
                      alt={product.name}
                      className="h-full w-full object-cover hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-5xl">
                      🛍️
                    </div>
                  )}
                </div>
              </Link>

              <div className="p-5">
                <div className="flex justify-between gap-3">
                  <div>
                    <h2 className="font-bold text-lg text-slate-900">
                      {product.name}
                    </h2>
                    <p className="text-sm text-slate-500">{product.category}</p>
                  </div>

                  <span
                    className={`text-xs px-3 py-1 rounded-full h-fit ${
                      product.stock === 0
                        ? "bg-red-100 text-red-700"
                        : product.stock <= 5
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {product.stock_status}
                  </span>
                </div>

                <p className="text-slate-500 text-sm mt-3 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center justify-between mt-5">
                  <div>
                    <p className="text-2xl font-extrabold text-slate-900">
                      ₹{product.price}
                    </p>
                    <p className="text-sm text-slate-500">
                      Stock: {product.stock}
                    </p>
                  </div>
                  <div className="flex gap-3 mt-5">
                  <Link
                    to={`/customer/products/${product.id}`}
                    className="px-4 py-3 rounded-xl bg-slate-100 text-slate-700 font-semibold">
                    View
                  </Link>

                  <button
                    onClick={() => addToCart(product.id)}
                    disabled={product.stock === 0}
                    className={`px-4 py-3 rounded-xl text-white font-semibold ${
                      product.stock === 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {product.stock === 0 ? "Sold Out" : "Add"}
                  </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-center gap-3 mt-8">
        <button
          disabled={filters.page === 1}
          onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
          className="bg-slate-800 text-white px-5 py-3 rounded-xl disabled:bg-slate-300"
        >
          Previous
        </button>

        <span className="bg-white px-5 py-3 rounded-xl shadow">
          Page {filters.page}
        </span>

        <button
          onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
          className="bg-slate-800 text-white px-5 py-3 rounded-xl"
        >
          Next
        </button>
      </div>
    </DashboardLayout>
  );
}

export default Products;