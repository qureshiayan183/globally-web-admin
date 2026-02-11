"use client";
import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { uploadFiles } from "../../_config/api";
import { showErrorToast, showSuccessToast } from "../../utils/toastUtils";
import { FiUploadCloud, FiCopy, FiCheck, FiImage, FiX } from "react-icons/fi";

function ImageUrlGenerate() {
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setUploadedUrl(null); // Reset previous upload
      setCopied(false);
    }
  };

  const clearFile = () => {
    setImageFile(null);
    setPreviewUrl(null);
    setUploadedUrl(null);
    setCopied(false);
  };

  const handleCoverImageUpload = async () => {
    if (!imageFile) return showErrorToast("Please select an image first.");

    try {
      setUploading(true);

      const result = await uploadFiles({
        files: [imageFile],
        endpoint: "/uploadImage",
        fieldName: "image",
        isMultiple: false,
      });

      const url = result.data?.imageUrl;
      if (url) {
        setUploadedUrl(url);
        showSuccessToast("Image uploaded successfully!");
      } else {
        showErrorToast("Upload failed. Try again.");
      }
    } catch (err) {
      console.error(err);
      showErrorToast("Error uploading image.");
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = () => {
    if (uploadedUrl) {
      navigator.clipboard.writeText(uploadedUrl);
      setCopied(true);
      showSuccessToast("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-4 transition-all duration-300 flex justify-center">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Main Card */}
      <div className="w-full bg-white dark:bg-[#1E2738] rounded-2xl p-6 md:p-8 border border-purple-300 dark:border-purple-600/50 shadow-xl">
        {/* Header */}
        <div className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
            <FiImage className="text-blue-600" /> Image URL Generator
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Upload an image to generate a public URL.
          </p>
        </div>

        {/* Upload Area */}
        <div className="space-y-6">
          {/* File Input */}
          {!previewUrl ? (
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl cursor-pointer bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FiUploadCloud className="w-10 h-10 text-purple-500 mb-3" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-300">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  PNG, JPG, JPEG (MAX. 5MB)
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          ) : (
            // Preview Area
            <div className="relative w-full h-64 bg-gray-100 dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-contain"
              />
              <button
                onClick={clearFile}
                className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-lg"
                title="Remove Image"
              >
                <FiX size={16} />
              </button>
            </div>
          )}

          {/* Action Button */}
          {imageFile && !uploadedUrl && (
            <div className="flex justify-end">
              <button
                onClick={handleCoverImageUpload}
                disabled={uploading}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg shadow-purple-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <>Processing...</>
                ) : (
                  <>
                    <FiUploadCloud size={20} /> Generate URL
                  </>
                )}
              </button>
            </div>
          )}

          {/* Result Section */}
          {uploadedUrl && (
            <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 rounded-xl animate-fadeIn">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider mb-1">
                    Generated URL
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 truncate font-mono bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700">
                    {uploadedUrl}
                  </p>
                </div>

                <button
                  onClick={copyToClipboard}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition shadow-sm ${
                    copied
                      ? "bg-emerald-500 text-white"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600"
                  }`}
                >
                  {copied ? <FiCheck /> : <FiCopy />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageUrlGenerate;
