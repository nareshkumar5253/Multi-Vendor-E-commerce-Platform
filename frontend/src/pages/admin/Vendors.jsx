import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../api/axios";

function Vendors() {
  const [vendors, setVendors] = useState([]);

  const fetchVendors = async () => {
    const res = await api.get("/admin/vendors");
    setVendors(res.data);
  };

  const approveVendor = async (vendorId) => {
    try {
      await api.put(`/admin/vendors/${vendorId}/approve`);
      alert("Vendor approved");
      fetchVendors();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to approve vendor");
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  return (
    <DashboardLayout role="admin">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900">Vendors</h1>
        <p className="text-slate-500 mt-1">
          Review and approve vendor accounts.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-4 text-left text-sm font-bold text-slate-600">ID</th>
                <th className="p-4 text-left text-sm font-bold text-slate-600">Vendor</th>
                <th className="p-4 text-left text-sm font-bold text-slate-600">Email</th>
                <th className="p-4 text-left text-sm font-bold text-slate-600">Status</th>
                <th className="p-4 text-left text-sm font-bold text-slate-600">Action</th>
              </tr>
            </thead>

            <tbody>
              {vendors.map((vendor) => (
                <tr key={vendor.id} className="border-t hover:bg-slate-50">
                  <td className="p-4">{vendor.id}</td>

                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-full bg-indigo-100 flex items-center justify-center">
                        🏪
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{vendor.name}</p>
                        <p className="text-xs text-slate-500">Vendor Account</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-slate-600">{vendor.email}</td>

                  <td className="p-4">
                    {vendor.is_approved === 1 ? (
                      <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                        Approved
                      </span>
                    ) : (
                      <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-semibold">
                        Pending
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    {vendor.is_approved === 0 ? (
                      <button
                        onClick={() => approveVendor(vendor.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-xl font-semibold"
                      >
                        Approve
                      </button>
                    ) : (
                      <span className="text-slate-400 text-sm">No action</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Vendors;