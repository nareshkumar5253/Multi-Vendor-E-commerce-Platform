import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../api/axios";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image: null,
  });

  const [oldImage, setOldImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => {
      setForm({
        name: res.data.name,
        description: res.data.description || "",
        price: res.data.price,
        stock: res.data.stock,
        category: res.data.category || "",
        image: null,
      });

      setOldImage(res.data.image);
    });
  }, [id]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, image: file });
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", form.name);
    data.append("description", form.description);
    data.append("price", form.price);
    data.append("stock", form.stock);
    data.append("category", form.category);

    if (form.image) {
      data.append("image", form.image);
    }

    setLoading(true);

    try {
      await api.put(`/products/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Product updated successfully");
      navigate("/vendor/products");
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="vendor">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900">
          Edit Product
        </h1>
        <p className="text-slate-500 mt-1">
          Update product details, stock, price, and image.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6"
      >
        <div className="bg-white rounded-3xl shadow p-6 space-y-5">
          <div>
            <label className="font-semibold text-sm">Product Name</label>
            <input
              className="border rounded-xl p-3 w-full mt-2 outline-none focus:ring-2 focus:ring-blue-500"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="font-semibold text-sm">Description</label>
            <textarea
              className="border rounded-xl p-3 w-full mt-2 outline-none focus:ring-2 focus:ring-blue-500 min-h-28"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="font-semibold text-sm">Price</label>
              <input
                className="border rounded-xl p-3 w-full mt-2 outline-none focus:ring-2 focus:ring-blue-500"
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="font-semibold text-sm">Stock</label>
              <input
                className="border rounded-xl p-3 w-full mt-2 outline-none focus:ring-2 focus:ring-blue-500"
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="font-semibold text-sm">Category</label>
              <input
                className="border rounded-xl p-3 w-full mt-2 outline-none focus:ring-2 focus:ring-blue-500"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="bg-yellow-50 rounded-2xl p-4 flex gap-3">
            <div className="text-2xl">⚠️</div>
            <div>
              <h3 className="font-bold text-slate-900">Update Carefully</h3>
              <p className="text-sm text-slate-500">
                Changing stock affects customer purchase availability.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow p-6 h-fit">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Product Image
          </h2>

          <div className="h-64 bg-slate-100 rounded-3xl overflow-hidden flex items-center justify-center mb-4">
            {preview ? (
              <img
                src={preview}
                alt="New Preview"
                className="h-full w-full object-cover"
              />
            ) : oldImage ? (
              <img
                src={`http://127.0.0.1:8000/${oldImage}`}
                alt="Current Product"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="text-center text-slate-400">
                <div className="text-6xl mb-2">📷</div>
                <p>No image available</p>
              </div>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="border rounded-xl p-3 w-full"
          />

          <button
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold mt-6 disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update Product"}
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
}

export default EditProduct;