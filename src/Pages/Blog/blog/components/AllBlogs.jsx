import { useEffect, useState, useCallback } from "react";
import {
  FiSearch,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiSettings,
  FiAlertCircle,
  FiEye,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Adjust these paths based on your project structure
import { makeRequestAuth } from "../../../../_config/api";
import { showErrorToast, showSuccessToast } from "../../../../utils/toastUtils";
import Spinner from "../../../../utils/Loader";
import UpdateBlogModal from "./UpdateBlogModal";
import UpdateSchemaModal from "./UpdateSchemaModal";

function AllBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Modal States
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editSchemaModal, setEditSchemaModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    id: null,
    isDisable: null,
    type: "",
    message: "",
  });

  const [formData, setFormData] = useState({
    _id: "",
    articleSchema: "",
    faqSchema: "",
    breadcrumbSchema: "",
  });

  const fetchBlogs = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      try {
        const response = await makeRequestAuth("post", "/admin/getBlogList", {
          keyWord: searchTerm,
          fromDate: "",
          toDate: "",
          sortOrder: "desc",
          sortBy: "createdAt",
          pageNo: page,
          size: pageSize,
        });

        const { list, total } = response.data;
        setBlogs(list || []);
        setTotal(total || 0);
      } catch (err) {
        showErrorToast(err.message || "Failed to fetch blogs");
      } finally {
        setIsLoading(false);
      }
    },
    [searchTerm, pageSize],
  );

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchBlogs(currentPage);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [currentPage, searchTerm, fetchBlogs]);

  const handleStatusToggle = async () => {
    const { id, isDisable } = confirmModal;
    try {
      const newStatus = !isDisable;
      await makeRequestAuth("post", "/admin/updateBlogStatus", { id });

      setBlogs((prev) =>
        prev.map((b) => (b._id === id ? { ...b, isDisable: newStatus } : b)),
      );

      if (newStatus) {
        showErrorToast("Blog marked as inactive");
      } else {
        showSuccessToast("Blog marked as active");
      }
    } catch {
      showErrorToast("Failed to update status");
    } finally {
      setConfirmModal({
        open: false,
        id: null,
        isDisable: null,
        type: "",
        message: "",
      });
    }
  };

  const handleDelete = async () => {
    const { id } = confirmModal;
    try {
      await makeRequestAuth("post", "/admin/deleteBlog", { id });
      setBlogs((prev) => prev.filter((c) => c._id !== id));
      setTotal((prev) => prev - 1);
      showSuccessToast("Blog deleted successfully!");
    } catch (err) {
      showErrorToast(err.message || "Delete failed");
    } finally {
      setConfirmModal({
        open: false,
        id: null,
        isDisable: null,
        type: "",
        message: "",
      });
    }
  };

  const handleSubmitSchema = async () => {
    try {
      let articleObj, faqObj, breadcrumbObj;
      try {
        articleObj = formData.articleSchema
          ? JSON.parse(formData.articleSchema)
          : {};
        faqObj = formData.faqSchema ? JSON.parse(formData.faqSchema) : {};
        breadcrumbObj = formData.breadcrumbSchema
          ? JSON.parse(formData.breadcrumbSchema)
          : {};
      } catch {
        return showErrorToast("Invalid JSON in one of the schema fields!");
      }

      const response = await makeRequestAuth(
        "post",
        "/admin/updateBlogSchema",
        {
          id: formData._id,
          articleSchema: articleObj,
          faqSchema: faqObj,
          breadcrumbSchema: breadcrumbObj,
        },
      );

      if (response.error) {
        return showErrorToast(response.message || "Failed to update blog");
      }

      showSuccessToast(response.message || "Blog updated successfully");
      fetchBlogs(currentPage);
      setEditSchemaModal(false);
    } catch (err) {
      console.error(err);
      showErrorToast(err.message || "Failed to update blog");
    }
  };

  // Helper Functions
  const openStatusModal = (id, currentStatus) => {
    setConfirmModal({
      open: true,
      id,
      isDisable: currentStatus,
      type: "status",
      message: currentStatus
        ? "Are you sure you want to deactivate this blog?"
        : "Are you sure you want to activate this blog?",
    });
  };

  const openDeleteModal = (id) => {
    setConfirmModal({
      open: true,
      id,
      type: "delete",
      message:
        "Are you sure you want to delete this blog? This action cannot be undone.",
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
    <div className="grid grid-cols-1 gap-6 p-4">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* MAIN CONTAINER */}
      <div
        className="bg-white dark:bg-[#1E2738] 
        text-gray-800 dark:text-white rounded-2xl p-6 md:p-8
        border border-purple-300 dark:border-purple-600/50 shadow-xl"
      >
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              All Blogs
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Total {total} blogs found
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 
                bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition"
              />
            </div>

            {/* Add Button */}
            <Link to="/blogs/create">
              <button className="flex items-center justify-center gap-2 w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-5 py-2 rounded-xl font-medium shadow-lg shadow-purple-500/30 transition transform hover:scale-[1.02]">
                <FiPlus size={18} />
                <span>Add Blog</span>
              </button>
            </Link>
          </div>
        </div>

        {/* TABLE LAYOUT */}
        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full table-auto text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300 text-sm uppercase tracking-wider font-semibold border-b border-gray-200 dark:border-gray-700">
                  <th className="py-4 px-6 w-16 text-center">#</th>
                  <th className="py-4 px-6 min-w-[80px]">Image</th>
                  <th className="py-4 px-6 min-w-[250px]">Title & Category</th>
                  <th className="py-4 px-6 min-w-[150px]">Author</th>
                  <th className="py-4 px-6 min-w-[120px]">Date</th>
                  <th className="py-4 px-6 min-w-[140px]">Status</th>
                  <th className="py-4 px-6 min-w-[180px] text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {blogs.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-10 text-gray-500 dark:text-gray-400"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <p className="text-lg font-medium">No Blogs Found</p>
                        <p className="text-sm mt-1">
                          Try adding a new blog to get started.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  blogs.map((blog, index) => (
                    <tr
                      key={blog._id}
                      className="hover:bg-blue-50/50 dark:hover:bg-gray-700/30 group"
                    >
                      <td className="py-4 px-6 text-center text-gray-500 dark:text-gray-400 font-medium">
                        {(currentPage - 1) * pageSize + index + 1}
                      </td>

                      <td className="py-4 px-6">
                        <div className="h-12 w-16 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                          <img
                            src={blog.image}
                            alt="mini"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="text-gray-900 dark:text-white font-semibold line-clamp-1 mb-1">
                            {blog.title}
                          </span>
                          <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full w-fit">
                            {blog?.category?.name || "Uncategorized"}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-gray-600 dark:text-gray-400 text-sm">
                        {blog.authorName || "Admin"}
                      </td>

                      <td className="py-4 px-6 text-gray-600 dark:text-gray-400 text-sm">
                        {formatDate(blog.createdAt)}
                      </td>

                      {/* --- STATUS COLUMN --- */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              openStatusModal(blog._id, blog.isDisable)
                            }
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                              !blog.isDisable
                                ? "bg-emerald-500"
                                : "bg-gray-300 dark:bg-gray-600"
                            }`}
                            title={
                              !blog.isDisable
                                ? "Click to Deactivate"
                                : "Click to Activate"
                            }
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                !blog.isDisable
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              }`}
                            />
                          </button>
                          <span
                            className={`text-xs font-semibold uppercase ${
                              !blog.isDisable
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-gray-500 dark:text-gray-400"
                            }`}
                          >
                            {!blog.isDisable ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </td>

                      {/* --- ACTIONS COLUMN --- */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Preview */}
                          <button
                            onClick={() => {
                              setSelectedBlog(blog);
                              setShowModal(true);
                            }}
                            className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-blue-900/20 transition tooltip"
                            title="Preview Blog"
                          >
                            <FiEye size={18} />
                          </button>

                          {/* Edit Info */}
                          <button
                            onClick={() => {
                              setEditModal(true);
                              setSelectedPackage(blog);
                            }}
                            className="p-2 rounded-lg text-gray-500 hover:text-purple-600 hover:bg-purple-50 dark:text-gray-400 dark:hover:text-purple-400 dark:hover:bg-purple-900/20 transition tooltip"
                            title="Edit Blog"
                          >
                            <FiEdit2 size={18} />
                          </button>

                          {/* Schema */}
                          <button
                            onClick={() => {
                              setEditSchemaModal(true);
                              setFormData(blog);
                            }}
                            className="p-2 rounded-lg text-gray-500 hover:text-orange-600 hover:bg-orange-50 dark:text-gray-400 dark:hover:text-orange-400 dark:hover:bg-orange-900/20 transition tooltip"
                            title="Update Schema"
                          >
                            <FiSettings size={18} />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => openDeleteModal(blog._id)}
                            className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/20 transition tooltip"
                            title="Delete Blog"
                          >
                            <FiTrash2 size={18} />
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

      {/* --- VIEW BLOG MODAL --- */}
      {showModal && selectedBlog && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E2738] rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-gray-200 dark:border-gray-600">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white truncate pr-4">
                Preview Blog
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-6 md:p-8 custom-scrollbar">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {selectedBlog.title}
              </h1>

              {selectedBlog.image && (
                <img
                  src={selectedBlog.image}
                  alt="Cover"
                  className="w-full h-auto max-h-[400px] object-cover rounded-xl shadow-md mb-6"
                />
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-700">
                <div>
                  <span className="block text-xs text-gray-500 dark:text-gray-400 uppercase">
                    Category
                  </span>
                  <span className="font-semibold text-gray-800 dark:text-white">
                    {selectedBlog?.category?.name || "-"}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-gray-500 dark:text-gray-400 uppercase">
                    Author
                  </span>
                  <span className="font-semibold text-gray-800 dark:text-white">
                    {selectedBlog?.authorName || "-"}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-gray-500 dark:text-gray-400 uppercase">
                    Published
                  </span>
                  <span className="font-semibold text-gray-800 dark:text-white">
                    {selectedBlog.createdAt
                      ? formatDate(selectedBlog.createdAt)
                      : "-"}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-gray-500 dark:text-gray-400 uppercase">
                    Status
                  </span>
                  <span
                    className={`font-semibold ${selectedBlog.isDisable ? "text-red-500" : "text-emerald-500"}`}
                  >
                    {selectedBlog.isDisable ? "Inactive" : "Active"}
                  </span>
                </div>
              </div>

              <div className="prose dark:prose-invert max-w-none prose-img:rounded-lg prose-a:text-purple-600">
                <div
                  dangerouslySetInnerHTML={{
                    __html: selectedBlog.content || "",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- CONFIRMATION MODAL --- */}
      {confirmModal.open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn">
          <div className="bg-white dark:bg-[#1E2738] p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center border border-gray-200 dark:border-gray-600 transform transition-all scale-100">
            <div
              className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-6 ${
                confirmModal.type === "delete"
                  ? "bg-red-100 dark:bg-red-900/30 text-red-600"
                  : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600"
              }`}
            >
              {confirmModal.type === "delete" ? (
                <FiTrash2 size={32} />
              ) : (
                <FiAlertCircle size={32} />
              )}
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {confirmModal.type === "delete"
                ? "Delete Blog?"
                : "Change Status?"}
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
                    type: "",
                    message: "",
                  })
                }
                className="flex-1 px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={
                  confirmModal.type === "delete"
                    ? handleDelete
                    : handleStatusToggle
                }
                className={`flex-1 px-5 py-2.5 rounded-xl text-white font-medium shadow-lg transition ${
                  confirmModal.type === "delete"
                    ? "bg-red-600 hover:bg-red-700 shadow-red-500/30"
                    : confirmModal.isDisable
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {confirmModal.type === "delete" ? "Delete" : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- EXTERNAL MODALS --- */}
      <UpdateBlogModal
        isOpen={editModal}
        onClose={() => {
          setEditModal(false);
          setSelectedPackage(null);
        }}
        fetchBlogs={() => fetchBlogs(currentPage)}
        initialData={selectedPackage}
      />

      <UpdateSchemaModal
        isOpen={editSchemaModal}
        onClose={() => {
          setEditSchemaModal(false);
          setSelectedPackage(null);
        }}
        handleSubmit={handleSubmitSchema}
        formData={formData}
        setFormData={setFormData}
        fetchBlogs={() => fetchBlogs(currentPage)}
        initialData={selectedPackage}
      />
    </div>
  );
}

export default AllBlogs;
