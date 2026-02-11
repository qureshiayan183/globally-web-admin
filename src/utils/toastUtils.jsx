import { toast } from "react-toastify";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

// Success Toast
export const showSuccessToast = (message) => {
  toast(
    ({ closeToast }) => (
      <div className="flex items-center gap-3">
        <FiCheckCircle className="text-green-500 w-6 h-6" />
        <span className="text-gray-800 dark:text-gray-100 font-medium">
          {message || "Success!"}
        </span>
      </div>
    ),
    {
      position: "top-right",
      autoClose: 3000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      hideProgressBar: false,
      className:
        "bg-white dark:bg-gray-800 border-l-4 border-green-500 shadow-lg rounded-lg p-3",
    }
  );
};

// Error Toast
export const showErrorToast = (message) => {
  toast(
    ({ closeToast }) => (
      <div className="flex items-center gap-3">
        <FiXCircle className="text-red-500 w-6 h-6" />
        <span className="text-gray-800 dark:text-gray-100 font-medium">
          {message || "Something went wrong"}
        </span>
      </div>
    ),
    {
      position: "top-right",
      autoClose: 4000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      hideProgressBar: false,
      className:
        "bg-white dark:bg-gray-800 border-l-4 border-red-500 shadow-lg rounded-lg p-3",
    }
  );
};
