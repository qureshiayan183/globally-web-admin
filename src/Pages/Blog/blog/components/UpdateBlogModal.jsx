import React, { useState, useEffect, useRef, useMemo } from "react";
import { makeRequestAuth, uploadFiles } from "../../../../_config/api";
import { ToastContainer } from "react-toastify";
import { showSuccessToast, showErrorToast } from "../../../../utils/toastUtils";
import "react-toastify/dist/ReactToastify.css";
import { IoCloseCircleOutline, IoCloudUploadOutline } from "react-icons/io5";
import { FiSave } from "react-icons/fi";

const JoditEditor = React.lazy(() => import("jodit-react"));

const UpdateBlogModal = ({ isOpen, onClose, fetchBlogs, initialData }) => {
  const editor = useRef(null);
  const [categories, setCategories] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    _id: "",
    title: "",
    authorName: "",
    approvedBy: "",
    shortDescription: "",
    content: "",
    image: "",
    category: "",
    metaTitle: "",
    metaDescription: "",
  });

  // Fetch Categories on Mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await makeRequestAuth(
          "post",
          "/admin/getAllValidCategory",
          {
            keyWord: "",
            sortOrder: "desc",
            sortBy: "createdAt",
            pageNo: 1,
            size: 50,
          },
        );
        setCategories(response?.data ?? []);
      } catch (err) {
        showErrorToast(err.message || "Failed to fetch categories");
      }
    };

    if (isOpen) fetchCategories();
  }, [isOpen]);

  // Jodit Config
  const editorConfig = useMemo(
    () => ({
      readonly: false,
      placeholder: "Start editing your content...",
      height: 400,
      showCharsCounter: false,
      showWordsCounter: false,
      showXPathInStatusbar: false,
    }),
    [],
  );

  // Populate Form Data
  useEffect(() => {
    if (initialData) {
      setFormData({
        _id: initialData._id || "",
        title: initialData.title || "",
        authorName: initialData.authorName || "",
        approvedBy: initialData.approvedBy || "",
        shortDescription: initialData.shortDescription || "",
        content: initialData.content || "",
        image: initialData.image || "",
        category: initialData.category?._id || "",
        metaTitle: initialData?.matatags?.title || "",
        metaDescription: initialData?.matatags?.description || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const result = await uploadFiles({
        files: [file],
        endpoint: "/uploadImage",
        fieldName: "image",
        isMultiple: false,
      });

      const imageUrl = result?.data?.imageUrl;
      if (imageUrl) {
        setFormData((prev) => ({ ...prev, image: imageUrl }));
        showSuccessToast("Image uploaded successfully!");
      } else {
        showErrorToast("Image upload failed");
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      showErrorToast("Error uploading image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const response = await makeRequestAuth("post", "/admin/updateBlog", {
        id: formData._id,
        title: formData.title,
        authorName: formData.authorName,
        approvedBy: formData.approvedBy,
        shortDescription: formData.shortDescription,
        content: formData.content,
        category: formData.category,
        matatags: {
          title: formData.metaTitle,
          description: formData.metaDescription,
        },
        image: formData.image,
      });

      if (response.error) {
        showErrorToast(response.message || "Failed to update blog");
        return;
      }

      showSuccessToast(response.message || "Blog updated successfully");
      fetchBlogs(); // Refresh list
      onClose(); // Close modal
    } catch (error) {
      console.error("Error updating blog:", error);
      showErrorToast(error.message || "Failed to update blog");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="bg-white dark:bg-[#1E2738] rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col border border-purple-300 dark:border-purple-600/50 animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-t-2xl">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Edit Blog Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition"
          >
            <IoCloseCircleOutline size={28} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Blog Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Author Name
              </label>
              <input
                type="text"
                name="authorName"
                value={formData.authorName}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition"
              />
            </div>

            {/* Approved By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Approved By
              </label>
              <input
                type="text"
                name="approvedBy"
                value={formData.approvedBy}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition"
              />
            </div>

            {/* Short Description */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Short Description
              </label>
              <textarea
                name="shortDescription"
                rows={2}
                value={formData.shortDescription}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition"
              />
            </div>

            {/* SEO Section Divider */}
            <div className="col-span-1 md:col-span-2 border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
              <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                SEO Configuration
              </h3>
            </div>

            {/* Meta Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Meta Title
              </label>
              <input
                type="text"
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition"
              />
            </div>

            {/* Meta Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Meta Description
              </label>
              <input
                type="text"
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition"
              />
            </div>

            {/* Image Upload */}
            <div className="col-span-1 md:col-span-2 border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cover Image
              </label>

              <div className="flex flex-col sm:flex-row items-start gap-4">
                {/* Preview */}
                {formData.image && (
                  <div className="relative w-32 h-24 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 flex-shrink-0">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Input */}
                <div className="flex-1 w-full">
                  <label
                    className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      isUploading
                        ? "bg-gray-100 dark:bg-gray-700 border-gray-300"
                        : "border-gray-300 dark:border-gray-600 hover:bg-purple-50 dark:hover:bg-purple-900/10 hover:border-purple-400"
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {isUploading ? (
                        <span className="text-sm text-gray-500">
                          Uploading...
                        </span>
                      ) : (
                        <>
                          <IoCloudUploadOutline className="w-8 h-8 text-gray-400 mb-1" />
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Click to replace image
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Content Editor */}
            <div className="col-span-1 md:col-span-2 border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Blog Content
              </label>
              <div className="rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 bg-white">
                {typeof window !== "undefined" && (
                  <JoditEditor
                    ref={editor}
                    value={formData.content}
                    config={editorConfig}
                    onBlur={(newContent) =>
                      setFormData((prev) => ({ ...prev, content: newContent }))
                    }
                    onChange={() => {}}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 font-medium transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || isUploading}
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg shadow-purple-500/30 transition disabled:opacity-50"
          >
            {isSubmitting ? (
              "Updating..."
            ) : (
              <>
                {" "}
                <FiSave /> Update Changes{" "}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateBlogModal;
