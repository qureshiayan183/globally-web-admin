import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showSuccessToast, showErrorToast } from "../../utils/toastUtils";
import { ToastContainer } from "react-toastify";
import { FiEye, FiEyeOff, FiRefreshCw, FiMail, FiLock } from "react-icons/fi";
import "react-toastify/dist/ReactToastify.css";
import ThemeToggle from "../../Components/ThemeToggle";
import logo from "../../assets/logo.svg";
import { makeRequest } from "../../_config/api";

export default function Login() {
  const [admin, setAdmin] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdmin((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!admin.userName || !admin.password) {
      showErrorToast("User Name and Password are required");
      return;
    }

    setLoading(true);

    try {
      const { data, error, message } = await makeRequest(
        "post",
        "/admin/adminLogin",
        {
          userName: admin.userName,
          password: admin.password,
        },
      );
      if (error) {
        showErrorToast(message || "Login failed");
        return;
      }

      showSuccessToast("Login successful");

      localStorage.setItem(
        "user",
        JSON.stringify({
          token: data.token,
          userId: data.id,
        }),
      );

      setTimeout(() => {
        navigate("/");
      }, 800);
    } catch (error) {
      console.error("Login failed:", error);
      showErrorToast(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 relative overflow-hidden">
      <ToastContainer />

      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-300/10 dark:bg-indigo-600/5 rounded-full blur-3xl"></div>
      </div>

      {/* Theme Toggle */}
      <div className="absolute top-3 right-6 z-10">
        <div className="flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-full px-4 py-2 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
          <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
            Theme
          </span>
          <ThemeToggle />
        </div>
      </div>

      {/* Login Card */}
      <div className="max-w-md w-full relative z-10">
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 transform transition-all duration-300 hover:shadow-3xl">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <img
              src={logo}
              alt="Globally Logo"
              className="
    mx-auto h-[70px] w-auto
    bg-gradient-to-r from-blue-600 to-purple-600 
    hover:from-blue-700 hover:to-purple-700 
    shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 
    rounded-xl p-4
    dark:bg-transparent dark:shadow-none dark:hover:shadow-none
  "
            />

            {/* <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome Back
            </h1> */}

            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              Sign in to your account to continue
            </p>
          </div>

          {/* Login Form */}
          <div className="space-y-5">
            {/* User Name Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                User Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="text"
                  name="userName"
                  value={admin.userName}
                  onChange={handleInputChange}
                  placeholder="Enter your user name"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-600 transition-all duration-200"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={admin.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-12 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-600 transition-all duration-200"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FiEyeOff className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition" />
                  ) : (
                    <FiEye className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full relative overflow-hidden rounded-xl px-6 py-3.5 font-semibold text-white transition-all duration-300 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                }`}
              >
                <span className="relative z-10 flex items-center justify-center">
                  {loading ? (
                    <>
                      <FiRefreshCw className="animate-spin h-5 w-5 mr-2" />
                      Logging in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </span>
                {!loading && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          © {new Date().getFullYear()} Globally. All rights reserved.
        </p>
      </div>
    </div>
  );
}
