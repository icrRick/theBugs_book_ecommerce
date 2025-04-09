"use client"

import { useCallback, useEffect, useState } from "react"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import axiosInstance from "../../utils/axiosInstance"
import { debounce } from 'lodash';
import Pagination from "../admin/Pagination"


const OrdersSeller = () => {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState(null)
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get("status") || "")
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [allOrders, setAllOrders] = useState([])
  const [totalOrders, setTotalOrders] = useState(0)
  const [tabCounts, setTabCounts] = useState({})
  const [filters, setFilters] = useState({
    userName: "",
    startDate: "",
    endDate: "",
  })
  const [cancelReason, setCancelReason] = useState("")
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [orderToCancel, setOrderToCancel] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [searchText, setSearchText] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10;

  const debouncedSearch = useCallback(
    debounce((userName, page) => {
      if (userName) {
        searchOrders(userName, page);
      } else {
        fetchAllOrders(page);
      }
    }, 500),
    []
  );


  

  const statusConfig = {
    "Chờ duyệt": {
      color: "bg-amber-100 text-amber-800 border-amber-200",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
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
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
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
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
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
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
        </svg>
      ),
    },
    "Đã nhận": {
      color: "bg-green-100 text-green-800 border-green-200",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path
            fillRule="evenodd"
            d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  }

  const tabs = [
    { id: "", label: "Tất cả" },
    { id: "1", label: "Chờ duyệt" },
    { id: "2", label: "Đã hủy" },
    { id: "3", label: "Đã duyệt" },
    { id: "4", label: "Đã giao" },
    { id: "5", label: "Đã nhận" },
  ]

  const getStatusIdFromName = (statusName) => {
    switch (statusName) {
      case "Chờ duyệt":
        return 1
      case "Hủy":
        return 2
      case "Đã duyệt":
        return 3
      case "Đã giao":
        return 4
      case "Đã nhận":
        return 5
      default:
        return 0
    }
  }

  const getStatusNameFromId = (statusId) => {
    switch (statusId) {
      case "1":
        return "Chờ duyệt"
      case "2":
        return "Đã hủy"
      case "3":
        return "Đã duyệt"
      case "4":
        return "Đang giao"
      case "5":
        return "Đã nhận"
      default:
        return ""
    }
  }

  // Modified to always use allOrders for calculating tab counts
  const calculateTabCounts = (ordersList) => {
    const counts = {}
    tabs.forEach((tab) => {
      if (tab.id === "") {
        counts[tab.id] = ordersList.length
      } else {
        counts[tab.id] = ordersList.filter(
          (order) => getStatusIdFromName(order.orderStatusName) === Number.parseInt(tab.id),
        ).length
      }
    })
    return counts
  }

  const showSuccessToast = (message) => {
    setSuccessMessage(message)
    setTimeout(() => {
      setSuccessMessage(null)
    }, 3000)
  }

  const fetchAllOrders = async (page = 1) => {
    setIsLoading(true)
    setErrorMessage(null)
    try {
      const response = await axiosInstance.get("/seller/order/all", {
        params: {
          page: page,
          size: pageSize,
        },
      })
      const { data, message } = response.data
      if (response.status === 200) {
        const ordersList = data.objects || []
        setAllOrders(ordersList)
        setOrders(ordersList)
        setTotalOrders(data.totalItems || 0)

        // Always calculate tab counts based on all orders
        setTabCounts(calculateTabCounts(ordersList))
      } else {
        console.error("Không thể tải đơn hàng:", message)
        setErrorMessage(message || "Không thể tải danh sách đơn hàng.")
        setAllOrders([])
        setOrders([])
        setTabCounts({})
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      setAllOrders([])
      setOrders([])
      setTabCounts({})
    } finally {
      setIsLoading(false)
    }
  }

  

  const searchOrders = async (userName ,page = 1) => {
    setIsLoading(true)
    try {
      console.log("Search params:", {
        customerInfo: filters.userName || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        statusOrder: activeTab || undefined,
      })
      const response = await axiosInstance.get("/seller/order/search", {
        params: {
          userName: userName || undefined,
          startDate: filters.startDate || undefined,
          endDate: filters.endDate || undefined,
          statusOrder: activeTab || undefined,
          page: page,
          size: pageSize,
        },
      })
      const { data, message } = response.data
      console.log("Search response:", response.data)
      if (response.status === 200) {
        const ordersList = data.objects || []
        setOrders(ordersList)
        setTotalOrders(data.totalItems || 0)

        // Don't update tabCounts here - keep using the counts from all orders
      } else {
        console.error("Failed to search orders:", message)
        setOrders([])
      }
    } catch (error) {
      console.error("Error searching orders:", error)
      setOrders([])
    } finally {
      setIsLoading(false)
    }
  }



  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    setCurrentPage(1);
    debouncedSearch(value, 1);
  };
  useEffect(() => {
    debouncedSearch(searchText, currentPage);
  }, [currentPage, searchText, debouncedSearch]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axiosInstance.put(`/seller/order/update/${orderId}`, {
        orderStatus: newStatus,
        cancelReason: newStatus === 2 ? "Lý do hủy mặc định" : "",
      })
      const { message } = response.data
      const status = response.data.status
      if (status) {
        const statusName = getStatusNameFromId(newStatus.toString())
        showSuccessToast(`Trạng thái đơn hàng đã được cập nhật thành ${statusName}!`)
        fetchAllOrders() // This will update both orders and allOrders
      } else {
        alert(`Cập nhật trạng thái thất bại: ${message}`)
      }
    } catch (error) {
      console.error("Error updating order status:", error)
      alert("Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng!")
    }
  }

  const openCancelModal = (orderId) => {
    setOrderToCancel(orderId)
    setShowCancelModal(true)
    setCancelReason("")
  }

  const closeCancelModal = () => {
    setShowCancelModal(false)
    setOrderToCancel(null)
    setCancelReason("")
  }

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      alert("Lý do hủy không được để trống!")
      return
    }
    try {
      const response = await axiosInstance.put(`/seller/order/update/${orderToCancel}`, {
        orderStatus: 2,
        cancelReason: cancelReason,
      })
      const { message } = response.data
      const { status } = response.data
      if (status) {
        showSuccessToast("Đơn hàng đã được hủy thành công!")
        closeCancelModal()
        fetchAllOrders() // This will update both orders and allOrders
      } else {
        alert(`Hủy đơn hàng thất bại: ${message}`)
      }
    } catch (error) {
      console.error("Error cancelling order:", error)
      alert("Đã xảy ra lỗi khi hủy đơn hàng!")
    }
  }

  const handleTabClick = (tabId) => {
    setIsTransitioning(true)
    setActiveTab(tabId)
    if (tabId) {
      setSearchParams({ status: tabId })
    } else {
      setSearchParams({})
    }
    setTimeout(() => {
      setIsTransitioning(false)
    }, 300)
  }

  const handleFilterChange = (e) => {
    const { id, value } = e.target
    let fieldName
    if (id === "name-filter") {
      fieldName = "userName"
    } else if (id === "start-date") {
      fieldName = "startDate"
    } else if (id === "end-date") {
      fieldName = "endDate"
    }
    console.log(`Changing ${fieldName} to ${value}`)
    setFilters((prev) => ({
      ...prev,
      [fieldName]: value,
    }))
  }

  const handleFilterSubmit = (e) => {
    e.preventDefault()
    searchOrders()
  }

  const handleViewDetails = (orderId) => {
    navigate(`/seller/order/${orderId}`)
  }

  useEffect(() => {
    if(searchText){
      searchOrders(searchText, currentPage)
    }else{
      fetchAllOrders(currentPage)
    }
   
  }, [currentPage]) // Only fetch all orders once on component mount

  

  useEffect(() => {
    if (activeTab) {
      searchOrders(currentPage)
    } else {
      // If no active tab (All tab), use all orders
      setOrders(allOrders)
    }
  }, [activeTab, currentPage])

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric" }
    return new Date(dateString).toLocaleDateString("vi-VN", options)
  }

  // Use filtered orders for display, but not for tab counts
  const filteredOrders = activeTab
    ? orders.filter((order) => getStatusIdFromName(order.orderStatusName) === Number.parseInt(activeTab))
    : orders

  return (
    <div className="w-full mx-auto">
      {/* Thông báo thành công */}
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50 shadow-md flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>{successMessage}</span>
        </div>
      )}

      <h2 className="text-xl font-bold text-gray-800 my-6">Danh sách đơn hàng</h2>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Bộ lọc đơn hàng</h2>
        <form onSubmit={handleFilterSubmit} className="grid grid-cols-12 gap-4">
          <div className="col-span-7 space-y-2">
            <label className="block text-sm font-medium text-gray-700" htmlFor="name-filter">
              Tên khách hàng
            </label>
            <input
              type="text"
              id="name-filter"
              placeholder="Nhập tên khách hàng, số điện thoại, địa chỉ"
              value={searchText}
              onChange={handleSearchChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
            />
          </div>

          <div className="col-span-2 space-y-2">
            <label className="block text-sm font-medium text-gray-700" htmlFor="start-date">
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
            <label className="block text-sm font-medium text-gray-700" htmlFor="end-date">
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
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Tabs */}
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
              {tab.id === "" && (
                <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-gray-100">{tabCounts[tab.id] || 0}</span>
              )}
              {tab.id !== "" && (
                <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-gray-100">{tabCounts[tab.id] || 0}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className={`space-y-6 transition-opacity duration-300 ${isTransitioning ? "opacity-0" : "opacity-100"}`}>
        {isLoading ? (
          Array(3)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
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
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
            >
              <div className="p-5">
                <div className="flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-gray-500 text-sm">Mã đơn hàng:</span>
                      <span className="font-medium">#{order.id}</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-gray-500 text-sm">Khách hàng:</span>
                      <span className="font-medium">{order.customerInfo}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500 text-sm">Ngày đặt:</span>
                      <span>{formatDate(order.orderDate)}</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {order.paymentMethod || "Đã Thanh Toán"} • {order.paymentStatus || "Chưa thanh toán"}
                    </div>
                    {order.orderStatusName === "Đã hủy" && order.cancelReason && (
                      <div className="text-sm text-red-600 mt-1">Lý do hủy: {order.cancelReason}</div>
                    )}
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <div
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-sm border ${
                        statusConfig[order.orderStatusName]?.color || "bg-gray-100 text-gray-800 border-gray-200"
                      }`}
                    >
                      {statusConfig[order.orderStatusName]?.icon || (
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
                      <span className="font-medium">{order.orderStatusName || "Không xác định"}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 mr-2">Tổng tiền:</span>
                      <span className="text-lg font-bold text-emerald-600">
                        {order.totalPrice?.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => handleViewDetails(order.id)}
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-1.5"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
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
                        onClick={() => updateOrderStatus(order.id, 3)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1.5"
                      >
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
                        <span>Duyệt đơn</span>
                      </button>
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
                  {order.orderStatusName === "Đã duyệt" && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 4)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-1.5"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                      </svg>
                      <span>Đang giao</span>
                    </button>
                  )}
                  {order.orderStatusName === "Đang giao" && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 5)}
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
                    <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-1.5">
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
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Không có đơn hàng nào</h3>
            <p className="text-gray-600 mb-6">Bạn chưa có đơn hàng nào trong mục này</p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors inline-flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              Mua sắm ngay
            </button>
          </div>
        )}
        {
          totalOrders > 0 && (
            <Pagination
            currentPage={currentPage}
            totalPages = {Math.ceil(totalOrders / pageSize)}
            setCurrentPage={setCurrentPage}
            />
          )
        }
      </div>

      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Hủy đơn hàng</h3>
            <p className="text-gray-600 mb-4">Bạn có chắc chắn muốn hủy đơn hàng này không?</p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="cancel-reason">
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
              {!cancelReason.trim() && <p className="text-red-500 text-xs mt-1">Lý do hủy không được để trống!</p>}
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
  )
}

export default OrdersSeller

