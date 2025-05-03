
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"

const ReportProductDetail = () => {
  const { productCode } = useParams()
  const navigate = useNavigate()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReportDetail = async () => {
      setLoading(true)
      try {
        // Giả lập API call
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Dữ liệu mẫu
        const reportData = {
          id: Number.parseInt(productCode),
          productId: 101,
          productName: "Đắc Nhân Tâm",
          productImage: "https://placehold.co/300x400/2ecc71/ffffff?text=Đắc+Nhân+Tâm",
          shopName: "Shop A",
          reason: "fake",
          reasonText: "Sản phẩm giả mạo/không đúng mô tả",
          description:
            "Sách bị thiếu trang và chất lượng in ấn kém so với mô tả. Trang 45-60 bị thiếu hoàn toàn. Bìa sách có dấu hiệu là bản photocopy chứ không phải bản in chính hãng như mô tả.",
          status: "pending",
          createdAt: "2024-03-25T10:30:00",
          updatedAt: "2024-03-25T10:30:00",
          response: null,
          contactEmail: "user@example.com",
          contactPhone: "0912345678",
          images: [
            "https://placehold.co/300x400/2ecc71/ffffff?text=Evidence+1",
            "https://placehold.co/300x400/3498db/ffffff?text=Evidence+2",
            "https://placehold.co/300x400/e74c3c/ffffff?text=Evidence+3",
          ],
          timeline: [
            {
              id: 1,
              status: "created",
              statusText: "Báo cáo đã được tạo",
              date: "2024-03-25T10:30:00",
              note: "Báo cáo của bạn đã được ghi nhận.",
            },
            {
              id: 2,
              status: "reviewing",
              statusText: "Đang xem xét",
              date: "2024-03-25T14:45:00",
              note: "Nhân viên của chúng tôi đang xem xét báo cáo của bạn.",
            },
          ],
        }

        setReport(reportData)
      } catch (error) {
        console.error("Error fetching report details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReportDetail()
  }, [productCode])

  // Định dạng ngày tháng
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

  // Lấy màu và text cho trạng thái
  const getStatusInfo = (status) => {
    switch (status) {
      case "pending":
        return {
          color: "bg-yellow-100 text-yellow-800",
          text: "Chờ xử lý",
        }
      case "processing":
        return {
          color: "bg-blue-100 text-blue-800",
          text: "Đang xử lý",
        }
      case "resolved":
        return {
          color: "bg-green-100 text-green-800",
          text: "Đã giải quyết",
        }
      case "rejected":
        return {
          color: "bg-red-100 text-red-800",
          text: "Từ chối",
        }
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          text: "Không xác định",
        }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 mx-auto text-gray-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Không tìm thấy báo cáo</h3>
        <p className="text-gray-600 mb-6">Báo cáo bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <button
          onClick={() => navigate("/account/report-products")}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Quay lại danh sách báo cáo
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button onClick={() => navigate("/account/reports")} className="mr-4 text-gray-600 hover:text-gray-900">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h2 className="text-lg font-semibold">Chi tiết báo cáo #{report.id}</h2>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusInfo(report.status).color}`}>
          {getStatusInfo(report.status).text}
        </span>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div className="flex items-start space-x-4">
            <img
              src={report.productImage || "/placeholder.svg"}
              alt={report.productName}
              className="w-20 h-20 object-cover rounded-md"
            />
            <div>
              <h3 className="font-medium text-gray-800">{report.productName}</h3>
              <p className="text-sm text-gray-600 mt-1">Shop: {report.shopName}</p>
              <p className="text-sm text-gray-500 mt-1">Ngày báo cáo: {formatDate(report.createdAt)}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-md font-semibold text-gray-700 mb-2">Lý do báo cáo</h4>
            <p className="text-gray-800">{report.reasonText}</p>
          </div>

          <div>
            <h4 className="text-md font-semibold text-gray-700 mb-2">Mô tả chi tiết</h4>
            <p className="text-gray-800 whitespace-pre-line">{report.description}</p>
          </div>

          {report.images && report.images.length > 0 && (
            <div>
              <h4 className="text-md font-semibold text-gray-700 mb-2">Hình ảnh minh họa</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {report.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Hình ảnh ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300 rounded-lg">
                      <a
                        href={image}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="opacity-0 group-hover:opacity-100 bg-white p-2 rounded-full"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-700"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(report.contactEmail || report.contactPhone) && (
            <div>
              <h4 className="text-md font-semibold text-gray-700 mb-2">Thông tin liên hệ</h4>
              {report.contactEmail && (
                <p className="text-gray-800">
                  <span className="font-medium">Email:</span> {report.contactEmail}
                </p>
              )}
              {report.contactPhone && (
                <p className="text-gray-800">
                  <span className="font-medium">Số điện thoại:</span> {report.contactPhone}
                </p>
              )}
            </div>
          )}

          {report.response && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h4 className="text-md font-semibold text-gray-700 mb-2">Phản hồi từ hệ thống</h4>
              <p className="text-gray-800">{report.response}</p>
            </div>
          )}
        </div>
      </div>

      {/* Timeline */}
      {report.timeline && report.timeline.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Tiến trình xử lý</h3>
          <div className="relative">
            {report.timeline.map((event, index) => (
              <div key={event.id} className="mb-8 flex">
                <div className="flex flex-col items-center mr-4">
                  <div className="rounded-full bg-blue-500 text-white flex items-center justify-center w-8 h-8">
                    {index + 1}
                  </div>
                  {index < report.timeline.length - 1 && <div className="h-full w-0.5 bg-blue-500"></div>}
                </div>
                <div className="flex flex-col pb-6">
                  <div className="flex items-center mb-1">
                    <h4 className="text-md font-medium text-gray-800">{event.statusText}</h4>
                    <span className="text-sm text-gray-500 ml-2">({formatDate(event.date)})</span>
                  </div>
                  <p className="text-gray-600">{event.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ReportProductDetail;

