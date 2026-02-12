import React, { useState, useRef, useMemo, useEffect } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import {
  FiSave,
  FiX,
  FiArrowLeft,
  FiUploadCloud,
  FiCheckCircle,
} from "react-icons/fi";
import { ToastContainer } from "react-toastify";
import { showSuccessToast, showErrorToast } from "../../../../utils/toastUtils";
import { makeRequestAuth, uploadFiles } from "../../../../_config/api";
import { useNavigate } from "react-router-dom";
import JoditEditor from "jodit-react";

function NewBlogForm() {
  const navigate = useNavigate();
  const editor = useRef(null);

  const [formData, setFormData] = useState({
    category: "",
    title: "",
    authorName: "",
    approvedBy: "",
    shortDescription: "",
    content: "",
    metaTitle: "",
    metaDescription: "",
    image: null,
    coverImagePreview: null,
    uploadedCoverImage: "",
  });

  const [uploadingCover, setUploadingCover] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchBlogsCategory = async () => {
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
    fetchBlogsCategory();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({
      ...prev,
      image: file,
      coverImagePreview: previewUrl,
      uploadedCoverImage: "",
    }));
  };

  const getToken = () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      return storedUser?.token || null;
    } catch (err) {
      return null;
    }
  };

  const handleCoverImageUpload = async () => {
    const token = getToken();
    if (!token) return showErrorToast("Authentication token not found.");
    if (!formData.image) return showErrorToast("Please select a cover image.");

    try {
      setUploadingCover(true);

      const result = await uploadFiles({
        files: [formData.image],
        endpoint: "/uploadImage",
        fieldName: "image",
        isMultiple: false,
      });

      const uploadedUrl = result.data?.imageUrl;
      if (uploadedUrl) {
        showSuccessToast("Cover image uploaded successfully!");
        setFormData((prev) => ({ ...prev, uploadedCoverImage: uploadedUrl }));
      } else {
        showErrorToast("Upload failed. Try again.");
      }
    } catch (err) {
      console.error(err);
      showErrorToast("Error uploading cover image.");
    } finally {
      setUploadingCover(false);
    }
  };

  const validateForm = () => {
    const {
      category,
      title,
      shortDescription,
      content,
      uploadedCoverImage,
      metaTitle,
      metaDescription,
    } = formData;
    if (
      !category.length ||
      !title ||
      !shortDescription ||
      !content ||
      !uploadedCoverImage ||
      !metaTitle ||
      !metaDescription
    ) {
      showErrorToast(
        "Please fill all required fields and upload the cover image.",
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const token = getToken();
    if (!token) return showErrorToast("Authentication token not found.");

    try {
      setSubmitting(true);

      const payload = {
        category: formData.category,
        title: formData.title,
        authorName: formData.authorName,
        approvedBy: formData.approvedBy,
        shortDescription: formData.shortDescription,
        content: formData.content,
        matatags: {
          title: formData.metaTitle,
          description: formData.metaDescription,
        },
        image: formData.uploadedCoverImage,
      };

      await makeRequestAuth("post", "/admin/createBlog", payload, {
        Authorization: `Bearer ${token}`,
      });

      showSuccessToast("Blog published successfully!");
      setTimeout(() => navigate("/blogs"), 1500);
    } catch (err) {
      console.error("Blog create error:", err);
      showErrorToast(err.message || "Failed to create blog");
    } finally {
      setSubmitting(false);
    }
  };

  const editorConfig = useMemo(
    () => ({
      readonly: false,
      placeholder: "Start writing your amazing blog content...",
      height: 500,
      showCharsCounter: false,
      showWordsCounter: false,
      showXPathInStatusbar: false,
    }),
    [],
  );

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit}>
        <div className="mx-auto bg-white dark:bg-[#1E2738] rounded-2xl p-6 md:p-8 border border-purple-300 dark:border-purple-600/50 shadow-xl">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Create New Blog
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Fill in the details to publish a new article.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/blogs")}
              className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition"
            >
              <FiArrowLeft size={20} />
              <span className="hidden sm:inline">Back to Blogs</span>
            </button>
          </div>

          {/* FORM GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Title */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Blog Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter an engaging title"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
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
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Author Name
              </label>
              <input
                type="text"
                name="authorName"
                value={formData.authorName}
                onChange={handleInputChange}
                placeholder="e.g. John Doe"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
            </div>

            {/* Approved By */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Approved By
              </label>
              <input
                type="text"
                name="approvedBy"
                value={formData.approvedBy}
                onChange={handleInputChange}
                placeholder="e.g. Admin"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
            </div>

            {/* Short Description */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Short Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleInputChange}
                placeholder="A brief summary of the article..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
            </div>

            {/* SEO Section Label */}
            <div className="col-span-1 md:col-span-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                SEO Configuration
              </h3>
            </div>

            {/* Meta Title */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Meta Title
              </label>
              <input
                type="text"
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleInputChange}
                placeholder="SEO Title"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
            </div>

            {/* Meta Description */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Meta Description
              </label>
              <input
                type="text"
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleInputChange}
                placeholder="SEO Description"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
            </div>
          </div>

          {/* IMAGE UPLOAD SECTION */}
          <div className="mb-8 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Cover Image
            </h3>

            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Upload Box */}
              <div className="w-full md:w-1/2">
                <label
                  className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                    formData.coverImagePreview
                      ? "border-purple-400 bg-purple-50 dark:bg-purple-900/10"
                      : "border-gray-300 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-400 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                  }`}
                >
                  {formData.coverImagePreview ? (
                    <img
                      src={formData.coverImagePreview}
                      alt="Preview"
                      className="w-full h-full object-contain rounded-xl p-2"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <IoCloudUploadOutline className="w-12 h-12 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              {/* Upload Actions */}
              <div className="w-full md:w-1/2 flex flex-col justify-center gap-3">
                {formData.coverImagePreview && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Selected File
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            image: null,
                            coverImagePreview: null,
                            uploadedCoverImage: "",
                          }))
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiX />
                      </button>
                    </div>

                    {formData.uploadedCoverImage ? (
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 rounded-lg text-sm font-semibold">
                        <FiCheckCircle size={18} />
                        <span>Image Uploaded Successfully</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleCoverImageUpload}
                        disabled={uploadingCover}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 rounded-lg font-medium transition disabled:opacity-60"
                      >
                        {uploadingCover ? (
                          "Uploading..."
                        ) : (
                          <>
                            <FiUploadCloud size={18} /> Upload to Server
                          </>
                        )}
                      </button>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      * You must upload the image to the server before
                      publishing.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* EDITOR SECTION */}
          <div className="mb-8 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Content
            </h3>
            <div className="prose-editor-wrapper bg-white dark:bg-gray-200 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
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

          {/* ACTION BUTTONS */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate("/blogs")}
              className="px-6 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !formData.uploadedCoverImage}
              className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg shadow-purple-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                "Publishing..."
              ) : (
                <>
                  {" "}
                  <FiSave /> Publish Blog{" "}
                </>
              )}
            </button>
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </form>
    </div>
  );
}

export default NewBlogForm;
