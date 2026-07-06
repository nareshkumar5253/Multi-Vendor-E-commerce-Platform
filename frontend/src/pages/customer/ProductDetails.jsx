import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../api/axios";
import { Link } from "react-router-dom";
function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);

  const fetchProduct = async () => {
    const res = await api.get(`/products/${id}`);
    setProduct(res.data);
  };

  const fetchReviews = async () => {
    const res = await api.get(`/reviews/product/${id}`);
    setReviews(res.data);
  };

  const addToCart = async () => {
    try {
      await api.post("/cart/add", {
        product_id: Number(id),
        quantity: 1,
      });

      alert("Added to cart");
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to add to cart");
    }
  };

  const addToWishlist = async () => {
    try {
      await api.post("/wishlist/", {
        product_id: Number(id),
      });

      alert("Added to wishlist");
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to add to wishlist");
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  if (!product) {
    return (
      <DashboardLayout role="customer">
        <p>Loading...</p>
      </DashboardLayout>
    );
  }

  const avgRating =
    reviews.length === 0
      ? 0
      : (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1);

  return (
    <DashboardLayout role="customer">
        <Link
        to="/customer/products"
        className="inline-block mb-5 bg-slate-800 text-white px-5 py-3 rounded-xl font-semibold hover:bg-slate-900"
        >
        ← Back to Products
        </Link>
      <div className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-6">
        <div className="bg-white rounded-3xl shadow overflow-hidden h-fit">
          <div className="h-96 bg-slate-100">
            {product.image ? (
              <img
                src={`http://127.0.0.1:8000/${product.image}`}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full flex items-center justify-center text-6xl">
                🛍️
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow p-6">
          <div className="flex justify-between gap-4">
            <div>
              <p className="text-blue-600 font-semibold">{product.category}</p>
              <h1 className="text-3xl font-extrabold text-slate-900 mt-2">
                {product.name}
              </h1>
            </div>

            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold h-fit">
              {product.stock_status}
            </span>
          </div>

          <p className="text-slate-500 mt-4">{product.description}</p>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-sm text-slate-500">Price</p>
              <p className="text-2xl font-bold">₹{product.price}</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-sm text-slate-500">Stock</p>
              <p className="text-2xl font-bold">{product.stock}</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-sm text-slate-500">Rating</p>
              <p className="text-2xl font-bold">⭐ {avgRating}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
            <button
              onClick={addToCart}
              disabled={product.stock === 0}
              className={`py-3 rounded-xl text-white font-semibold ${
                product.stock === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>

            <button
              onClick={addToWishlist}
              className="py-3 rounded-xl bg-red-100 text-red-700 font-semibold hover:bg-red-600 hover:text-white"
            >
              ❤️ Wishlist
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow p-6 mt-6">
        <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>

        {reviews.length === 0 ? (
          <p className="text-slate-500">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-slate-50 rounded-2xl p-4">
                <p className="font-bold">⭐ {review.rating}/5</p>
                <p className="text-slate-600 mt-1">{review.comment}</p>
                <p className="text-xs text-slate-400 mt-2">
                  Customer ID: {review.customer_id}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default ProductDetails;