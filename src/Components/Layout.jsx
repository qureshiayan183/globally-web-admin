import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="bg-white dark:bg-[#071225] transition-colors duration-700 ease-in-out">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col transition-all duration-700">
        <Header
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main
          className={`flex-1 md:p-4 md:pt-16 pt-16 transition-all duration-700 ${
            sidebarOpen ? "lg:ml-72" : "lg:ml-0"
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
