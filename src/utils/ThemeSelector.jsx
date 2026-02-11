import { useEffect, useState } from "react";
import { FiChevronDown } from "react-icons/fi";

export default function ThemeSelector() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "System");
  const [open, setOpen] = useState(false);

  const themes = ["Light", "Dark", "System"];

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;

    if (theme === "Dark") {
      root.classList.add("dark");
      localStorage.setItem("theme", "Dark");
    } else if (theme === "Light") {
      root.classList.remove("dark");
      localStorage.setItem("theme", "Light");
    } else {
      // System (follow OS)
      localStorage.setItem("theme", "System");
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, [theme]);

  return (
    <div className="relative w-full max-w-xs">
      <label className="block font-medium text-gray-700 dark:text-gray-200 mb-2">
        Theme
      </label>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-sm focus:ring-2 focus:ring-teal-600 focus:outline-none"
      >
        {theme}
        <FiChevronDown
          className={`ml-2 transition-transform ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <ul className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10">
          {themes.map((t) => (
            <li
              key={t}
              onClick={() => {
                setTheme(t);
                setOpen(false);
              }}
              className={`px-4 py-2 cursor-pointer hover:bg-teal-50 dark:hover:bg-gray-700 ${
                theme === t
                  ? "bg-teal-100 dark:bg-gray-700 text-teal-700 dark:text-teal-300 font-medium"
                  : "text-gray-700 dark:text-gray-200"
              }`}
            >
              {t}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
