import React from "react";

export default function Loader() {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center 
      bg-white/50 dark:bg-[#0f172a]/60 backdrop-blur-md z-[9999]"
    >
      <div className="relative flex flex-col items-center">
        {/* Outer Glowing Ring (Static) */}
        <div className="absolute inset-0 rounded-full blur-xl bg-blue-500/20 dark:bg-purple-500/30 w-16 h-16 animate-pulse" />

        {/* Spinner Ring */}
        <div className="relative w-16 h-16">
          {/* Track (Gray circle background) */}
          <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700 opacity-30"></div>

          {/* Moving Gradient Arc */}
          <div
            className="absolute inset-0 rounded-full border-4 border-transparent 
            border-t-blue-600 border-r-purple-600 dark:border-t-blue-500 dark:border-r-purple-500
            animate-spin"
            style={{
              borderBottomColor: "transparent",
              borderLeftColor: "transparent",
            }}
          ></div>
        </div>

        {/* Brand/Loading Text */}
        <div className="mt-6 text-center">
          <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
            Loading...
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
            Please wait
          </p>
        </div>
      </div>
    </div>
  );
}
