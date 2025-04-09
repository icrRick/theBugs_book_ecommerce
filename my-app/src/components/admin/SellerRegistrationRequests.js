"use client"

import { useState, useEffect } from "react"
import { toast } from "react-toastify"

// Dữ liệu mẫu cho yêu cầu đăng ký người bán
const sampleSellerRequests = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0901234567",
    shopName: "Sách Hay Online",
    businessType: "Cá nhân",
    taxCode: "0123456789",
    address: "Quận 1, TP. Hồ Chí Minh",
    mainCategories: ["Sách giáo khoa", "Sách tham khảo"],
    requestDate: "2023-04-01T08:30:00",
    status: "pending",
    documents: [
      { name: "CCCD", url: "#" },
      { name: "Giấy phép kinh doanh", url: "#" },
    ],
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
    mainCategories: ["Sách văn học", "Sách ngoại ngữ", "Truyện tranh"],
    requestDate: "2023-04-01T09:15:00",
    status: "pending",
    documents: [
      { name: "CCCD", url: "#" },
      { name: "Giấy phép kinh doanh", url: "#" },
    ],
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
    mainCategories: ["Sách cũ/hiếm", "Sách lịch sử"],
    requestDate: "2023-04-01T10:20:00",
    status: "pending",
    documents: [{ name: "CCCD", url: "#" }],
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
    mainCategories: ["Sách giáo khoa", "Sách tham khảo", "Văn phòng phẩm"],
    requestDate: "2023-04-01T11:05:00",
    status: "pending",
    documents: [
      { name: "CCCD", url: "#" },
      { name: "Giấy phép kinh doanh", url: "#" },
    ],
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
    mainCategories: ["Sách ngoại ngữ", "Từ điển"],
    requestDate: "2023-04-01T13:45:00",
    status: "pending",
    documents: [{ name: "CCCD", url: "#" }],
  },
]

