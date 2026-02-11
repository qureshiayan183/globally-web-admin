import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { makeRequestAuth } from "../../../_config/api";
import { showErrorToast, showSuccessToast } from "../../../utils/toastUtils";
import Spinner from "../../../utils/Loader";
import { FiEdit2, FiPlus, FiAlertCircle } from "react-icons/fi";

export default function BlogCategory() {
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  const [editModal, setEditModal] = useState({ show: false, data: null });
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    id: null,
    isDisable: null,
    message: "",
  });

  const fetchCategories = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      try {
        const response = await makeRequestAuth(
          "post",
          "/admin/getBlogListCategory",
          {
            keyWord: "",
            sortOrder: "desc",
            sortBy: "createdAt",
            pageNo: page,
            size: pageSize,
          },
        );
        setCategories(response.data.list || []);
        setTotal(response.data.total);
      } catch (error) {
        showErrorToast(error.message || "Failed to load categories");
      } finally {
        setIsLoading(false);
      }
    },
    [pageSize],
  );

  useEffect(() => {
    fetchCategories(currentPage);
  }, [currentPage, fetchCategories]);

  const handleUpdate = async () => {
    try {
      const response = await makeRequestAuth(
        "post",
        "/admin/updateBlogCategory",
        {
          id: editModal.data._id,
          name: editModal.data.name,
        },
      );
      setCategories((prev) =>
        prev.map((c) =>
          c._id === editModal.data._id
            ? { ...c, name: editModal.data.name }
            : c,
        ),
      );
      setEditModal({ show: false, data: null });
      showSuccessToast(response?.message || "Category updated successfully!");
    } catch (error) {
      showErrorToast(error.message || "Update failed");
    }
  };

  const handleStatusToggle = async () => {
    const { id, isDisable } = confirmModal;
    try {
      const newStatus = !isDisable;
      const response = await makeRequestAuth(
        "post",
        "/admin/updateBlogCategoryStatus",
        { id },
      );

      setCategories((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, isDisable: newStatus } : item,
        ),
      );

      if (newStatus) {
        showErrorToast(response.message || "Category marked as inactive");
      } else {
        showSuccessToast(response.message || "Category marked as active");
      }
    } catch (error) {
      console.error("Status update failed:", error);
      showErrorToast(error.message || "Failed to update status");
    } finally {
      setConfirmModal({ open: false, id: null, isDisable: null, message: "" });
    }
  };

  // --- HELPER FUNCTIONS ---
  const openStatusModal = (id, currentStatus) => {
    setConfirmModal({
      open: true,
      id,
      isDisable: currentStatus,
      message: currentStatus
        ? "Are you sure you want to deactivate this category?"
        : "Are you sure you want to activate this category?",
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const totalPages = Math.ceil(total / pageSize);
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="grid grid-cols-1 gap-6 p-4 transition-all duration-300">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* MAIN CONTENT BOX */}
      <div
        className="lg:col-span-2 bg-white dark:bg-[#1E2738]
        text-gray-800 dark:text-white rounded-2xl p-6 md:p-8
        border border-purple-300 dark:border-purple-600/50 shadow-xl"
      >
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Blog Categories
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage your blog categories efficiently.
            </p>
          </div>

          <Link to="/blogs/category/create">
            <button
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white 
              px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-purple-500/30 transition-all transform hover:scale-[1.02]"
            >
              <FiPlus size={20} />
              <span>Add Category</span>
            </button>
          </Link>
        </div>

        {/* TABLE CONTAINER */}
        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full table-auto text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300 text-sm uppercase tracking-wider font-semibold border-b border-gray-200 dark:border-gray-700">
                  <th className="py-4 px-6 w-16 text-center">#</th>
                  <th className="py-4 px-6 min-w-[200px]">Category Name</th>
                  <th className="py-4 px-6 min-w-[150px]">Created Date</th>
                  <th className="py-4 px-6 min-w-[180px]">Status (Toggle)</th>
                  <th className="py-4 px-6 min-w-[150px] text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {categories.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-10 text-gray-500 dark:text-gray-400"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <p className="text-lg font-medium">
                          No Categories Found
                        </p>
                        <p className="text-sm mt-1">
                          Try adding a new category to get started.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  categories.map((item, index) => (
                    <tr
                      key={item._id}
                      className="hover:bg-blue-50/50 dark:hover:bg-gray-700/30 transition duration-200 group"
                    >
                      <td className="py-4 px-6 text-center text-gray-500 dark:text-gray-400 font-medium">
                        {(currentPage - 1) * pageSize + index + 1}
                      </td>

                      <td className="py-4 px-6 font-semibold text-gray-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {item.name}
                      </td>

                      <td className="py-4 px-6 text-gray-600 dark:text-gray-400 text-sm">
                        {formatDate(item.createdAt)}
                      </td>

                      {/* --- STATUS COLUMN --- */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              openStatusModal(item._id, item.isDisable)
                            }
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                              !item.isDisable
                                ? "bg-emerald-500"
                                : "bg-gray-300 dark:bg-gray-600"
                            }`}
                            title={
                              !item.isDisable
                                ? "Click to Deactivate"
                                : "Click to Activate"
                            }
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                !item.isDisable
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              }`}
                            />
                          </button>
                          <span
                            className={`text-sm font-medium ${
                              !item.isDisable
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-gray-500 dark:text-gray-400"
                            }`}
                          >
                            {!item.isDisable ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </td>

                      {/* --- ACTION COLUMN (Edit Only) --- */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() =>
                              setEditModal({ show: true, data: item })
                            }
                            className="p-2 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 transition-colors tooltip"
                            title="Edit"
                          >
                            <FiEdit2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION */}
        {total > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Showing{" "}
              <span className="text-gray-900 dark:text-white font-bold">
                {(currentPage - 1) * pageSize + 1}
              </span>{" "}
              to{" "}
              <span className="text-gray-900 dark:text-white font-bold">
                {Math.min(currentPage * pageSize, total)}
              </span>{" "}
              of{" "}
              <span className="text-gray-900 dark:text-white font-bold">
                {total}
              </span>{" "}
              entries
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 
                      text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium text-sm"
              >
                Previous
              </button>

              <div className="hidden sm:flex gap-1">
                {[...Array(totalPages).keys()].slice(0, 5).map((n) => (
                  <button
                    key={n + 1}
                    onClick={() => goToPage(n + 1)}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold transition ${
                      currentPage === n + 1
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    {n + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 
                      text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium text-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- CONFIRMATION MODAL (Status Only) --- */}
      {confirmModal.open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn">
          <div className="bg-white dark:bg-[#1E2738] p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center border border-gray-200 dark:border-gray-600 transform transition-all scale-100">
            <div
              className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-6 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600`}
            >
              <FiAlertCircle size={32} />
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Change Status?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              {confirmModal.message}
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() =>
                  setConfirmModal({
                    open: false,
                    id: null,
                    isDisable: null,
                    message: "",
                  })
                }
                className="flex-1 px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusToggle}
                className={`flex-1 px-5 py-2.5 rounded-xl text-white font-medium shadow-lg transition ${
                  confirmModal.isDisable
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- EDIT MODAL --- */}
      {editModal.show && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn">
          <div className="bg-white dark:bg-[#1E2738] p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-600">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Update Category
              </h3>
              <button
                onClick={() => setEditModal({ show: false, data: null })}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Category Name
              </label>
              <input
                type="text"
                value={editModal.data.name}
                onChange={(e) =>
                  setEditModal({
                    ...editModal,
                    data: { ...editModal.data, name: e.target.value },
                  })
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 
                bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-white 
                focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition shadow-sm"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setEditModal({ show: false, data: null })}
                className="px-6 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg shadow-purple-500/30 transition"
              >
                Update Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
