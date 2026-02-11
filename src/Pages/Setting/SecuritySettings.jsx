"use client";
import React, { useState } from "react";
import { makeRequestAuth } from "../../_config/api";
import { showErrorToast, showSuccessToast } from "../../utils/toastUtils";
import { ToastContainer } from "react-toastify";
import { FiEye, FiEyeOff, FiX, FiLock, FiShield } from "react-icons/fi";

export default function SecuritySettings() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [visibility, setVisibility] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  // Simple matching check
  const passwordsMatch =
    !formData.confirmPassword ||
    formData.newPassword === formData.confirmPassword;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleVisibility = (field) => {
    setVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (
      !formData.oldPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      showErrorToast("Please fill in all fields.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      showErrorToast("New password and Confirm password do not match!");
      return;
    }

    try {
      setLoading(true);

      const res = await makeRequestAuth("POST", "/admin/changePassword", {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      if (res?.error === false) {
        showSuccessToast("Password updated successfully!");
        setFormData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        showErrorToast(res?.message || "Something went wrong!");
      }
    } catch (error) {
      showErrorToast(error.message || "Server error, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 transition-all duration-300 flex justify-center">
      <ToastContainer />

      {/* Main Container - Centered and limited width */}
      <div className="w-full bg-white dark:bg-[#1E2738] rounded-2xl p-6 md:p-8 border border-purple-300 dark:border-purple-600/50 shadow-xl">
        {/* Header */}
        <div className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-4 text-center md:text-left">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center justify-center md:justify-start gap-3">
            <FiShield className="text-blue-600" /> Security Settings
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Update your password to keep your account secure.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handlePasswordChange} className="space-y-6">
          {/* Old Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Current Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <FiLock />
              </span>
              <input
                type={visibility.old ? "text" : "password"}
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleInputChange}
                placeholder="Enter current password"
                className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-300 dark:border-gray-600 
                bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-white 
                focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
              />
              <button
                type="button"
                onClick={() => toggleVisibility("old")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition"
              >
                {visibility.old ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              New Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <FiLock />
              </span>
              <input
                type={visibility.new ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="Enter new password"
                className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-300 dark:border-gray-600 
                bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-white 
                focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
              />
              <button
                type="button"
                onClick={() => toggleVisibility("new")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition"
              >
                {visibility.new ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <FiLock />
              </span>
              <input
                type={visibility.confirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Re-enter new password"
                className={`w-full pl-10 pr-12 py-3 rounded-xl border 
                bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-white 
                outline-none transition focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                ${!passwordsMatch ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-600"}`}
              />
              <button
                type="button"
                onClick={() => toggleVisibility("confirm")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition"
              >
                {visibility.confirm ? (
                  <FiEyeOff size={18} />
                ) : (
                  <FiEye size={18} />
                )}
              </button>
            </div>
            {!passwordsMatch && (
              <p className="text-red-500 text-xs mt-2 font-medium flex items-center gap-1 animate-pulse">
                <FiX /> Passwords do not match
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading || !passwordsMatch || !formData.newPassword}
              className="w-full md:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg shadow-purple-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating Password..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
