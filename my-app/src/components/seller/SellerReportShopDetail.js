
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axiosInstance from "../../utils/axiosInstance"
import { showErrorToast, showSuccessToast } from "../../utils/Toast"
import Loading from "../../utils/Loading"

const SellerReportShopDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [report, setReport] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const fetchReportDetail = async (id) => {
    setIsLoading(true)
    try {
      const response = await axiosInstance.get(`/user/report/shop/detail?id=${id}`);
      if (response.status === 200 && response.data.status == true) {
        setReport(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching report details:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchReportDetail(id);
    }
  }, [id]);









  // Định dạng ngày tháng
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
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
      {isLoading && <Loading />}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button onClick={() => navigate("/account/report-products")} className="mr-4 text-gray-600 hover:text-gray-900">
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

      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div className="flex items-start space-x-4">
          <img
            src={report?.shopImage || "/placeholder.svg"}
            alt={report?.shopName}
            className="w-24 h-24 object-cover rounded-lg border border-gray-200"
          />
          <div>
            <h3 className="font-medium text-gray-800 text-xl">{report?.shopName}</h3>
            <p className="text-sm text-gray-600 mt-1">Mã cửa hàng: {report?.shopSlug}</p>
            <p className="text-sm text-gray-500 mt-1">Email người dùng: {report?.emailUser}</p>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col items-end space-y-2">
          <div className="text-sm">
            <span className={`px-3 py-1 rounded-full text-sm ${report?.active === null
              ? 'bg-yellow-100 text-yellow-800'
              : report?.active
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
              }`}>
              {report?.active === null
                ? 'Chờ duyệt'
                : report?.active
                  ? 'Đã duyệt'
                  : 'Từ chối'}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium">Ngày tạo:</span> {formatDate(report?.createAt)}
          </div>
          {report?.active && (
            <div className="text-sm text-gray-600">
              <span className="font-medium"> Ngày  {report?.active === true ? 'duyệt' : 'từ chối'}:</span> {formatDate(report?.approvalDate)}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-md font-semibold text-gray-700 mb-2">Lý do báo cáo</h4>
          <p className="text-gray-800">{report?.note}</p>
        </div>

        {report?.images && report?.images.length > 0 && (
          <div>
            <h4 className="text-md font-semibold text-gray-700 mb-4">Hình ảnh minh chứng</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
              {report?.images.map((image, index) => (
                <div key={index} className="relative group overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-300 bg-gray-50">
                  <img
                    src={image?.name || "/placeholder.svg"}
                    alt={`Hình ảnh ${index + 1}`}
                    className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <a
                        href={image?.name}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white/95 hover:bg-white p-2.5 rounded-full transform hover:scale-110 transition-all duration-200 shadow-sm"
                        title="Xem ảnh gốc"
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
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SellerReportShopDetail;

