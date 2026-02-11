import React, { useEffect, useState } from "react";
import { FiUsers } from "react-icons/fi";
import { LuUserRoundCheck } from "react-icons/lu";
import { PiDesktopLight } from "react-icons/pi";
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";
import { makeRequestAuth } from "../../../../_config/api";
import { toast } from "react-toastify";

function DashboardUser() {
  const [counts, setCounts] = useState({
    users: { total: 0, growth: 0 },
    vendors: { total: 0, growth: 0 },
    companions: { total: 0, growth: 0 },
  });

  const fetchCounts = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = storedUser?.token;

    if (!token) {
      toast.error("Token not found. Please login again.");
      return;
    }

    try {
      const response = await makeRequestAuth(
        "post",
        "/admin/getUserManagementCount",
        {},
        {
          Authorization: `Bearer ${token}`,
        },
      );

      const result = response?.data?.data;

      if (response.data?.statusCode === 1200 && result) {
        setCounts(result);
      } else {
        toast.error("Failed to load user counts.");
      }
    } catch (error) {
      console.error("Error fetching user counts:", error);
      toast.error("Server error while loading data.");
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  const renderGrowth = (growth) => {
    const isPositive = growth >= 0;
    return (
      <div
        className={`mt-2 flex items-center justify-center text-sm ${
          isPositive ? "text-orange-600" : "text-red-800"
        }`}
      >
        {isPositive ? (
          <AiOutlineArrowUp className="mr-1" />
        ) : (
          <AiOutlineArrowDown className="mr-1" />
        )}
        <span className="font-medium">{Math.abs(growth)}%</span>
        <span className="ml-1 text-gray-500">this month</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-md flex flex-col lg:flex-row items-center justify-center divide-y lg:divide-y-0 lg:divide-x divide-gray-300">
      {/* Users */}
      <div className="w-full lg:w-1/3 flex items-center justify-center gap-4 px-4 py-2">
        <div className="bg-pink-100 p-4 rounded-full flex items-center justify-center">
          <FiUsers className="text-5xl text-orange-500" />
        </div>
        <div>
          <div className="text-md font-semibold text-gray-700">Users</div>
          <div className="text-3xl font-bold text-gray-900 mt-1">
            {counts.users.total}
          </div>
          {renderGrowth(counts.users.growth)}
        </div>
      </div>

      {/* Vendors */}
      <div className="w-full lg:w-1/3 flex items-center justify-center gap-4 px-4 py-2">
        <div className="bg-pink-100 p-4 rounded-full flex items-center justify-center">
          <LuUserRoundCheck className="text-5xl text-orange-500" />
        </div>
        <div>
          <div className="text-md font-semibold text-gray-700">Vendors</div>
          <div className="text-3xl font-bold text-gray-900 mt-1">
            {counts.vendors.total}
          </div>
          {renderGrowth(counts.vendors.growth)}
        </div>
      </div>

      {/* Companions */}
      <div className="w-full lg:w-1/3 flex items-center justify-center gap-4 px-4 py-6">
        <div className="bg-pink-100 p-4 rounded-full flex items-center justify-center">
          <PiDesktopLight className="text-5xl text-orange-500" />
        </div>
        <div>
          <div className="text-md font-semibold text-gray-700">Companions</div>
          <div className="text-3xl font-bold text-gray-900 mt-1">
            {counts.companions.total}
          </div>
          {renderGrowth(counts.companions.growth)}
        </div>
      </div>
    </div>
  );
}

export default DashboardUser;
