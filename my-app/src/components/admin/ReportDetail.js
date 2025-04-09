"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

// Dữ liệu mẫu cho báo cáo chi tiết
const sampleReportDetails = {
  id: 5,
  type: "product",
  reportedName: "Sách XYZ",
  reportedId: 123,
  reason: "Nội dung không phù hợp",
  reportDate: "2023-04-01T13:20:00",
  reportedBy: "user567@example.com",
  reporterName: "Nguyễn Văn A",
  status: "pending",
  details:
    "Sách có nội dung không phù hợp với độ tuổi được quảng cáo, chứa hình ảnh và ngôn từ không phù hợp với lứa tuổi thiếu nhi. Trang 45-50 có nội dung bạo lực và trang 78 có hình ảnh không phù hợp.",
  images: ["https://example.com/evidence1.jpg", "https://example.com/evidence2.jpg"],
  reportedItemDetails: {
    // Chi tiết về sản phẩm/người bán/người dùng bị báo cáo
    name: "Sách XYZ - Phiêu Lưu Kỳ Thú",
    description: "Sách dành cho trẻ em từ 6-10 tuổi, kể về cuộc phiêu lưu của nhân vật chính trong thế giới kỳ ảo.",
    price: 150000,
    seller: "Shop ABC",
    sellerId: 45,
    category: "Sách thiếu nhi",
    publishDate: "2023-01-15",
    rating: 4.2,
    totalSold: 320,
    image: "https://example.com/product-image.jpg",
  },
  previousReports: [
    {
      id: 2,
      reason: "Nội dung không phù hợp",
      date: "2023-03-15T10:30:00",
      status: "resolved",
      action: "Yêu cầu người bán chỉnh sửa mô tả sản phẩm",
    },
    {
      id: 3,
      reason: "Giá bán quá cao",
      date: "2023-02-20T14:45:00",
      status: "rejected",
      action: "Báo cáo không hợp lệ, giá phù hợp với thị trường",
    },
  ],
}

