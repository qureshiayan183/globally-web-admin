"use client";

import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";

export default function Search() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <div className="relative flex items-center">
      {/* Desktop Search */}
      <div
        className={`hidden md:flex absolute right-0 items-center h-10 bg-gray-100 dark:bg-[#1f1b3a] text-gray-700 dark:text-gray-200 rounded-lg shadow-sm transition-all duration-300 transform origin-right ${
          searchOpen ? "w-80 px-3 opacity-100" : "w-50 px-0 opacity-0"
        }`}
      >
        <FaSearch
          size={18}
          className={`text-gray-500 dark:text-gray-300 transition-all duration-300 ${
            searchOpen ? "mr-2" : "hidden"
          }`}
        />
        <input
          type="text"
          placeholder="Search..."
          className={`flex-1 bg-transparent outline-none text-sm md:text-base text-gray-900 dark:text-gray-100 ${
            searchOpen ? "opacity-100" : "opacity-0"
          } transition-opacity duration-300`}
        />
        {searchOpen && (
          <button
            onClick={() => setSearchOpen(false)}
            className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white ml-2"
          >
            <AiOutlineClose size={18} />
          </button>
        )}
      </div>

      {/* Desktop Search Icon */}
      {!searchOpen && (
        <button
          className="hidden md:block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white z-50 relative"
          onClick={() => setSearchOpen(true)}
        >
          <FaSearch size={18} />
        </button>
      )}

      {/* Mobile Search Icon */}
      <button
        className="block md:hidden text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white z-50 relative"
        onClick={() => setMobileSearchOpen(true)}
      >
        <FaSearch size={18} />
      </button>

      {/* Mobile Search Modal */}
      {mobileSearchOpen && (
        <div className="fixed top-0 left-0 w-full bg-white dark:bg-[#232133] z-50 p-4 md:hidden shadow-md transition-colors">
          <div className="w-full flex items-center bg-gray-100 dark:bg-[#1f1b3a] rounded-lg px-3 h-12 transition-colors">
            <FaSearch
              size={18}
              className="text-gray-500 dark:text-gray-300 mr-2"
            />
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 bg-transparent outline-none text-base text-gray-900 dark:text-gray-100"
              autoFocus
            />
            <button
              onClick={() => setMobileSearchOpen(false)}
              className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white ml-2"
            >
              <AiOutlineClose size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
