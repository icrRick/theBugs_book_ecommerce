"use client"

import { useState, useEffect } from "react"
import { toast } from "react-toastify"

// Dữ liệu mẫu cho quản lý người bán
const sampleSellers = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0901234567",
    shopName: "Sách Hay Online",
    businessType: "Cá nhân",
    taxCode: "0123456789",
    address: "Quận 1, TP. Hồ Chí Minh",
    joinDate: "2023-01-15T08:30:00",
    status: "active",
    totalProducts: 156,
    totalOrders: 1245,
    totalRevenue: 123456000,
    rating: 4.8,
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "tranthib@example.com",
    phone: "0912345678",
    shopName: "Tri Thức Việt",
    businessType: "Doanh nghiệp",
    taxCode: "0987654321",
    address: "Quận Cầu Giấy, Hà Nội",
    joinDate: "2023-02-10T09:15:00",
    status: "active",
    totalProducts: 89,
    totalOrders: 876,
    totalRevenue: 98765000,
    rating: 4.5,
  },
  {
    id: 3,
    name: "Lê Văn C",
    email: "levanc@example.com",
    phone: "0978123456",
    shopName: "Sách Xưa Shop",
    businessType: "Cá nhân",
    taxCode: "",
    address: "Quận Hải Châu, Đà Nẵng",
    joinDate: "2023-02-25T10:20:00",
    status: "suspended",
    totalProducts: 45,
    totalOrders: 320,
    totalRevenue: 45678000,
    rating: 3.9,
  },
  {
    id: 4,
    name: "Phạm Thị D",
    email: "phamthid@example.com",
    phone: "0965432109",
    shopName: "Sách Giáo Khoa 24h",
    businessType: "Doanh nghiệp",
    taxCode: "1234509876",
    address: "Quận 7, TP. Hồ Chí Minh",
    joinDate: "2023-03-05T11:05:00",
    status: "active",
    totalProducts: 210,
    totalOrders: 1567,
    totalRevenue: 234567000,
    rating: 4.7,
  },
  {
    id: 5,
    name: "Hoàng Văn E",
    email: "hoangvane@example.com",
    phone: "0932109876",
    shopName: "Sách Ngoại Văn",
    businessType: "Cá nhân",
    taxCode: "",
    address: "Quận 3, TP. Hồ Chí Minh",
    joinDate: "2023-03-20T13:45:00",
    status: "active",
    totalProducts: 78,
    totalOrders: 654,
    totalRevenue: 76543000,
    rating: 4.6,
  },
]

