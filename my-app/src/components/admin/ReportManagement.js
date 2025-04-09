"use client"

import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { Link } from "react-router-dom"

// Dữ liệu mẫu cho báo cáo
const sampleReports = [
  {
    id: 1,
    type: "seller",
    reportedName: "Sách Giả Shop",
    reason: "Bán sách giả",
    reportDate: "2023-04-01T07:30:00",
    reportedBy: "user123@example.com",
    status: "pending",
    details: "Shop này bán sách giả, in lậu với chất lượng kém. Đã mua 3 cuốn và đều là hàng giả.",
  },
  {
    id: 2,
    type: "product",
    reportedName: "Sách lậu XYZ",
    reason: "Vi phạm bản quyền",
    reportDate: "2023-04-01T08:45:00",
    reportedBy: "user456@example.com",
    status: "pending",
    details: "Sách này là bản sao chép trái phép, không có giấy phép xuất bản và bản quyền.",
  },
  {
    id: 3,
    type: "user",
    reportedName: "user789",
    reason: "Spam bình luận",
    reportDate: "2023-04-01T10:15:00",
    reportedBy: "seller123@example.com",
    status: "pending",
    details: "Người dùng này liên tục đăng bình luận quảng cáo và spam trên nhiều sản phẩm.",
  },
  {
    id: 4,
    type: "seller",
    reportedName: "Shop ABC",
    reason: "Lừa đảo",
    reportDate: "2023-04-01T11:30:00",
    reportedBy: "user234@example.com",
    status: "pending",
    details: "Shop nhận tiền nhưng không giao hàng, sau đó chặn liên lạc với khách hàng.",
  },
  {
    id: 5,
    type: "product",
    reportedName: "Sách XYZ",
    reason: "Nội dung không phù hợp",
    reportDate: "2023-04-01T13:20:00",
    reportedBy: "user567@example.com",
    status: "pending",
    details: "Sách có nội dung không phù hợp với độ tuổi được quảng cáo, chứa hình ảnh và ngôn từ không phù hợp.",
  },
  {
    id: 6,
    type: "user",
    reportedName: "user321",
    reason: "Lạm dụng tính năng đánh giá",
    reportDate: "2023-04-02T09:10:00",
    reportedBy: "seller456@example.com",
    status: "resolved",
    details: "Người dùng này liên tục đánh giá 1 sao không có lý do chính đáng trên nhiều sản phẩm của shop.",
  },
  {
    id: 7,
    type: "seller",
    reportedName: "Shop DEF",
    reason: "Chất lượng sản phẩm kém",
    reportDate: "2023-04-02T10:45:00",
    reportedBy: "user678@example.com",
    status: "rejected",
    details: "Shop bán sách có chất lượng in ấn kém, không đúng với mô tả và hình ảnh quảng cáo.",
  },
  {
    id: 8,
    type: "product",
    reportedName: "Sách ABC",
    reason: "Giá bán quá cao",
    reportDate: "2023-04-02T14:30:00",
    reportedBy: "user789@example.com",
    status: "pending",
    details: "Sách này có giá bán cao hơn nhiều so với giá niêm yết và giá thị trường.",
  },
  {
    id: 9,
    type: "user",
    reportedName: "user654",
    reason: "Quấy rối người bán",
    reportDate: "2023-04-03T08:20:00",
    reportedBy: "seller789@example.com",
    status: "pending",
    details: "Người dùng này liên tục gửi tin nhắn quấy rối, đe dọa người bán sau khi mua hàng.",
  },
  {
    id: 10,
    type: "seller",
    reportedName: "Shop GHI",
    reason: "Gian lận khuyến mãi",
    reportDate: "2023-04-03T11:15:00",
    reportedBy: "user890@example.com",
    status: "pending",
    details: "Shop quảng cáo khuyến mãi giảm giá nhưng thực tế đã tăng giá gốc lên trước khi áp dụng giảm giá.",
  },
  {
    id: 11,
    type: "product",
    reportedName: "Sách DEF",
    reason: "Sản phẩm giả mạo",
    reportDate: "2023-04-03T13:40:00",
    reportedBy: "user901@example.com",
    status: "pending",
    details: "Sách này là bản sao chép, giả mạo tên tác giả và nhà xuất bản.",
  },
  {
    id: 12,
    type: "user",
    reportedName: "user432",
    reason: "Lừa đảo người bán",
    reportDate: "2023-04-04T09:30:00",
    reportedBy: "seller234@example.com",
    status: "pending",
    details: "Người dùng này đặt hàng COD với số lượng lớn nhưng không nhận hàng, gây thiệt hại cho người bán.",
  },
  {
    id: 13,
    type: "seller",
    reportedName: "Shop JKL",
    reason: "Vi phạm chính sách",
    reportDate: "2023-04-04T10:50:00",
    reportedBy: "user345@example.com",
    status: "resolved",
    details: "Shop vi phạm chính sách bán hàng, bán sách không có nguồn gốc rõ ràng.",
  },
  {
    id: 14,
    type: "product",
    reportedName: "Sách GHI",
    reason: "Mô tả sai sự thật",
    reportDate: "2023-04-04T14:15:00",
    reportedBy: "user456@example.com",
    status: "pending",
    details: "Sách được mô tả là bản cứng nhưng thực tế là bản mềm, chất lượng giấy kém.",
  },
  {
    id: 15,
    type: "user",
    reportedName: "user567",
    reason: "Hành vi không phù hợp",
    reportDate: "2023-04-05T08:40:00",
    reportedBy: "seller345@example.com",
    status: "rejected",
    details: "Người dùng có hành vi không phù hợp trong phần bình luận, sử dụng ngôn từ thô tục.",
  },
]

