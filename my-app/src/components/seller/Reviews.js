"use client";

import React, { useState, useEffect } from "react";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaSearch,
  FaReply,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import { MdRefresh } from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance";
import { showErrorToast, showSuccessToast } from "../../utils/Toast";

const Reviews = () => {
  // State for reviews data
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    average: 0,
    total: 0,
    distribution: [0, 0, 0, 0, 0], // 5 stars to 1 star
  });

  // State for filters and sorting
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState();
  const [filterResponded, setFilterResponded] = useState();
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // State for reply functionality
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const onChangeReply = (e) => {
    if (e === "all") {
      setFilterResponded(null);
    } else if (e === "true") {
      setFilterResponded(true);
    } else if (e === "false") {
      setFilterResponded(false);
    }
  };
  const fetchReviewsData = () => {
    setLoading(true);
    axiosInstance
      .get("/api/seller/reviews", {
        params: {
          keyword: searchTerm,
          page: currentPage,
          byRate: filterRating,
          isReply: filterResponded,
          sortBy: sortBy,
          sort: sortOrder,
        },
      })
      .then((response) => {
        console.log(response.data.data);
        setReviews(response.data.data);
      })
      .catch((error) => {
        showErrorToast(error.response?.data?.message || "Đã có lỗi xảy ra");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    axiosInstance.get("/api/seller/reviews/all").then((response) => {
      calculateStats(response.data.data);
    });
  }, []);
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchReviewsData();
    }, 500); // chờ 500ms sau khi người dùng dừng gõ
    return () => clearTimeout(delayDebounce); // hủy timeout nếu searchTerm thay đổi trước khi 500ms
  }, [searchTerm, filterRating, filterResponded, sortBy, sortOrder]);

  const calculateStats = (data) => {
    const total = data.length;
    setFilteredReviews(data);
    const sum = data.reduce((acc, review) => acc + review, 0);
    console.log("sum" + sum);

    const average = sum / total;
    // Calculate stats
    const distribution = [0, 0, 0, 0, 0];
    data.forEach((review) => {
      distribution[5 - review]++;
    });
    setStats({
      average,
      total,
      distribution,
    });
  };
  // Handle reply submission
  const handleReplySubmit = (reviewId) => {
    if (!replyText.trim()) return;
    setLoading(true);
    console.log(reviewId);
    console.log(replyText);

    const dataToSend = {
      id: reviewId,
      reply: replyText,
    };
    axiosInstance
      .post("api/seller/reviews/reply", dataToSend)
      .then((response) => {
        fetchReviewsData();
        showSuccessToast(response.data.message);
      })
      .catch((error) => {
        showErrorToast(error.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReviews.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300" />);
      }
    }

    return <div className="flex">{stars}</div>;
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Đánh giá sản phẩm
      </h1>

      {/* Stats Overview */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-gray-800">
              {stats.average.toFixed(1)}
            </div>
            <div className="mt-2">{renderStars(stats.average)}</div>
            <div className="text-sm text-gray-500 mt-1">
              Dựa trên {stats.total} đánh giá
            </div>
          </div>

          <div className="col-span-2">
            <h3 className="text-sm font-medium text-gray-500 mb-3">
              Phân bố đánh giá
            </h3>
            {stats.distribution.map((count, index) => {
              const starCount = 5 - index;
              const percentage =
                stats.total > 0 ? (count / stats.total) * 100 : 0;

              return (
                <div key={starCount} className="flex items-center mb-1">
                  <div className="w-12 text-sm text-gray-600">
                    {starCount} sao
                  </div>
                  <div className="flex-1 mx-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{
                          width: `${percentage}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-10 text-sm text-gray-600">{count}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Tìm kiếm đánh giá..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterRating}
            onChange={(e) => setFilterRating(Number(e.target.value))}
          >
            <option value="0">Tất cả sao</option>
            <option value="5">5 sao</option>
            <option value="4">4 sao</option>
            <option value="3">3 sao</option>
            <option value="2">2 sao</option>
            <option value="1">1 sao</option>
          </select>

          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterResponded}
            onChange={(e) => onChangeReply(e.target.value)}
          >
            <option value={"all"}>Tất cả phản hồi</option>
            <option value={true}>Đã phản hồi</option>
            <option value={false}>Chưa phản hồi</option>
          </select>

          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              onClick={() => {
                setSortBy("createdAt");
                setSortOrder(sortOrder === "desc" ? "asc" : "desc");
              }}
            >
              <span>Ngày</span>
              {sortBy === "createdAt" &&
                (sortOrder === "desc" ? (
                  <FaSortAmountDown />
                ) : (
                  <FaSortAmountUp />
                ))}
            </button>

            <button
              className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              onClick={() => {
                setSortBy("rate");
                setSortOrder(sortOrder === "desc" ? "asc" : "desc");
              }}
            >
              <span>Đánh giá</span>
              {sortBy === "rate" &&
                (sortOrder === "desc" ? (
                  <FaSortAmountDown />
                ) : (
                  <FaSortAmountUp />
                ))}
            </button>

            <button
              className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              onClick={() => {
                setSearchTerm("");
                setFilterRating(0);
                onChangeReply("all");
                setSortBy("createdAt");
                setSortOrder("desc");
              }}
            >
              <MdRefresh />
            </button>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">
              Không tìm thấy đánh giá nào phù hợp với bộ lọc.
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className={`border ${
                review.reported ? "border-red-200 bg-red-50" : "border-gray-200"
              } rounded-lg p-4 transition-all hover:shadow-md`}
            >
              <div className="flex items-start">
                <img
                  src={review.customerAvatar || "/placeholder.svg"}
                  alt={review.customerFullName}
                  className="w-10 h-10 rounded-full mr-4"
                />

                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {review.customerFullName}
                      </h3>
                    </div>

                    <div className="flex items-center mt-2 sm:mt-0">
                      {!review.reply && !review.reported && (
                        <button
                          className="text-blue-500 hover:text-blue-700 mr-4 flex items-center"
                          onClick={() => setReplyingTo(review.id)}
                        >
                          <FaReply className="mr-1" /> Phản hồi
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start mt-3">
                    <div className="w-12 h-12 rounded overflow-hidden mr-3 flex-shrink-0">
                      <img
                        src={review.productImage || "/placeholder.svg"}
                        alt={review.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {review.productName}
                      </p>
                      <p className="text-sm text-gray-500">
                        Mã SP: {review.productCode}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center mt-1">
                    {renderStars(review.rate)}
                    <span className="ml-2 text-sm text-gray-500">
                      {formatDate(review.created_at)}
                    </span>
                  </div>
                  <p className="mt-3 text-gray-700">{review.content}</p>

                  {review.reply && (
                    <div className="mt-4 pl-4 border-l-2 border-gray-200">
                      <p className="text-sm font-medium text-gray-700">
                        Phản hồi của bạn
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        {review.reply}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {formatDate(review.reply_at)}
                      </p>
                    </div>
                  )}

                  {replyingTo === review.id && (
                    <div className="mt-4">
                      <textarea
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="3"
                        placeholder="Nhập phản hồi của bạn..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                      ></textarea>
                      <div className="flex justify-end mt-2 space-x-2">
                        <button
                          className="px-4 py-2 text-gray-600 hover:text-gray-800"
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyText("");
                          }}
                        >
                          Hủy
                        </button>
                        <button
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                          disabled={!replyText.trim()}
                          onClick={() => handleReplySubmit(review.id)}
                        >
                          Gửi phản hồi
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Hiển thị {indexOfFirstItem + 1}-
            {Math.min(indexOfLastItem, filteredReviews.length)} trong số{" "}
            {filteredReviews.length} đánh giá
          </div>

          <div className="flex space-x-1">
            <button
              className={`px-3 py-1 rounded ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Trước
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                if (totalPages <= 7) return true;
                if (page === 1 || page === totalPages) return true;
                if (page >= currentPage - 1 && page <= currentPage + 1)
                  return true;
                if (page === 2 && currentPage <= 3) return true;
                if (page === totalPages - 1 && currentPage >= totalPages - 2)
                  return true;
                return false;
              })
              .map((page, index, array) => {
                // Add ellipsis
                if (index > 0 && page > array[index - 1] + 1) {
                  return (
                    <React.Fragment key={`ellipsis-${page}`}>
                      <span className="px-3 py-1 text-gray-400">...</span>
                      <button
                        className={`px-3 py-1 rounded ${
                          currentPage === page
                            ? "bg-blue-500 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  );
                }

                return (
                  <button
                    key={page}
                    className={`px-3 py-1 rounded ${
                      currentPage === page
                        ? "bg-blue-500 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                );
              })}

            <button
              className={`px-3 py-1 rounded ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Tiếp
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;