const SellerRegistrationRequests = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  useEffect(() => {
    // Giả lập API call
    const fetchRequests = async () => {
      try {
        // Trong thực tế, bạn sẽ gọi API ở đây
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setRequests(sampleSellerRequests)
      } catch (error) {
        console.error("Error fetching seller requests:", error)
        toast.error("Không thể tải dữ liệu. Vui lòng thử lại sau.")
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value)
    setCurrentPage(1)
  }

  const handleViewDetail = (request) => {
    setSelectedRequest(request)
    setIsDetailModalOpen(true)
  }

  const handleApprove = async (id) => {
    try {
      setLoading(true)
      // Giả lập API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Cập nhật trạng thái trong state
      const updatedRequests = requests.map((request) =>
        request.id === id ? { ...request, status: "approved" } : request,
      )
      setRequests(updatedRequests)

      toast.success("Đã duyệt yêu cầu đăng ký người bán thành công!")
      setIsDetailModalOpen(false)
    } catch (error) {
      console.error("Error approving seller request:", error)
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.")
    } finally {
      setLoading(false)
    }
  }

  const handleReject = (id) => {
    setSelectedRequest(requests.find((request) => request.id === id))
    setIsRejectModalOpen(true)
  }

  const confirmReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Vui lòng nhập lý do từ chối.")
      return
    }

    try {
      setLoading(true)
      // Giả lập API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Cập nhật trạng thái trong state
      const updatedRequests = requests.map((request) =>
        request.id === selectedRequest.id ? { ...request, status: "rejected", rejectReason } : request,
      )
      setRequests(updatedRequests)

      toast.success("Đã từ chối yêu cầu đăng ký người bán!")
      setIsRejectModalOpen(false)
      setIsDetailModalOpen(false)
      setRejectReason("")
    } catch (error) {
      console.error("Error rejecting seller request:", error)
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.")
    } finally {
      setLoading(false)
    }
  }

  // Lọc yêu cầu theo tìm kiếm và trạng thái
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.shopName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || request.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Phân trang
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  // Modal chi tiết yêu cầu
  const renderDetailModal = () => {
    if (!isDetailModalOpen || !selectedRequest) return null

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
            <h3 className="text-lg font-semibold text-gray-800">Chi tiết yêu cầu đăng ký người bán</h3>
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
                    <p className="font-medium">{selectedRequest.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{selectedRequest.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Số điện thoại</p>
                    <p className="font-medium">{selectedRequest.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ngày đăng ký</p>
                    <p className="font-medium">{formatDate(selectedRequest.requestDate)}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-md font-semibold text-gray-700 mb-4">Thông tin cửa hàng</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Tên cửa hàng</p>
                    <p className="font-medium">{selectedRequest.shopName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Loại hình kinh doanh</p>
                    <p className="font-medium">{selectedRequest.businessType}</p>
                  </div>
                  {selectedRequest.taxCode && (
                    <div>
                      <p className="text-sm text-gray-500">Mã số thuế</p>
                      <p className="font-medium">{selectedRequest.taxCode}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500">Địa chỉ</p>
                    <p className="font-medium">{selectedRequest.address}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-700 mb-4">Danh mục kinh doanh</h4>
              <div className="flex flex-wrap gap-2">
                {selectedRequest.mainCategories.map((category, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {category}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-700 mb-4">Tài liệu đính kèm</h4>
              <div className="space-y-2">
                {selectedRequest.documents.map((doc, index) => (
                  <div key={index} className="flex items-center">
                    <svg
                      className="h-5 w-5 text-gray-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <a
                      href={doc.url}
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {doc.name}
                    </a>
                  </div>
                ))}
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
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 mr-2"
              onClick={() => {
                setIsDetailModalOpen(false)
                handleReject(selectedRequest.id)
              }}
              disabled={selectedRequest.status !== "pending"}
            >
              Từ chối
            </button>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
              onClick={() => handleApprove(selectedRequest.id)}
              disabled={selectedRequest.status !== "pending"}
            >
              Duyệt
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Modal từ chối yêu cầu
  const renderRejectModal = () => {
    if (!isRejectModalOpen || !selectedRequest) return null

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Từ chối yêu cầu đăng ký</h3>
          </div>

          <div className="p-6">
            <p className="text-gray-700 mb-4">
              Bạn đang từ chối yêu cầu đăng ký người bán của <span className="font-medium">{selectedRequest.name}</span>{" "}
              ({selectedRequest.shopName}).
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lý do từ chối</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                placeholder="Nhập lý do từ chối yêu cầu đăng ký..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              ></textarea>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200 mr-2"
              onClick={() => setIsRejectModalOpen(false)}
            >
              Hủy
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
              onClick={confirmReject}
            >
              Xác nhận từ chối
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Duyệt đăng ký người bán</h1>

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
                  placeholder="Tìm kiếm yêu cầu..."
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
                <option value="pending">Chờ duyệt</option>
                <option value="approved">Đã duyệt</option>
                <option value="rejected">Đã từ chối</option>
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
                    Người đăng ký
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên cửa hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loại hình
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày đăng ký
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
                  currentItems.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-800">{request.name}</div>
                            <div className="text-sm text-gray-500">{request.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{request.shopName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{request.businessType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(request.requestDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            request.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : request.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {request.status === "pending"
                            ? "Chờ duyệt"
                            : request.status === "approved"
                              ? "Đã duyệt"
                              : "Đã từ chối"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        <button
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          onClick={() => handleViewDetail(request)}
                        >
                          Chi tiết
                        </button>
                        {request.status === "pending" && (
                          <>
                            <button
                              className="text-green-600 hover:text-green-900 mr-3"
                              onClick={() => handleApprove(request.id)}
                            >
                              Duyệt
                            </button>
                            <button
                              className="text-red-600 hover:text-red-900"
                              onClick={() => handleReject(request.id)}
                            >
                              Từ chối
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                      Không tìm thấy yêu cầu đăng ký nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Phân trang */}
        {filteredRequests.length > itemsPerPage && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Hiển thị {indexOfFirstItem + 1} đến {Math.min(indexOfLastItem, filteredRequests.length)} trong số{" "}
                {filteredRequests.length} yêu cầu
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
      {renderRejectModal()}
    </div>
  )
}

export default SellerRegistrationRequests

