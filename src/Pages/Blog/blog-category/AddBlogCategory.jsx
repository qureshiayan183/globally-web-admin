import React, { useState } from "react";
import { FiRefreshCw, FiArrowLeft, FiSave } from "react-icons/fi";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { makeRequestAuth } from "../../../_config/api"; // Adjust path
import { useNavigate } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "../../../utils/toastUtils"; // Adjust path

export default function AddBlogCategory() {
  const [formData, setFormData] = useState({ name: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "name" && value.trim()) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Category name is required!");
      return;
    }

    setLoading(true);

    try {
      const response = await makeRequestAuth(
        "post",
        "/admin/createBlogCategory",
        formData,
      );

      showSuccessToast(response?.message || "Category created successfully!");
      setFormData({ name: "" });

      setTimeout(() => {
        navigate("/blogs/category");
      }, 1500);
    } catch (error) {
      const msg = error?.message || "Failed to create category";
      setError(msg);
      showErrorToast(msg);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 transition-all duration-300 flex items-center justify-center">
      {/* CARD CONTAINER */}
      <div
        className="w-full bg-white dark:bg-[#1E2738] 
        rounded-2xl p-6 md:p-8 
        border border-purple-300 dark:border-purple-600/50 shadow-2xl"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Add New Category
          </h2>
          <button
            onClick={() => navigate("/blogs/category")}
            className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition"
          >
            <FiArrowLeft size={24} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g., Technology, Lifestyle..."
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-lg border 
              bg-gray-50 dark:bg-gray-700/50 
              text-gray-800 dark:text-white 
              placeholder-gray-400 dark:placeholder-gray-500
              focus:outline-none focus:ring-2 transition-all ${
                error
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500/20"
              }`}
            />
            {error && (
              <p className="text-red-500 text-sm mt-2 font-medium animate-pulse">
                {error}
              </p>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate("/blogs/category")}
              className="w-1/3 py-3 rounded-xl font-semibold text-gray-700 dark:text-gray-300 
              border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`w-2/3 flex justify-center items-center gap-2 
              bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white 
              font-semibold py-3 rounded-xl transition shadow-lg shadow-purple-500/30 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <FiRefreshCw className="animate-spin h-5 w-5" />
                  Saving...
                </>
              ) : (
                <>
                  <FiSave className="h-5 w-5" />
                  Create Category
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
