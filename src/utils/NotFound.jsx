import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center p-4">
      <h1 className="text-6xl font-bold text-[#767399] mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
        Page Not Found
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Oops! The page you are looking for does not exist or has been moved.
      </p>

      <Link
        to="/"
        className="px-6 py-3 bg-[#767399] text-white rounded-lg hover:bg-[#767399] transition"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
