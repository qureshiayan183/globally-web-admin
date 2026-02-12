import React, { useState, useEffect, useCallback } from "react";
import { FiSearch, FiX, FiEye } from "react-icons/fi";
import { ToastContainer } from "react-toastify";
import { makeRequestAuth } from "../../../../_config/api";
import "react-toastify/dist/ReactToastify.css";
import { showErrorToast } from "../../../../utils/toastUtils";
import Spinner from "../../../../utils/Loader";

function AllComment() {
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalComments, setTotalComments] = useState(0);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Modal State
  const [selectedComment, setSelectedComment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // useEffect(() => {
  //   const delayDebounce = setTimeout(() => {
  //     fetchComments();
  //   }, 500);

  //   return () => clearTimeout(delayDebounce);
  // }, [currentPage, searchTerm]);

  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await makeRequestAuth(
        "post",
        "/admin/getBlogCommentList",
        {
          keyWord: searchTerm,
          sortOrder: "desc",
          sortBy: "createdAt",
          pageNo: currentPage,
          size: pageSize,
        },
      );

      const list = response.data.list || [];
      setComments(list);
      setTotalComments(response.data?.total || list.length);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
      showErrorToast("Failed to load comments.");
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, currentPage, pageSize]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchComments();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [fetchComments]);

  const totalPages = Math.ceil(totalComments / pageSize);

  const toTitleCase = (str) =>
    str?.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="grid grid-cols-1 gap-6 p-4">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* MAIN CONTAINER */}
      <div className="bg-white dark:bg-[#1E2738] text-gray-800 dark:text-white rounded-2xl p-6 md:p-8 border border-purple-300 dark:border-purple-600/50 shadow-xl">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Blog Comments
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Total {totalComments} comments found
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search comments..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 
              bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition"
            />
          </div>
        </div>

        {/* TABLE LAYOUT */}
        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full table-auto text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300 text-sm uppercase tracking-wider font-semibold border-b border-gray-200 dark:border-gray-700">
                  <th className="py-4 px-6 w-16 text-center">#</th>
                  <th className="py-4 px-6 min-w-[150px]">Author</th>
                  <th className="py-4 px-6 min-w-[200px]">Email</th>
                  <th className="py-4 px-6 min-w-[300px]">Comment Preview</th>
                  <th className="py-4 px-6 min-w-[150px]">Date</th>
                  <th className="py-4 px-6 min-w-[100px] text-right">View</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {comments.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-10 text-gray-500 dark:text-gray-400"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <p className="text-lg font-medium">No Comments Found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  comments.map((comment, index) => (
                    <tr
                      key={comment._id}
                      className="hover:bg-blue-50/50 dark:hover:bg-gray-700/30 group"
                    >
                      <td className="py-4 px-6 text-center text-gray-500 dark:text-gray-400 font-medium">
                        {(currentPage - 1) * pageSize + index + 1}
                      </td>

                      <td className="py-4 px-6 font-medium text-gray-800 dark:text-white">
                        {toTitleCase(comment.name)}
                      </td>

                      <td className="py-4 px-6 text-gray-600 dark:text-gray-400 text-sm">
                        {comment.email}
                      </td>

                      <td className="py-4 px-6 text-gray-600 dark:text-gray-300 text-sm">
                        <p
                          className="line-clamp-1 max-w-xs"
                          title={comment.comment}
                        >
                          {comment.comment}
                        </p>
                      </td>

                      <td className="py-4 px-6 text-gray-500 dark:text-gray-400 text-sm whitespace-nowrap">
                        {formatDate(comment.createdAt)}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => {
                            setSelectedComment(comment);
                            setIsModalOpen(true);
                          }}
                          className="p-2 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 transition-colors tooltip"
                          title="View Details"
                        >
                          <FiEye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION */}
        {totalComments > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Showing{" "}
              <span className="text-gray-900 dark:text-white font-bold">
                {(currentPage - 1) * pageSize + 1}
              </span>{" "}
              to{" "}
              <span className="text-gray-900 dark:text-white font-bold">
                {Math.min(currentPage * pageSize, totalComments)}
              </span>{" "}
              of{" "}
              <span className="text-gray-900 dark:text-white font-bold">
                {totalComments}
              </span>{" "}
              entries
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 
                      text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium text-sm"
              >
                Previous
              </button>

              <div className="hidden sm:flex gap-1">
                {[...Array(totalPages).keys()].slice(0, 5).map((n) => (
                  <button
                    key={n + 1}
                    onClick={() => goToPage(n + 1)}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold transition ${
                      currentPage === n + 1
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    {n + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 
                      text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium text-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- VIEW MODAL --- */}
      {isModalOpen && selectedComment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white dark:bg-[#1E2738] rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200 dark:border-gray-600 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-t-2xl">
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Comment Details
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Author Name
                  </label>
                  <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
                    {toTitleCase(selectedComment.name)}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Email Address
                  </label>
                  <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
                    {selectedComment.email}
                  </p>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Submitted On
                  </label>
                  <p className="mt-1 text-base text-gray-700 dark:text-gray-300">
                    {formatDate(selectedComment.createdAt)}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-6 border border-gray-100 dark:border-gray-700 relative">
                <div className="absolute top-4 left-4 text-purple-200 dark:text-gray-600 text-6xl font-serif leading-none select-none">
                  "
                </div>
                <p className="relative z-10 text-gray-700 dark:text-gray-200 text-lg leading-relaxed whitespace-pre-wrap">
                  {selectedComment.comment}
                </p>
              </div>

              {selectedComment.blogTitle && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Commented on:{" "}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {selectedComment.blogTitle}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllComment;
