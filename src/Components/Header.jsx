import { FaBars, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
// import Search from "./Search";
// import Notifications from "./Notifications";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { onErrorLogout } from "../_config/authService";
import profile from "../assets/img/profile.png";
import logout from "../assets/icons/logout.svg";

function Header({ onToggleSidebar, sidebarOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header
        className={`bg-gradient-to-r from-white via-gray-50 to-white
        dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
        text-gray-900 dark:text-white fixed top-0 right-0 z-20 
        flex items-center justify-between px-4 sm:px-6 py-2
        shadow-lg border-b border-gray-200 dark:border-gray-700
        transition-all duration-700 ease-in-out w-full
        ${
          sidebarOpen ? "lg:ml-72 lg:w-[calc(100%-18rem)]" : "lg:ml-0 lg:w-full"
        }`}
      >
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2.5 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 
            dark:hover:from-gray-700 dark:hover:to-gray-700
            focus:outline-none transition-all duration-200 group"
          >
            <FaBars
              size={20}
              className="group-hover:scale-110 transition-transform"
            />
          </button>

          <div className="hidden sm:block">
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome, Admin
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
              Manage your dashboard
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* <Search />
          <Notifications /> */}
          <ThemeToggle />

          {/* Profile Dropdown */}
          <div className="relative" ref={menuRef}>
            <div
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center space-x-3 cursor-pointer 
              px-3 py-2 rounded-xl transition-all duration-200
              hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50
              dark:hover:from-gray-700 dark:hover:to-gray-700
              border-2 border-transparent hover:border-blue-200 dark:hover:border-gray-600"
            >
              <span className="hidden sm:inline text-gray-700 dark:text-gray-200 font-semibold text-sm capitalize">
                Super Admin
              </span>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-50"></div>
                <img
                  src={profile}
                  alt="Profile"
                  className="relative w-9 h-9 rounded-full border-2 border-white dark:border-gray-700 object-cover shadow-lg"
                />
              </div>
            </div>

            {/* Dropdown Menu */}
            {menuOpen && (
              <div
                className="absolute right-0 mt-3 w-56 
                bg-white dark:bg-gray-800
                rounded-2xl shadow-2xl overflow-hidden 
                border border-gray-200 dark:border-gray-700
                animate-dropdown z-50"
              >
                {/* Profile Section */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                  <p className="text-sm font-bold text-gray-800 dark:text-white capitalize">
                    Super Admin
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Administrator
                  </p>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <Link
                    to="/settings/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 
                    text-gray-700 dark:text-gray-200 
                    hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50
                    dark:hover:from-gray-700 dark:hover:to-gray-700
                    transition-all duration-200 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FaCog className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-sm font-semibold">Settings</span>
                  </Link>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 dark:border-gray-700"></div>

                {/* Logout */}
                <div className="py-2">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setShowLogoutPopup(true);
                    }}
                    className="flex items-center gap-3 w-full text-left px-4 py-3 
                    text-red-600 dark:text-red-400 
                    hover:bg-red-50 dark:hover:bg-red-900/20
                    transition-all duration-200 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FaSignOutAlt className="text-red-600 dark:text-red-400" />
                    </div>
                    <span className="text-sm font-semibold">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

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
        @keyframes dropdown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        .animate-dropdown {
          animation: dropdown 0.2s ease-out;
        }
      `}</style>
    </>
  );
}

export default Header;
