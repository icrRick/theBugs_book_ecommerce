"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const ReportProducts = () => {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const navigate = useNavigate()

  // Giả lập dữ liệu báo cáo
  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true)
      try {
        // Giả lập API call
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Dữ liệu mẫu
        const sampleReports = [
          {
            id: 1,
            productId: 101,
            productName: "Đắc Nhân Tâm",
            productImage: "https://placehold.co/100x100/2ecc71/ffffff?text=Đắc+Nhân+Tâm",
            reason: "fake",
            reasonText: "Sản phẩm giả mạo/không đúng mô tả",
            description: "Sách bị thiếu trang và chất lượng in ấn kém so với mô tả.",
            status: "pending",
            createdAt: "2024-03-25T10:30:00",
            updatedAt: "2024-03-25T10:30:00",
            response: null,
          },
          {
            id: 2,
            productId: 102,
            productName: "Nhà Giả Kim",
            productImage: "https://placehold.co/100x100/3498db/ffffff?text=Nhà+Giả+Kim",
            reason: "quality",
            reasonText: "Chất lượng sản phẩm kém",
            description: "Bìa sách bị rách và có vết bẩn khi nhận hàng.",
            status: "processing",
            createdAt: "2024-03-20T14:15:00",
            updatedAt: "2024-03-22T09:45:00",
            response: null,
          },
          {
            id: 3,
            productId: 103,
            productName: "Tuổi Trẻ Đáng Giá Bao Nhiêu",
            productImage: "https://placehold.co/100x100/9b59b6/ffffff?text=Tuổi+Trẻ",
            reason: "copyright",
            reasonText: "Vi phạm bản quyền",
            description: "Sách có dấu hiệu là bản in lậu, không có mã ISBN và thông tin xuất bản.",
            status: "resolved",
            createdAt: "2024-03-15T08:20:00",
            updatedAt: "2024-03-18T11:30:00",
            response: "Cảm ơn bạn đã báo cáo. Chúng tôi đã xác minh và gỡ bỏ sản phẩm vi phạm khỏi cửa hàng.",
          },
          {
            id: 4,
            productId: 104,
            productName: "Tôi Thấy Hoa Vàng Trên Cỏ Xanh",
            productImage: "https://placehold.co/100x100/e74c3c/ffffff?text=Hoa+Vàng",
            reason: "inappropriate",
            reasonText: "Nội dung không phù hợp",
            description: "Sách có nội dung không phù hợp với độ tuổi được ghi trên bìa.",
            status: "rejected",
            createdAt: "2024-03-10T16:45:00",
            updatedAt: "2024-03-12T13:20:00",
            response:
              "Sau khi xem xét, chúng tôi nhận thấy sản phẩm tuân thủ các quy định về nội dung và được phân loại đúng độ tuổi theo nhà xuất bản.",
          },
        ]

        setReports(sampleReports)
      } catch (error) {
        console.error("Error fetching reports:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [])

  // Lọc báo cáo theo tab đang active
  const filteredReports = reports.filter((report) => {
    if (activeTab === "all") return true
    return report.status === activeTab
  })

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

  // Xử lý xem chi tiết báo cáo
  const handleViewDetail = (reportId) => {
    navigate(`/account/report-product-detail/${reportId}`)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-lg font-semibold">Báo cáo sản phẩm</h2>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("all")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ease-in-out ${activeTab === "all"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ease-in-out ${activeTab === "pending"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
          >
            Chờ xử lý
          </button>
          <button
            onClick={() => setActiveTab("processing")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ease-in-out ${activeTab === "processing"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
          >
            Đang xử lý
          </button>
          <button
            onClick={() => setActiveTab("resolved")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ease-in-out ${activeTab === "resolved"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
          >
            Đã giải quyết
          </button>
        </nav>
      </div>

      {/* Danh sách báo cáo */}
      {filteredReports.length > 0 ? (
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex items-start space-x-4">
                  <img
                    src={report.productImage || "/placeholder.svg"}
                    alt={report.productName}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div>
                    <h3 className="font-medium text-gray-800">{report.productName}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Lý do:</span> {report.reasonText}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Ngày báo cáo: {formatDate(report.createdAt)}</p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4 mt-4 md:mt-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusInfo(report.status).color}`}>
                    {getStatusInfo(report.status).text}
                  </span>
                  <button
                    onClick={() => handleViewDetail(report.id)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>

              {/* Phản hồi nếu có */}
              {report.response && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700">Phản hồi:</p>
                  <p className="text-sm text-gray-600 mt-1">{report.response}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
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
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Không có báo cáo nào</h3>
          <p className="text-gray-600 mb-6">Bạn chưa gửi báo cáo nào hoặc không có báo cáo nào phù hợp với bộ lọc.</p>
        </div>
      )}
    </div>
  )
}

export default ReportProducts;