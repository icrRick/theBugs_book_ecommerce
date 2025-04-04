"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation, useSearchParams } from "react-router-dom"

const Ordered = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get("status") || "")
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Status definitions with colors and icons
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
    { id: "4", label: "Đang giao" },
    { id: "5", label: "Đã nhận" },
  ]

  const orders = {
    1: [
      {
        id: 1,
        date: "2024-03-20",
        total: "1.500.000đ",
        customerInfo: "Nguyễn Văn A, 0909090909, Hà Nội",
        paymentMethod: "Thanh toán tiền mặt",
        paymentStatus: "Đã thanh toán",
        status: "Chờ duyệt",
        items: [
          {
            name: "Đắc Nhân Tâm",
            quantity: 1,
            price: "120.000đ",
            image: "https://placehold.co/100x100/2ecc71/ffffff?text=S%C3%A1ch+1",
          },
          {
            name: "Nhà Giả Kim",
            quantity: 2,
            price: "95.000đ",
            image: "https://placehold.co/100x100/3498db/ffffff?text=S%C3%A1ch+2",
          },
        ],
      },
    ],
    3: [
      {
        id: 2,
        date: "2024-03-19",
        total: "2.000.000đ",
        customerInfo: "Trần Thị B, 0808080808, TP.HCM",
        paymentMethod: "Chuyển khoản",
        paymentStatus: "Đã thanh toán",
        status: "Đã duyệt",
        items: [
          {
            name: "Sapiens: Lược Sử Loài Người",
            quantity: 1,
            price: "189.000đ",
            image: "https://placehold.co/100x100/9b59b6/ffffff?text=S%C3%A1ch+3",
          },
        ],
      },
    ],
    4: [
      {
        id: 3,
        date: "2024-03-18",
        total: "3.500.000đ",
        customerInfo: "Lê Văn C, 0707070707, Đà Nẵng",
        paymentMethod: "Thanh toán tiền mặt",
        paymentStatus: "Chưa thanh toán",
        status: "Đang giao",
        items: [
          {
            name: "Tôi Thấy Hoa Vàng Trên Cỏ Xanh",
            quantity: 1,
            price: "68.000đ",
            image: "https://placehold.co/100x100/e74c3c/ffffff?text=S%C3%A1ch+4",
          },
          {
            name: "Tuổi Trẻ Đáng Giá Bao Nhiêu",
            quantity: 1,
            price: "76.000đ",
            image: "https://placehold.co/100x100/f1c40f/ffffff?text=S%C3%A1ch+5",
          },
        ],
      },
    ],
    5: [
      {
        id: 4,
        date: "2024-03-17",
        total: "1.000.000đ",
        customerInfo: "Phạm Thị D, 0606060606, Huế",
        paymentMethod: "Chuyển khoản",
        paymentStatus: "Đã thanh toán",
        status: "Đã nhận",
        items: [
          {
            name: "Đắc Nhân Tâm",
            quantity: 1,
            price: "120.000đ",
            image: "https://placehold.co/100x100/2ecc71/ffffff?text=S%C3%A1ch+1",
          },
        ],
      },
    ],
    2: [
      {
        id: 5,
        date: "2024-03-16",
        total: "2.500.000đ",
        customerInfo: "Hoàng Văn E, 0505050505, Hải Phòng",
        paymentMethod: "Thanh toán tiền mặt",
        paymentStatus: "Đã hoàn tiền",
        status: "Đã hủy",
        cancelReason: "Đặt nhầm sản phẩm",
        items: [
          {
            name: "Nhà Giả Kim",
            quantity: 2,
            price: "95.000đ",
            image: "https://placehold.co/100x100/3498db/ffffff?text=S%C3%A1ch+2",
          },
        ],
      },
    ],
  }

  // Simulate loading data
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [activeTab])

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

  const handleCancelOrder = (orderId) => {
    // Show confirmation dialog
    if (window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) {
      console.log("Hủy đơn hàng:", orderId)
      // In a real app, you would call an API here
      alert("Đơn hàng đã được hủy thành công")
    }
  }

  const handleViewDetails = (orderId) => {
    navigate(`/order/${orderId}`)
  }

  const getAllOrders = () => {
    return Object.values(orders).flat()
  }

  // Format date to a more readable format
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric" }
    return new Date(dateString).toLocaleDateString("vi-VN", options)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Đơn hàng của tôi</h2>
        <div className="text-sm text-gray-500">
          Tổng số đơn hàng: <span className="font-semibold">{getAllOrders().length}</span>
        </div>
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
                <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-gray-100">{getAllOrders().length}</span>
              )}
              {tab.id !== "" && orders[tab.id] && (
                <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-gray-100">{orders[tab.id].length}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className={`space-y-6 transition-opacity duration-300 ${isTransitioning ? "opacity-0" : "opacity-100"}`}>
        {isLoading ? (
          // Loading skeleton
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
        ) : (activeTab ? orders[activeTab] : getAllOrders()).length > 0 ? (
          (activeTab ? orders[activeTab] : getAllOrders()).map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
            >
              {/* Order header */}
              <div className="p-5">
                <div className="flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-gray-500 text-sm">Mã đơn hàng:</span>
                      <span className="font-medium">#{order.id}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500 text-sm">Ngày đặt:</span>
                      <span>{formatDate(order.date)}</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {order.paymentMethod} • {order.paymentStatus}
                    </div>

                    {order.status === "Đã hủy" && order.cancelReason && (
                      <div className="text-sm text-red-600 mt-1">Lý do hủy: {order.cancelReason}</div>
                    )}
                  </div>

                  <div className="flex flex-col items-end space-y-2">
                    <div
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-sm border ${statusConfig[order.status].color}`}
                    >
                      {statusConfig[order.status].icon}
                      <span className="font-medium">{order.status}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 mr-2">Tổng tiền:</span>
                      <span className="text-lg font-bold text-emerald-600">{order.total}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order footer */}
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

                  {order.status === "Chờ duyệt" && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
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
                  )}

                  {order.status === "Đã nhận" && (
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
          // Empty state
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
      </div>
    </div>
  )
}

export default Ordered