const SellerManagement = () => {
  const [sellers, setSellers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSeller, setSelectedSeller] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false)
  const [suspendReason, setSuspendReason] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  useEffect(() => {
    // Giả lập API call
    const fetchSellers = async () => {
      try {
        // Trong thực tế, bạn sẽ gọi API ở đây
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setSellers(sampleSellers)
      } catch (error) {
        console.error("Error fetching sellers:", error)
        toast.error("Không thể tải dữ liệu. Vui lòng thử lại sau.")
      } finally {
        setLoading(false)
      }
    }

    fetchSellers()
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value)
    setCurrentPage(1)
  }

  const handleViewDetail = (seller) => {
    setSelectedSeller(seller)
    setIsDetailModalOpen(true)
  }

  const handleSuspend = (seller) => {
    setSelectedSeller(seller)
    setIsSuspendModalOpen(true)
  }

  const handleActivate = async (id) => {
    try {
      setLoading(true)
      // Giả lập API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Cập nhật trạng thái trong state
      const updatedSellers = sellers.map((seller) => (seller.id === id ? { ...seller, status: "active" } : seller))
      setSellers(updatedSellers)

      toast.success("Đã kích hoạt người bán thành công!")
      setIsDetailModalOpen(false)
    } catch (error) {
      console.error("Error activating seller:", error)
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.")
    } finally {
      setLoading(false)
    }
  }

  const confirmSuspend = async () => {
    if (!suspendReason.trim()) {
      toast.error("Vui lòng nhập lý do đình chỉ.")
      return
    }

    try {
      setLoading(true)
      // Giả lập API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Cập nhật trạng thái trong state
      const updatedSellers = sellers.map((seller) =>
        seller.id === selectedSeller.id ? { ...seller, status: "suspended", suspendReason } : seller,
      )
      setSellers(updatedSellers)

      toast.success("Đã đình chỉ người bán thành công!")
      setIsSuspendModalOpen(false)
      setIsDetailModalOpen(false)
      setSuspendReason("")
    } catch (error) {
      console.error("Error suspending seller:", error)
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.")
    } finally {
      setLoading(false)
    }
  }

  // Lọc người bán theo tìm kiếm và trạng thái
  const filteredSellers = sellers.filter((seller) => {
    const matchesSearch =
      seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.shopName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || seller.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Phân trang
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredSellers.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredSellers.length / itemsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  // Modal chi tiết người bán
  const renderDetailModal = () => {
    if (!isDetailModalOpen || !selectedSeller) return null

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
            <h3 className="text-lg font-semibold text-gray-800">Chi tiết người bán</h3>
            <button className="text-gray-400 hover:text-gray-600" onClick={() => setIsDetailModalOpen(false)}>
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="text-md font-semibold text-gray-700 mb-4">Thông tin người bán</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Họ tên</p>
                    <p className="font-medium">{selectedSeller.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{selectedSeller.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Số điện thoại</p>
                    <p className="font-medium">{selectedSeller.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ngày tham gia</p>
                    <p className="font-medium">{formatDate(selectedSeller.joinDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Trạng thái</p>
                    <p
                      className={`font-medium ${
                        selectedSeller.status === "active" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {selectedSeller.status === "active" ? "Đang hoạt động" : "Đã đình chỉ"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-md font-semibold text-gray-700 mb-4">Thông tin cửa hàng</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Tên cửa hàng</p>
                    <p className="font-medium">{selectedSeller.shopName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Loại hình kinh doanh</p>
                    <p className="font-medium">{selectedSeller.businessType}</p>
                  </div>
                  {selectedSeller.taxCode && (
                    <div>
                      <p className="text-sm text-gray-500">Mã số thuế</p>
                      <p className="font-medium">{selectedSeller.taxCode}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500">Địa chỉ</p>
                    <p className="font-medium">{selectedSeller.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Đánh giá</p>
                    <div className="flex items-center">
                      <span className="font-medium mr-1">{selectedSeller.rating}</span>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(selectedSeller.rating) ? "text-yellow-400" : "text-gray-300"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600 mb-1">Tổng số sản phẩm</p>
                <p className="text-2xl font-bold text-blue-800">{selectedSeller.totalProducts}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600 mb-1">Tổng số đơn hàng</p>
                <p className="text-2xl font-bold text-green-800">{selectedSeller.totalOrders}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-600 mb-1">Tổng doanh thu</p>
                <p className="text-2xl font-bold text-purple-800">{formatCurrency(selectedSeller.totalRevenue)}</p>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-700 mb-4">Hành động</h4>
              <div className="flex space-x-4">
                <a
                  href={`/admin/sellers/${selectedSeller.id}/products`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  Xem sản phẩm
                </a>
                <a
                  href={`/admin/sellers/${selectedSeller.id}/orders`}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                >
                  Xem đơn hàng
                </a>
                <a
                  href={`/admin/sellers/${selectedSeller.id}/reports`}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors duration-200"
                >
                  Xem báo cáo
                </a>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex justify-end sticky bottom-0 bg-white">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200 mr-2"
              onClick={() => setIsDetailModalOpen(false)}
            >
              Đóng
            </button>
            {selectedSeller.status === "active" ? (
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
                onClick={() => {
                  setIsDetailModalOpen(false)
                  handleSuspend(selectedSeller)
                }}
              >
                Đình chỉ
              </button>
            ) : (
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                onClick={() => handleActivate(selectedSeller.id)}
              >
                Kích hoạt lại
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Modal đình chỉ người bán
  const renderSuspendModal = () => {
    if (!isSuspendModalOpen || !selectedSeller) return null

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Đình chỉ người bán</h3>
          </div>

          <div className="p-6">
            <p className="text-gray-700 mb-4">
              Bạn đang đình chỉ người bán <span className="font-medium">{selectedSeller.name}</span> (
              {selectedSeller.shopName}).
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lý do đình chỉ</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                placeholder="Nhập lý do đình chỉ người bán..."
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
              ></textarea>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200 mr-2"
              onClick={() => setIsSuspendModalOpen(false)}
            >
              Hủy
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
              onClick={confirmSuspend}
            >
              Xác nhận đình chỉ
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Quản lý người bán</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div className="w-full md:w-64">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tìm kiếm người bán..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>

            <div className="w-full md:w-48">
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={statusFilter}
                onChange={handleStatusFilterChange}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang hoạt động</option>
                <option value="suspended">Đã đình chỉ</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <svg
                className="animate-spin h-8 w-8 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Người bán
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên cửa hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tham gia
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sản phẩm
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đánh giá
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentItems.length > 0 ? (
                  currentItems.map((seller) => (
                    <tr key={seller.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-800">{seller.name}</div>
                            <div className="text-sm text-gray-500">{seller.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{seller.shopName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(seller.joinDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">{seller.totalProducts}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <div className="flex items-center justify-center">
                          <span className="font-medium mr-1">{seller.rating}</span>
                          <svg
                            className="h-4 w-4 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            seller.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {seller.status === "active" ? "Hoạt động" : "Đình chỉ"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        <button
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          onClick={() => handleViewDetail(seller)}
                        >
                          Chi tiết
                        </button>
                        {seller.status === "active" ? (
                          <button className="text-red-600 hover:text-red-900" onClick={() => handleSuspend(seller)}>
                            Đình chỉ
                          </button>
                        ) : (
                          <button
                            className="text-green-600 hover:text-green-900"
                            onClick={() => handleActivate(seller.id)}
                          >
                            Kích hoạt
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                      Không tìm thấy người bán nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Phân trang */}
        {filteredSellers.length > itemsPerPage && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Hiển thị {indexOfFirstItem + 1} đến {Math.min(indexOfLastItem, filteredSellers.length)} trong số{" "}
                {filteredSellers.length} người bán
              </div>
              <div className="flex space-x-1">
                <button
                  className={`px-3 py-1 rounded ${currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                  <button
                    key={number}
                    className={`px-3 py-1 rounded ${currentPage === number ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                    onClick={() => paginate(number)}
                  >
                    {number}
                  </button>
                ))}
                <button
                  className={`px-3 py-1 rounded ${currentPage === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Sau
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {renderDetailModal()}
      {renderSuspendModal()}
    </div>
  )
}

export default SellerManagement

