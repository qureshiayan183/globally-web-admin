import { useState, useRef, useEffect } from "react";
import {
  FaBell,
  FaBoxOpen,
  FaExclamationCircle,
  FaCheckCircle,
} from "react-icons/fa";

const notificationsData = [
  {
    id: 1,
    type: "order",
    message: "New order #1234 received",
    time: "2 mins ago",
    unread: true,
  },
  {
    id: 2,
    type: "system",
    message: "Server rebooted successfully",
    time: "1 hour ago",
    unread: false,
  },
  {
    id: 3,
    type: "delivery",
    message: "Order #1220 delivered",
    time: "3 hours ago",
    unread: false,
  },
];

export default function Notifications() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case "order":
        return <FaBoxOpen className="text-blue-500" />;
      case "delivery":
        return <FaCheckCircle className="text-green-500" />;
      case "system":
        return <FaExclamationCircle className="text-yellow-500" />;
      default:
        return (
          <FaExclamationCircle className="text-gray-500 dark:text-gray-300" />
        );
    }
  };

  const unreadCount = notificationsData.filter((n) => n.unread).length;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <FaBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold flex items-center justify-center rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-full mt-2 w-80 md:w-72 left-1/2 transform -translate-x-1/2 bg-white dark:bg-[#1f1b3a] rounded-xl shadow-xl py-2 z-50 transition-colors">
          <h3 className="px-4 py-2 text-gray-800 dark:text-gray-200 font-semibold border-b border-gray-200 dark:border-[#2a2547]">
            Notifications
          </h3>
          <div className="max-h-72 overflow-y-auto">
            {notificationsData.length > 0 ? (
              notificationsData.map((notif) => (
                <div
                  key={notif.id}
                  className={`px-4 py-3 cursor-pointer flex items-center gap-3 transition-colors
                    ${
                      notif.unread
                        ? "bg-gray-50 dark:bg-[#2a2547]"
                        : "hover:bg-gray-100 dark:hover:bg-[#2a2547]"
                    }`}
                >
                  <div className="flex-shrink-0">{getIcon(notif.type)}</div>
                  <div className="flex-1">
                    <p className="text-gray-700 dark:text-gray-200 text-sm">
                      {notif.message}
                    </p>
                    <span className="text-gray-400 dark:text-gray-400 text-xs">
                      {notif.time}
                    </span>
                  </div>
                  {notif.unread && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                  )}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500 dark:text-gray-400 text-sm text-center">
                No new notifications
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
