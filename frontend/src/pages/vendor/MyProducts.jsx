import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../api/axios";

function MyProducts() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const res = await api.get("/products/my-products");
    setProducts(res.data);
  };

  const deleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    await api.delete(`/products/${id}`);
    alert("Product deleted");
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const stockClass = (stock) => {
    if (stock === 0) return "bg-red-100 text-red-700";
    if (stock <= 5) return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  return (
    <DashboardLayout role="vendor">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            My Products
          </h1>
          <p className="text-slate-500 mt-1">
            Manage product listings, stock, and pricing.
          </p>
        </div>

        <Link
          to="/vendor/add-product"
          className="bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold"
        >
          + Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-3xl shadow p-12 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold">No products added yet</h2>
          <p className="text-slate-500 mt-2">
            Start by adding your first product.
          </p>

          <Link
            to="/vendor/add-product"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold mt-6"
          >
            Add Product
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {products.map((product) => (
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
                      {product.category}
                    </p>
                  </div>

                  <span
                    className={`text-xs px-3 py-1 rounded-full h-fit ${stockClass(
                      product.stock
                    )}`}
                  >
                    {product.stock_status}
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

                <div className="flex gap-3 mt-5">
                  <Link
                    to={`/vendor/products/edit/${product.id}`}
                    className="flex-1 text-center bg-blue-600 text-white px-4 py-3 rounded-xl font-semibold"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="flex-1 bg-red-100 text-red-700 px-4 py-3 rounded-xl font-semibold hover:bg-red-600 hover:text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default MyProducts;