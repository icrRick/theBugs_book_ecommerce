"use client";

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Pagination from "../admin/Pagination";
import { showErrorToast, showSuccessToast } from "../../utils/Toast";
import { formatCurrency } from "../../utils/Format";
import Loading from "../../utils/Loading";

const Ordered = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState(searchParams.get("status") || "");
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [filters, setFilters] = useState({
    userName: searchParams.get("userName") || "",
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
  });
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page")) || 1
  );
  const pageSize = 10;
  const [totalPages, setTotalPages] = useState(0);

  function useDebounce(value, delay = 300) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  }

  const statusConfig = {
    "Chờ duyệt": {
      color: "bg-amber-100 text-amber-800 border-amber-200",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    "Đã hủy": {
      color: "bg-red-100 text-red-800 border-red-200",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    "Đã duyệt": {
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    "Đang giao": {
      color: "bg-purple-100 text-purple-800 border-purple-200",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
        </svg>
      ),
    },
    "Đã nhận": {
      color: "bg-green-100 text-green-800 border-green-200",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path
            fillRule="evenodd"
            d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  };

  const tabs = [
    { id: "", label: "Tất cả" },
    { id: "1", label: "Chờ duyệt" },
    { id: "2", label: "Đã hủy" },
    { id: "3", label: "Đã duyệt" },
    { id: "4", label: "Đang giao" },
    { id: "5", label: "Đã giao" },
    { id: "6", label: "Đã nhận" },
  ];

  const getStatusIdFromName = (statusName) => {
    switch (statusName) {
      case "Chờ duyệt":
        return 1;
      case "Hủy":
        return 2;
      case "Đã duyệt":
        return 3;
      case "Đang giao":
        return 4;
      case "Đã giao":
        return 5;
      case "Đã nhận":
        return 6;
      default:
        return 0;
    }
  };

  const getStatusNameFromId = (statusId) => {
    switch (statusId) {
      case "1":
        return "Chờ duyệt";
      case "2":
        return "Hủy";
      case "3":
        return "Đã duyệt";
      case "4":
        return "Đang giao";
      case "5":
        return "Đã giao";
      case "6":
        return "Đã nhận";
      default:
        return "";
    }
  };

  const fetchAllOrders = async (keyword = "", page = 1) => {
    setIsLoading(true);
    showErrorToast(null);
    axiosInstance
      .get("/user/order", {
        params: {
          keyword: keyword || undefined,
          page: page,
          size: pageSize,
        },
      })
      .then((response) => {
        console.log(response);
        setAllOrders(response.data.data.objects);
        setOrders(response.data.data.objects);
        setTotalOrders(response.data.data.totalItems || 0);
        setTotalPages(Math.ceil(response.data.data.totalItems / pageSize));
      })
      .catch((error) => {
        console.log(error);
        setAllOrders([]);
        setOrders([]);
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      });
  };

  const searchOrders = async (keyword = "", page = 1) => {
    setIsLoading(true);
    try {
      const params = {
        keyword: keyword || undefined,
        userName: filters.userName || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        statusOrder: activeTab || undefined,
        page: page,
        size: pageSize,
      };
      const response = await axiosInstance.get("/user/order", { params });
      const { data, message } = response.data;

      if (response.status === 200) {
        const ordersList = data.objects || [];
        setOrders(ordersList);
        setTotalOrders(data.totalItems || 0);
        setTotalPages(Math.ceil(data.totalItems / pageSize));
      } else {
        console.error("Failed to search orders:", message);
        setOrders([]);
      }
    } catch (error) {
      console.error("Error searching orders:", error);
      setOrders([]);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 200);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axiosInstance.put(
        `/user/order/update/${orderId}`,
        {
          orderStatus: newStatus,
          cancelReason: newStatus === 2 ? "Lý do hủy mặc định" : "",
        }
      );

      const { message, status } = response.data;
      if (status) {
        const statusName = getStatusNameFromId(newStatus.toString());

        showSuccessToast(
          `Trạng thái đơn hàng đã được cập nhật thành ${statusName}!`
        );

        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId
              ? { ...order, orderStatusName: statusName }
              : order
          )
        );
      } else {
        showErrorToast(`Cập nhật trạng thái thất bại: ${message}`);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      if (error.response?.data?.message) {
        showErrorToast(error.response.data.message);
      } else {
        showErrorToast("Đã có lỗi xảy ra khi cập nhật trạng thái");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const openCancelModal = (orderId) => {
    setOrderToCancel(orderId);
    setShowCancelModal(true);
    setCancelReason("");
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setOrderToCancel(null);
    setCancelReason("");
  };

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      showErrorToast("Lý do hủy không được để trống!");
      return;
    }
    setIsLoading(true);
    try {
      setIsLoading(true);
      const response = await axiosInstance.put(
        `/user/order/update/${orderToCancel}`,
        {
          orderStatus: 2,
          cancelReason: cancelReason,
        }
      );
      const { message, status } = response.data;
      if (status) {
        showSuccessToast("Đơn hàng đã được hủy thành công!");
        closeCancelModal();
        searchOrders(keyword, currentPage);
      } else {
        showErrorToast(`Hủy đơn hàng thất bại: ${message}`);
        closeCancelModal();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        showErrorToast(error.response.data.message);
        closeCancelModal();
      }
      console.error("Error cancelling order:", error);
      showErrorToast("Đã xảy ra lỗi khi hủy đơn hàng");
      closeCancelModal();
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 200);
    }
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1);

    const params = new URLSearchParams();
    if (tabId) params.set("status", tabId);
    if (keyword) params.set("keyword", keyword);
    if (filters.userName) params.set("userName", filters.userName);
    if (filters.startDate) params.set("startDate", filters.startDate);
    if (filters.endDate) params.set("endDate", filters.endDate);
    params.set("page", 1);
    setSearchParams(params);
  };

  const handlePageChange = (newPage) => {
    window.scrollTo({ top: 0, behavior: "auto" });
    setCurrentPage(newPage);
    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (activeTab) params.set("status", activeTab);
    if (filters.userName) params.set("userName", filters.userName);
    if (filters.startDate) params.set("startDate", filters.startDate);
    if (filters.endDate) params.set("endDate", filters.endDate);
    params.set("page", newPage);
    setSearchParams(params);
  };

  const handleFilterChange = (e) => {
    const { id, value } = e.target;
    let fieldName;
    if (id === "name-filter") {
      fieldName = "userName";
    } else if (id === "start-date") {
      fieldName = "startDate";
    } else if (id === "end-date") {
      fieldName = "endDate";
    }
    setFilters((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (activeTab) params.set("status", activeTab);
    if (filters.userName) params.set("userName", filters.userName);
    if (filters.startDate) params.set("startDate", filters.startDate);
    if (filters.endDate) params.set("endDate", filters.endDate);
    if (
      filters.startDate &&
      filters.endDate &&
      new Date(filters.startDate) > new Date(filters.endDate)
    ) {
      showErrorToast("Ngày bắt đầu không được lớn hơn ngày kết thúc");
      return;
    }
    params.set("page", 1);
    setSearchParams(params);
  };

  const handleViewDetails = (orderId) => {
    sessionStorage.setItem("selectedOrderId", orderId);
    const params = new URLSearchParams(searchParams);
    params.set("selectedOrderId", orderId);
    navigate(`/account/order/${orderId}?${params.toString()}`);
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const keyword = params.get("keyword") || "";
    const page = parseInt(params.get("page")) || 1;
    setKeyword(keyword);
    setCurrentPage(page);
    setFilters({
      userName: params.get("userName") || "",
      startDate: params.get("startDate") || "",
      endDate: params.get("endDate") || "",
    });

    fetchAllOrders(keyword, page);
  }, []);

  useEffect(() => {
    let selectedOrderId = searchParams.get("selectedOrderId");

    if (!selectedOrderId) {
      selectedOrderId = sessionStorage.getItem("selectedOrderId");
    }

    if (selectedOrderId) {
      const interval = setInterval(() => {
        const element = document.getElementById(`order-${selectedOrderId}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          clearInterval(interval);

          sessionStorage.removeItem("selectedOrderId");

          const params = new URLSearchParams(searchParams);
          params.delete("selectedOrderId");
          setSearchParams(params);
        }
      }, 300);

      return () => clearInterval(interval);
    }
  }, [orders, searchParams]);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  //fillter fe
  const debouncedUserName = useDebounce(filters.userName, 300);
  const debouncedStartDate = useDebounce(filters.startDate, 300);
  const debouncedEndDate = useDebounce(filters.endDate, 300);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedUserName) {
      params.set("userName", debouncedUserName);
    } else {
      params.delete("userName");
    }

    if (debouncedStartDate) {
      params.set("startDate", debouncedStartDate);
    } else {
      params.delete("startDate");
    }

    if (debouncedEndDate) {
      params.set("endDate", debouncedEndDate);
    } else {
      params.delete("endDate");
    }

    params.set("page", 1);
    setSearchParams(params);
  }, [debouncedUserName, debouncedStartDate, debouncedEndDate]);

  const filteredOrders = allOrders.filter((order) => {
    const matchesStatus =
      !activeTab ||
      getStatusIdFromName(order.orderStatusName) === Number.parseInt(activeTab);

    const matchesName =
      !debouncedUserName ||
      (order.customerInfo &&
        order.customerInfo
          .toLowerCase()
          .includes(debouncedUserName.toLowerCase()));

    const matchesStartDate =
      !debouncedStartDate ||
      (order.orderDate &&
        new Date(order.orderDate) >= new Date(debouncedStartDate));

    const matchesEndDate =
      !debouncedEndDate ||
      (order.orderDate &&
        new Date(order.orderDate) <= new Date(debouncedEndDate));

    return matchesStatus && matchesName && matchesStartDate && matchesEndDate;
  });

  const filteredTotal = filteredOrders.length;
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, filteredTotal);
  const displayText =
    filteredTotal > 0
      ? `Hiển thị ${startIndex}-${endIndex} trên ${filteredTotal} đơn hàng`
      : "Không có đơn hàng";

  return (
    <div className="w-full mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Bộ lọc đơn hàng
        </h2>
        <form onSubmit={handleFilterSubmit} className="grid grid-cols-12 gap-4">
          <div className="col-span-7 space-y-2">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="name-filter"
            >
              Tên khách hàng
            </label>
            <input
              type="text"
              id="name-filter"
              placeholder="Nhập tên khách hàng..."
              value={filters.userName}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
            />
          </div>

          <div className="col-span-2 space-y-2">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="start-date"
            >
              Từ ngày
            </label>
            <input
              type="date"
              id="start-date"
              value={filters.startDate || ""}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
            />
          </div>

          <div className="col-span-2 space-y-2">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="end-date"
            >
              Đến ngày
            </label>
            <input
              type="date"
              id="end-date"
              value={filters.endDate || ""}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
            />
          </div>

          <div className="col-span-1 flex items-end">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-md transition duration-150 ease-in-out flex items-center justify-center space-x-1"
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span>Lọc</span>
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm mb-6 overflow-x-auto">
        <div className="flex space-x-1 p-1 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`
      px-4 py-2.5 rounded-md font-medium text-sm transition-all duration-200
      ${
        activeTab === tab.id
          ? "bg-emerald-50 text-emerald-700 shadow-sm"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      }
    `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-4 text-sm text-gray-600 ml-2 mb-2">{displayText}</div>

      <div className="space-y-6 min-h-[calc(100vh-300px)]">
        {isLoading ? (
          Array(3)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm p-6 animate-pulse"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-40"></div>
                      <div className="h-3 bg-gray-200 rounded w-32"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="h-px bg-gray-200 my-4"></div>
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-10 bg-gray-200 rounded w-28"></div>
                </div>
              </div>
            ))
        ) : filteredOrders?.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              id={`order-${order?.id}`}
              key={order?.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-700 hover:shadow-md "
            >
              <div className="p-5">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  {/* Bên trái - Thông tin khách hàng */}
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500 text-sm">
                        Mã đơn hàng:
                      </span>
                      <span className="font-medium">#{order?.id}</span>
                    </div>
                    <div className="flex items-start gap-1">
                      <span className="text-gray-500 text-sm flex-shrink-0 whitespace-nowrap">
                        Khách hàng:
                      </span>
                      <span
                        className="font-medium break-words max-w-[500px] overflow-hidden text-ellipsis line-clamp-3"
                        title={order?.customerInfo}
                      >
                        {order?.customerInfo}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500 text-sm">Ngày đặt:</span>
                      <span>{formatDate(order?.orderDate)}</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {order.paymentMethod || "Đã Thanh Toán"} •{" "}
                      {order.paymentStatus || "Chưa thanh toán"}
                    </div>
                  </div>

                  {/* Bên phải - Trạng thái + Tổng tiền + Lý do + Các nút */}
                  <div className="flex flex-col items-end space-y-2">
                    {/* Trạng thái đơn hàng */}
                    <div
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-sm border ${
                        statusConfig[order?.orderStatusName]?.color ||
                        "bg-gray-100 text-gray-800 border-gray-200"
                      }`}
                    >
                      {statusConfig[order?.orderStatusName]?.icon || (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      <span className="font-medium">
                        {order.orderStatusName || "Không xác định"}
                      </span>
                    </div>
                    {/* Tổng tiền */}
                    <div className="flex items-center">
                      <span className="text-gray-600 mr-2 text-sm">
                        Tổng tiền:
                      </span>
                      <span className="text-lg font-bold text-emerald-600">
                        {formatCurrency(order?.totalPrice)}
                      </span>
                    </div>
                    {order.orderStatusName === "Hủy" && order?.noted && (
                      <div
                        className="text-sm text-red-600 text-right truncate cursor-pointer font-bold"
                        title={order?.noted}
                      >
                        Lý do hủy:{" "}
                        {order?.noted?.length > 70
                          ? order.noted.substring(0, 40) + "..."
                          : order.noted}
                      </div>
                    )}
                    {order.orderStatusName === "Đã duyệt" && order?.noted && (
                      <div className="text-sm text-green-600 text-right">
                        Thông báo: Đã thay đổi số lượng, vào chi tiết để xem.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => handleViewDetails(order.id)}
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-1.5"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Chi tiết</span>
                  </button>
                  {order.orderStatusName === "Chờ duyệt" && (
                    <>
                      <button
                        onClick={() => openCancelModal(order.id)}
                        className="px-4 py-2 bg-white border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center space-x-1.5"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Hủy đơn</span>
                      </button>
                    </>
                  )}
                  {order.orderStatusName === "Đã giao" && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 6)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1.5"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path
                          fillRule="evenodd"
                          d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Đã nhận</span>
                    </button>
                  )}
                  {order.orderStatusName === "Đã nhận" && (
                    <button
                      onClick={async () => {
                        try {
                          const response = await axiosInstance.get(
                            `/user/order/${order.id}`
                          );
                          const data = response.data.data;
                          const orderItems = data.orderItems;
                          const productsToBuyAgain = orderItems.map((item) => ({
                            id: item.productId,
                            productName: item?.productName,
                            productImage: item?.productImage,
                            priceProduct: formatCurrency(item?.priceProduct),
                            quantityProduct: item?.quantityProduct,
                            totalPriceProduct: formatCurrency(
                              item?.totalPriceProduct
                            ),
                            shopId: item?.shopId,
                            shopName: item?.shopName,
                          }));
                          navigate("/payment", {
                            state: {
                              selectedProducts: productsToBuyAgain,
                            },
                          });
                        } catch (error) {
                          showErrorToast("Đã xảy ra lỗi khi mua lại!!!");
                        }
                      }}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-1.5"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 2a1 1 0 011 1v1h8V3a1 1 0 112 0v1h1a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 011-1zm11 14a1 1 0 001-1V6a1 1 0 00-1-1H4a1 1 0 00-1 1v9a1 1 0 001 1h12z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Mua lại</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Không có đơn hàng nào
            </h3>
            <p className="text-gray-600 mb-6">
              Bạn chưa có đơn hàng nào trong mục này
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors inline-flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              Mua sắm ngay
            </button>
          </div>
        )}
      </div>

      {filteredTotal > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredTotal / pageSize)}
          setCurrentPage={handlePageChange}
        />
      )}
      {isLoading && <Loading />}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-4 0">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Hủy đơn hàng
            </h3>
            <p className="text-gray-600 mb-4">
              Bạn có chắc chắn muốn hủy đơn hàng này không?
            </p>
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="cancel-reason"
              >
                Lý do hủy <span className="text-red-500">*</span>
              </label>
              <textarea
                id="cancel-reason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Vui lòng nhập lý do hủy đơn hàng..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
                rows={3}
              ></textarea>
              {!cancelReason.trim() && (
                <p className="text-red-500 text-xs mt-1">
                  Lý do hủy không được để trống!
                </p>
              )}
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeCancelModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleCancelOrder}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                disabled={!cancelReason.trim()}
              >
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ordered;
