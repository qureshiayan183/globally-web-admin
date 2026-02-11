import { useState } from "react";
import { FaTimes, FaSignOutAlt } from "react-icons/fa";
import { FiHome, FiShield } from "react-icons/fi";
import { FaBlog, FaComments } from "react-icons/fa";
import { BiCategory } from "react-icons/bi";
import { MdImage } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { onErrorLogout } from "../_config/authService";
import logo from "../assets/logo.svg";
import logout from "../assets/icons/logout.svg";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-72
        bg-gradient-to-b from-white via-gray-50 to-white
        dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
        flex flex-col transition-all duration-500 z-40 
        border-r border-gray-200 dark:border-gray-700
        ${sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}`}
      >
        {/* Logo Section */}
        <div className="relative py-2 px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center gap-3">
            {/* Logo */}
            <div className="relative">
              <div className="absolute inset-0"></div>
              <img
                src={logo}
                alt="logo"
                className="mx-auto h-[56px] w-auto
    bg-gradient-to-r from-blue-600 to-purple-600 
    hover:from-blue-700 hover:to-purple-700 
    shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 
    rounded-xl p-3
    dark:bg-transparent dark:shadow-none dark:hover:shadow-none"
              />
            </div>
          </div>

          {/* Close Button for Mobile */}
          <button
            className="lg:hidden absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <FaTimes className="text-gray-700 dark:text-gray-300" size={18} />
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2 custom-scrollbar">
          {/* Dashboard */}
          <div className="mb-4">
            <MenuItem
              to="/"
              icon={<FiHome size={20} />}
              label="Dashboard"
              setSidebarOpen={setSidebarOpen}
            />
          </div>

          {/* Blogs Section */}
          <SectionTitle title="Blogs" />

          <MenuItem
            to="/blogs"
            icon={<FaBlog size={20} />}
            label="All Blogs"
            setSidebarOpen={setSidebarOpen}
          />

          <MenuItem
            to="/blogs/category"
            icon={<BiCategory size={20} />}
            label="Blog Categories"
            setSidebarOpen={setSidebarOpen}
          />

          <MenuItem
            to="/blogs/comments"
            icon={<FaComments size={20} />}
            label="Blog Comments"
            setSidebarOpen={setSidebarOpen}
          />

          <MenuItem
            to="/image-url-generater"
            icon={<MdImage size={20} />}
            label="Image URL Generater"
            setSidebarOpen={setSidebarOpen}
          />

          {/* Settings Section */}
          <SectionTitle title="System Settings" />

          <MenuItem
            to="/settings/security"
            icon={<FiShield size={20} />}
            label="Security Settings"
            setSidebarOpen={setSidebarOpen}
          />
        </div>

        {/* Logout Button */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gradient-to-r from-red-50/50 to-pink-50/50 dark:from-gray-800/50 dark:to-gray-800/50">
          <button
            onClick={() => setShowLogoutPopup(true)}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl
            text-red-600 dark:text-red-400 font-semibold
            hover:bg-red-100 dark:hover:bg-red-500/10
            border-2 border-transparent hover:border-red-200 dark:hover:border-red-800
            transition-all duration-200 group"
          >
            <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FaSignOutAlt className="text-red-600 dark:text-red-400" />
            </div>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Logout Confirmation Popup */}
      {showLogoutPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex justify-center items-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl transform transition-all animate-scaleIn">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-t-2xl p-6 text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3">
                <img src={logout} alt="logout" className="w-8 h-8 invert" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                Logout Confirmation
              </h2>
            </div>

            {/* Body */}
            <div className="p-6">
              <p className="text-gray-700 dark:text-gray-300 text-center mb-6 leading-relaxed">
                Are you sure you want to log out?
                <br />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  You will be signed out from the Admin panel.
                </span>
              </p>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutPopup(false)}
                  className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3.5 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-500"
                >
                  Cancel
                </button>

                <button
                  onClick={() => onErrorLogout()}
                  className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3.5 rounded-xl font-semibold hover:from-red-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #475569;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}

/* SECTION TITLE */
function SectionTitle({ title }) {
  return (
    <div className="px-3 mt-6 mb-2">
      <p className="text-xs uppercase tracking-wider font-bold text-gray-500 dark:text-gray-400 flex items-center gap-2">
        <span className="h-px bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-600 flex-1"></span>
        {title}
        <span className="h-px bg-gradient-to-l from-gray-300 to-transparent dark:from-gray-600 flex-1"></span>
      </p>
    </div>
  );
}

/* MENU ITEM */
function MenuItem({ to, icon, label, setSidebarOpen }) {
  const baseClass = `flex items-center justify-between gap-3 px-4 py-3 rounded-xl
    transition-all duration-200 group cursor-pointer`;

  const inactiveClass = `text-gray-700 dark:text-gray-300 
    hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 
    dark:hover:from-gray-700 dark:hover:to-gray-700 
    hover:text-blue-600 dark:hover:text-blue-400`;

  const activeClass = `text-white font-medium shadow-md bg-gradient-to-r from-[#4da3ff] to-[#186cbc]" +
    "dark:bg-gradient-to-r dark:from-[#D9D9D9] dark:to-[#071226] my-1`;

  return (
    <NavLink
      to={to}
      end
      onClick={() => {
        if (window.innerWidth < 1024) setSidebarOpen(false);
      }}
      className={({ isActive }) =>
        `${baseClass} ${isActive ? activeClass : inactiveClass}`
      }
    >
      {({ isActive }) => (
        <>
          <div className="flex items-center gap-3">
            {/* Icon Background Box */}
            <div
              className={`w-9 h-4 flex items-center justify-center transition-all duration-200
                group-hover:scale-110`}
            >
              <div
                className={`${
                  isActive ? "text-white" : "text-blue-600 dark:text-blue-300"
                }`}
              >
                {icon}
              </div>
            </div>

            <span className="font-semibold text-[15px]">{label}</span>
          </div>

          {/* Arrow */}
          <svg
            className={`w-4 h-4 transition-all duration-200 ${
              isActive
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </>
      )}
    </NavLink>
  );
}