const ReportDetail = () => {
  const { reportId } = useParams()
  const navigate = useNavigate()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [adminNote, setAdminNote] = useState("")
  const [notifyReporter, setNotifyReporter] = useState(true)
  const [notifyReported, setNotifyReported] = useState(true)
  const [actionType, setActionType] = useState("")
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  useEffect(() => {
    // Giả lập API call để lấy chi tiết báo cáo
    const fetchReportDetail = async () => {
      try {
        // Trong thực tế, bạn sẽ gọi API với reportId
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setReport(sampleReportDetails)
      } catch (error) {
        console.error("Error fetching report details:", error)
        toast.error("Không thể tải thông tin chi tiết báo cáo")
      } finally {
        setLoading(false)
      }
    }

    fetchReportDetail()
  }, [reportId])

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

  const handleResolveReport = () => {
    setActionType("resolve")
    setShowConfirmModal(true)
  }

  const handleRejectReport = () => {
    setActionType("reject")
    setShowConfirmModal(true)
  }

  const handleRequestMoreInfo = () => {
    setActionType("request_info")
    setShowConfirmModal(true)
  }

  const handleConfirmAction = async () => {
    try {
      // Giả lập API call để xử lý báo cáo
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Cập nhật trạng thái báo cáo dựa trên hành động
      let newStatus = report.status
      let successMessage = ""

      if (actionType === "resolve") {
        newStatus = "resolved"
        successMessage = "Báo cáo đã được xử lý thành công"
      } else if (actionType === "reject") {
        newStatus = "rejected"
        successMessage = "Báo cáo đã được từ chối"
      } else if (actionType === "request_info") {
        newStatus = "pending"
        successMessage = "Đã gửi yêu cầu thêm thông tin"
      }

      setReport({
        ...report,
        status: newStatus,
      })

      // Hiển thị thông báo thành công
      toast.success(successMessage)

      // Đóng modal xác nhận
      setShowConfirmModal(false)

      // Chuyển hướng về trang danh sách báo cáo sau 2 giây
      setTimeout(() => {
        navigate("/admin/reports")
      }, 2000)
    } catch (error) {
      console.error("Error processing report:", error)
      toast.error("Có lỗi xảy ra khi xử lý báo cáo")
      setShowConfirmModal(false)
    }
  }

  const handleCancelAction = () => {
    setShowConfirmModal(false)
    setActionType("")
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-xl font-semibold text-gray-800 mb-4">Không tìm thấy báo cáo</h1>
          <p className="text-gray-600 mb-4">Báo cáo bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <button
            onClick={() => navigate("/admin/reports")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Quay lại danh sách báo cáo
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Chi tiết báo cáo #{report.id}</h1>

        <div className="mt-4 md:mt-0">
          <button
            onClick={() => navigate("/admin/reports")}
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
            Quay lại danh sách
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Thông tin báo cáo */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Thông tin báo cáo</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <span className="block text-sm font-medium text-gray-500">Loại báo cáo</span>
                    <span
                      className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        report.type === "seller"
                          ? "bg-blue-100 text-blue-800"
                          : report.type === "product"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {report.type === "seller" ? "Người bán" : report.type === "product" ? "Sản phẩm" : "Người dùng"}
                    </span>
                  </div>

                  <div className="mb-4">
                    <span className="block text-sm font-medium text-gray-500">Đối tượng bị báo cáo</span>
                    <span className="block mt-1 text-sm text-gray-900">{report.reportedName}</span>
                  </div>

                  <div className="mb-4">
                    <span className="block text-sm font-medium text-gray-500">Lý do báo cáo</span>
                    <span className="block mt-1 text-sm text-gray-900">{report.reason}</span>
                  </div>
                </div>

                <div>
                  <div className="mb-4">
                    <span className="block text-sm font-medium text-gray-500">Người báo cáo</span>
                    <span className="block mt-1 text-sm text-gray-900">
                      {report.reporterName} ({report.reportedBy})
                    </span>
                  </div>

                  <div className="mb-4">
                    <span className="block text-sm font-medium text-gray-500">Thời gian báo cáo</span>
                    <span className="block mt-1 text-sm text-gray-900">{formatDate(report.reportDate)}</span>
                  </div>

                  <div className="mb-4">
                    <span className="block text-sm font-medium text-gray-500">Trạng thái</span>
                    <span
                      className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        report.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : report.status === "resolved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {report.status === "pending"
                        ? "Đang chờ xử lý"
                        : report.status === "resolved"
                          ? "Đã xử lý"
                          : "Đã từ chối"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <span className="block text-sm font-medium text-gray-500">Chi tiết báo cáo</span>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">{report.details}</p>
              </div>

              {report.images && report.images.length > 0 && (
                <div className="mt-6">
                  <span className="block text-sm font-medium text-gray-500 mb-2">Hình ảnh minh chứng</span>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {report.images.map((image, index) => (
                      <div key={index} className="relative h-40 bg-gray-100 rounded-md overflow-hidden">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Minh chứng ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = "/placeholder.svg?height=160&width=240"
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Thông tin đối tượng bị báo cáo */}
          <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                {report.type === "seller"
                  ? "Thông tin người bán"
                  : report.type === "product"
                    ? "Thông tin sản phẩm"
                    : "Thông tin người dùng"}
              </h2>
            </div>
            <div className="p-6">
              {report.type === "product" && (
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 mb-4 md:mb-0 md:mr-6">
                    <div className="h-48 bg-gray-100 rounded-md overflow-hidden">
                      <img
                        src={report.reportedItemDetails.image || "/placeholder.svg"}
                        alt={report.reportedItemDetails.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = "/placeholder.svg?height=192&width=256"
                        }}
                      />
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{report.reportedItemDetails.name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <span className="block text-sm font-medium text-gray-500">Giá bán</span>
                        <span className="block mt-1 text-sm text-gray-900">
                          {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                            report.reportedItemDetails.price,
                          )}
                        </span>
                      </div>
                      <div>
                        <span className="block text-sm font-medium text-gray-500">Danh mục</span>
                        <span className="block mt-1 text-sm text-gray-900">{report.reportedItemDetails.category}</span>
                      </div>
                      <div>
                        <span className="block text-sm font-medium text-gray-500">Người bán</span>
                        <span className="block mt-1 text-sm text-gray-900">{report.reportedItemDetails.seller}</span>
                      </div>
                      <div>
                        <span className="block text-sm font-medium text-gray-500">Ngày đăng bán</span>
                        <span className="block mt-1 text-sm text-gray-900">
                          {new Date(report.reportedItemDetails.publishDate).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                      <div>
                        <span className="block text-sm font-medium text-gray-500">Đánh giá</span>
                        <span className="block mt-1 text-sm text-gray-900">
                          {report.reportedItemDetails.rating} ⭐ ({report.reportedItemDetails.totalSold} đã bán)
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-gray-500">Mô tả sản phẩm</span>
                      <p className="mt-1 text-sm text-gray-900">{report.reportedItemDetails.description}</p>
                    </div>
                  </div>
                </div>
              )}

              {report.type === "seller" && (
                <div>
                  {/* Hiển thị thông tin người bán */}
                  <p className="text-gray-500 italic">Thông tin chi tiết về người bán sẽ được hiển thị ở đây</p>
                </div>
              )}

              {report.type === "user" && (
                <div>
                  {/* Hiển thị thông tin người dùng */}
                  <p className="text-gray-500 italic">Thông tin chi tiết về người dùng sẽ được hiển thị ở đây</p>
                </div>
              )}
            </div>
          </div>

          {/* Lịch sử báo cáo */}
          {report.previousReports && report.previousReports.length > 0 && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Lịch sử báo cáo trước đây</h2>
              </div>
              <div className="p-6">
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
                          Lý do
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
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Hành động đã thực hiện
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {report.previousReports.map((prevReport) => (
                        <tr key={prevReport.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{prevReport.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prevReport.reason}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(prevReport.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                prevReport.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : prevReport.status === "resolved"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {prevReport.status === "pending"
                                ? "Đang chờ"
                                : prevReport.status === "resolved"
                                  ? "Đã xử lý"
                                  : "Đã từ chối"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">{prevReport.action}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Phần xử lý báo cáo */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow overflow-hidden sticky top-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Xử lý báo cáo</h2>
            </div>
            <div className="p-6">
              {report.status === "pending" ? (
                <>
                  <div className="mb-6">
                    <label htmlFor="adminNote" className="block text-sm font-medium text-gray-700 mb-1">
                      Ghi chú của Admin
                    </label>
                    <textarea
                      id="adminNote"
                      rows="4"
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      placeholder="Nhập ghi chú về cách xử lý báo cáo này..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center mb-3">
                      <input
                        id="notifyReporter"
                        type="checkbox"
                        checked={notifyReporter}
                        onChange={() => setNotifyReporter(!notifyReporter)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="notifyReporter" className="ml-2 block text-sm text-gray-700">
                        Thông báo cho người báo cáo
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="notifyReported"
                        type="checkbox"
                        checked={notifyReported}
                        onChange={() => setNotifyReported(!notifyReported)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="notifyReported" className="ml-2 block text-sm text-gray-700">
                        Thông báo cho đối tượng bị báo cáo
                      </label>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={handleResolveReport}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center justify-center"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Xử lý báo cáo
                    </button>

                    <button
                      onClick={handleRejectReport}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 flex items-center justify-center"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Từ chối báo cáo
                    </button>

                    <button
                      onClick={handleRequestMoreInfo}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Yêu cầu thêm thông tin
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${
                      report.status === "resolved" ? "bg-green-100" : "bg-red-100"
                    } mb-4`}
                  >
                    {report.status === "resolved" ? (
                      <svg
                        className="w-6 h-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg
                        className="w-6 h-6 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {report.status === "resolved" ? "Báo cáo đã được xử lý" : "Báo cáo đã bị từ chối"}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {report.status === "resolved"
                      ? "Báo cáo này đã được xử lý và đánh dấu là đã giải quyết."
                      : "Báo cáo này đã bị từ chối vì không đủ bằng chứng hoặc không vi phạm quy định."}
                  </p>
                  <button
                    onClick={() => navigate("/admin/reports")}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200"
                  >
                    Quay lại danh sách báo cáo
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal xác nhận */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div
                    className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${
                      actionType === "resolve" ? "bg-green-100" : actionType === "reject" ? "bg-red-100" : "bg-blue-100"
                    } sm:mx-0 sm:h-10 sm:w-10`}
                  >
                    {actionType === "resolve" ? (
                      <svg
                        className="h-6 w-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : actionType === "reject" ? (
                      <svg
                        className="h-6 w-6 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : (
                      <svg
                        className="h-6 w-6 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {actionType === "resolve"
                        ? "Xác nhận xử lý báo cáo"
                        : actionType === "reject"
                          ? "Xác nhận từ chối báo cáo"
                          : "Xác nhận yêu cầu thêm thông tin"}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {actionType === "resolve"
                          ? "Bạn có chắc chắn muốn xử lý báo cáo này? Hành động này sẽ đánh dấu báo cáo là đã giải quyết."
                          : actionType === "reject"
                            ? "Bạn có chắc chắn muốn từ chối báo cáo này? Hành động này sẽ đánh dấu báo cáo là không hợp lệ."
                            : "Bạn có chắc chắn muốn yêu cầu thêm thông tin? Hệ thống sẽ gửi thông báo đến người báo cáo."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleConfirmAction}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${
                    actionType === "resolve"
                      ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                      : actionType === "reject"
                        ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                        : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                  } text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm`}
                >
                  Xác nhận
                </button>
                <button
                  type="button"
                  onClick={handleCancelAction}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Hủy bỏ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReportDetail

