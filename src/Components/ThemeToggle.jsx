import { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  // Function to update body background based on theme
  const updateBodyBg = (currentTheme) => {
    if (currentTheme === "dark") {
      document.body.style.backgroundColor = "#071225";
    } else {
      document.body.style.backgroundColor = "#ffffff";
    }
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    setTheme(storedTheme);

    if (storedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    updateBodyBg(storedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    updateBodyBg(newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
    >
      {theme === "light" ? <FaMoon /> : <FaSun />}
    </button>
  );
}