const ReportManagement = () => {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [reportsPerPage] = useState(10)
  const [filters, setFilters] = useState({
    type: "all",
    status: "all",
    search: "",
  })

  useEffect(() => {
    // Giả lập API call
    const fetchReports = async () => {
      try {
        // Trong thực tế, bạn sẽ gọi API ở đây
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setReports(sampleReports)
      } catch (error) {
        console.error("Error fetching reports:", error)
        toast.error("Không thể tải dữ liệu báo cáo")
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
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

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
    setCurrentPage(1) // Reset về trang đầu tiên khi thay đổi bộ lọc
  }

  // Lọc báo cáo dựa trên bộ lọc
  const filteredReports = reports.filter((report) => {
    const typeMatch = filters.type === "all" || report.type === filters.type
    const statusMatch = filters.status === "all" || report.status === filters.status
    const searchMatch =
      filters.search === "" ||
      report.reportedName.toLowerCase().includes(filters.search.toLowerCase()) ||
      report.reason.toLowerCase().includes(filters.search.toLowerCase())

    return typeMatch && statusMatch && searchMatch
  })

  // Phân trang
  const indexOfLastReport = currentPage * reportsPerPage
  const indexOfFirstReport = indexOfLastReport - reportsPerPage
  const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport)
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý báo cáo vi phạm</h1>

        <div className="mt-4 md:mt-0">
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200 flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại Dashboard
          </button>
        </div>
      </div>

      {/* Bộ lọc */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Loại báo cáo
            </label>
            <select
              id="type"
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tất cả loại</option>
              <option value="seller">Người bán</option>
              <option value="product">Sản phẩm</option>
              <option value="user">Người dùng</option>
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái
            </label>
            <select
              id="status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Đang chờ xử lý</option>
              <option value="resolved">Đã xử lý</option>
              <option value="rejected">Đã từ chối</option>
            </select>
          </div>

          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Tìm kiếm
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Tìm theo tên hoặc lý do..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 pl-10"
              />
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
            </div>
          </div>
        </div>
      </div>

      {/* Bảng báo cáo */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Loại
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Đối tượng
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Lý do
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Người báo cáo
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Ngày báo cáo
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Trạng thái
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentReports.length > 0 ? (
                currentReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{report.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          report.type === "seller"
                            ? "bg-blue-100 text-blue-800"
                            : report.type === "product"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {report.type === "seller" ? "Người bán" : report.type === "product" ? "Sản phẩm" : "Người dùng"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.reportedName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.reason.length > 30 ? `${report.reason.substring(0, 30)}...` : report.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.reportedBy}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(report.reportDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          report.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : report.status === "resolved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {report.status === "pending"
                          ? "Đang chờ"
                          : report.status === "resolved"
                            ? "Đã xử lý"
                            : "Đã từ chối"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/admin/report/${report.id}`} className="text-blue-600 hover:text-blue-900 mr-3">
                        Xử lý
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                    Không tìm thấy báo cáo nào phù hợp với bộ lọc
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        {filteredReports.length > 0 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Hiển thị <span className="font-medium">{indexOfFirstReport + 1}</span> đến{" "}
                  <span className="font-medium">
                    {indexOfLastReport > filteredReports.length ? filteredReports.length : indexOfLastReport}
                  </span>{" "}
                  trong <span className="font-medium">{filteredReports.length}</span> kết quả
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {[...Array(totalPages).keys()].map((number) => (
                    <button
                      key={number + 1}
                      onClick={() => paginate(number + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === number + 1
                          ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                          : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {number + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReportManagement

