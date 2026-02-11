import React, { useEffect } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { FiSave } from "react-icons/fi";

const UpdateSchemaModal = ({
  isOpen,
  onClose,
  handleSubmit,
  formData,
  setFormData,
}) => {
  const handleChange = (key) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  // Load initial data and stringify JSON on open
  useEffect(() => {
    if (isOpen && formData) {
      setFormData((prev) => ({
        ...prev,
        _id: prev._id || "",
        // Check if it's already a string to prevent double stringifying if modal re-renders
        articleSchema:
          typeof prev.articleSchema === "object"
            ? JSON.stringify(prev.articleSchema || {}, null, 2)
            : prev.articleSchema,
        faqSchema:
          typeof prev.faqSchema === "object"
            ? JSON.stringify(prev.faqSchema || {}, null, 2)
            : prev.faqSchema,
        breadcrumbSchema:
          typeof prev.breadcrumbSchema === "object"
            ? JSON.stringify(prev.breadcrumbSchema || {}, null, 2)
            : prev.breadcrumbSchema,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const formatLabel = (key) => {
    const result = key.replace("Schema", " Schema");
    return result.charAt(0).toUpperCase() + result.slice(1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#1E2738] rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col border border-purple-300 dark:border-purple-600/50 animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-t-2xl">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Update Schema Blog
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition"
          >
            <IoCloseCircleOutline size={28} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar space-y-8">
          {["articleSchema", "faqSchema", "breadcrumbSchema"].map((key) => (
            <div key={key} className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                {formatLabel(key)}
              </label>

              <div className="relative">
                <textarea
                  rows={12}
                  value={formData[key]}
                  onChange={handleChange(key)}
                  className="w-full p-4 rounded-xl border border-gray-300 dark:border-gray-600 
                  bg-gray-50 dark:bg-gray-900/50 
                  text-gray-800 dark:text-gray-200 font-mono text-sm leading-relaxed
                  focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition
                  custom-scrollbar resize-y shadow-inner"
                  placeholder="{}"
                  spellCheck="false"
                />
                <div className="absolute top-2 right-2 px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono text-gray-500 dark:text-gray-400 pointer-events-none opacity-70">
                  JSON
                </div>
              </div>
            </div>
          ))}
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
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg shadow-purple-500/30 transition"
          >
            <FiSave size={18} /> Update Schema
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateSchemaModal;
