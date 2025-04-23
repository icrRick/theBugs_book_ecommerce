import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Pagination from "../admin/Pagination";
import { showErrorToast, showSuccessToast } from "../../utils/Toast";

const Promotions = () => {
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [expireDate, setExpireDate] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const fetchPromotions = useCallback(async (start, expire, page) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/seller/promotion/list", {
        params: {
          startDate: start || null,
          expireDate: expire || null,
          page: page || 1,
        },
      });
      if (response.data.status === true) {
        setPromotions(response.data.data.arrayList);
        setTotalItems(response.data.data.totalItems);
      }
    } catch (error) {
      console.error("Error fetching promotions:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUrlParams = useCallback((start, expire, page) => {
    const params = new URLSearchParams();
    if (start) params.set("startDate", start);
    if (expire) params.set("expireDate", expire);
    if (page) params.set("page", page.toString());
    window.history.pushState(
      null,
      "",
      params.toString() ? `?${params.toString()}` : window.location.pathname
    );
  }, []);

  const handleSearch = useCallback(() => {
    setCurrentPage(1);
    updateUrlParams(startDate, expireDate, 1);
    fetchPromotions(startDate, expireDate, 1);
  }, [startDate, expireDate, updateUrlParams, fetchPromotions]);

  const handlePageChange = useCallback(
    (newPage) => {
      setCurrentPage(newPage);
      updateUrlParams(startDate, expireDate, newPage);
      fetchPromotions(startDate, expireDate, newPage);
    },
    [startDate, expireDate, updateUrlParams, fetchPromotions]
  );

  const handleReset = useCallback(() => {
    setStartDate("");
    setExpireDate("");
    setCurrentPage(1);
    updateUrlParams("", "", 1);
    fetchPromotions("", "", 1);
  }, [updateUrlParams, fetchPromotions]);

  // Khởi tạo từ URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const start = params.get("startDate") || "";
    const expire = params.get("expireDate") || "";
    const page = parseInt(params.get("page")) || 1;

    setStartDate(start);
    setExpireDate(expire);
    setCurrentPage(page);
    fetchPromotions(start, expire, page);
  }, [fetchPromotions]); // Chỉ chạy một lần khi mount

  const getStatusColor = (status) => {
    switch (status) {
      case "sắp diễn ra":
        return "bg-yellow-100 text-yellow-800";
      case "đang diễn ra":
        return "bg-green-100 text-green-800";
      case "đã kết thúc":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleAdd = () => {
    navigate("/seller/addpromotion");
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const handleViewDetails = (id) => {
    navigate(`/seller/editpromotion/${id}`);
    console.log("View promotion details:", id);
  };

  const confirmDelete = async (id) => {
    try {
      // Gọi API xóa voucher
      const response = await axiosInstance.post(
        `/seller/promotion/delete?id=${id}`
      );

      if (response.data.status === true) {
        // Đóng modal
        setShowDeleteModal(false);
        setSelectedItem(null);
        showSuccessToast(response.data.message || "Xóa khuyến mãi thành công");
        fetchPromotions(startDate, expireDate, currentPage);
      }
    } catch (error) {
      console.error("Lỗi khi xóa khuyến mãi:", error);
      showErrorToast("Xóa khuyến mãi thất bại" + error.response.data.message);
    }
  };
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Quản lý khuyến mãi
            </h1>
            <p className="text-sm text-gray-600">
              Quản lý và theo dõi các chương trình khuyến mãi của bạn
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 flex items-center gap-2"
              onClick={handleReset}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Đặt lại
            </button>
            <button
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm"
              onClick={handleAdd}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Tạo khuyến mãi mới
            </button>
          </div>
        </div>

        {/* Filter Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-5">
            <label
              htmlFor="start-date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Từ ngày
            </label>
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>
          <div className="md:col-span-5">
            <label
              htmlFor="end-date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Đến ngày
            </label>
            <input
              type="date"
              id="end-date"
              value={expireDate}
              onChange={(e) => setExpireDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>
          <div className="md:col-span-2">
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className={`w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Lọc
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && promotions.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Promotions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotions.map((promotion) => (
              <div
                key={promotion.id}
                className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100 overflow-hidden ${
                  !promotion.active ? "opacity-75" : ""
                }`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl font-bold text-red-600">
                          -{promotion?.promotionValue}%
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            promotion.active
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {promotion.active ? "Đang hoạt động" : "Đã tắt"}
                        </span>
                      </div>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          promotion.status
                        )}`}
                      >
                        {promotion?.status}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDetails(promotion.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        title="Xem chi tiết"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(promotion)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="Xóa"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center text-sm">
                      <div className="p-2 bg-blue-50 rounded-lg mr-3">
                        <svg
                          className="w-5 h-5 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-500 mb-1">Thời gian áp dụng</p>
                        <p className="font-medium text-gray-900">
                          {promotion?.startDate} - {promotion?.expireDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center text-sm">
                      <div className="p-2 bg-green-50 rounded-lg mr-3">
                        <svg
                          className="w-5 h-5 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-500 mb-1">Ngày tạo</p>
                        <p className="font-medium text-gray-900">
                          {promotion?.createdAt}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8">
            {promotions.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(totalItems / 9)}
                setCurrentPage={handlePageChange}
              />
            )}
          </div>
        </>
      )}
      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-red-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Xác nhận xóa
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Bạn có chắc chắn muốn xóa promotion{" "}
                        <span className="text-sm font-bold text-red-600">
                          -{selectedItem?.promotionValue}%
                        </span>{" "}
                        này? Hành động này không thể hoàn tác.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => confirmDelete(selectedItem.id)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Xóa
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedItem(null);
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Promotions;
