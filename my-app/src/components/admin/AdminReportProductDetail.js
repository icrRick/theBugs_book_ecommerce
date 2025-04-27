import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import axiosInstance from "../../utils/axiosInstance"
import { showSuccessToast, showErrorToast } from "../../utils/Toast"
import Loading from "../../utils/Loading"
const AdminReportProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [report, setReport] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedRejectReasons, setSelectedRejectReasons] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const fetchReportDetail = async (id) => {
    setIsLoading(true)
    try {
      const response = await axiosInstance.get(`/admin/report/product/detail?id=${id}`);
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
  const handleApproveClick = (report) => {
    setSelectedItem(report);
    setShowApproveModal(true);
  };

  const handleRejectClick = (report) => {
    setSelectedItem(report);
    setShowRejectModal(true);
  };

  const handleApprove = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post(`/admin/report/product/approve?id=${selectedItem.id}`);
      if (response.status === 200 && response.data.status === true) {
        showSuccessToast("Đã duyệt sản phẩm thành công!");
      } else {
        showErrorToast(response.data.message || "Có lỗi xảy ra khi duyệt sản phẩm!");
      }
    } catch (error) {
      console.error('Error approving product:', error);
      showErrorToast("Có lỗi xảy ra khi duyệt sản phẩm!");
    } finally {
      setIsLoading(false);
      setShowApproveModal(false);
      setSelectedItem(null);
    }
  };

  const handleReject = async () => {
    if (selectedRejectReasons.length === 0 || (selectedRejectReasons.includes('other') && !rejectReason)) {
      showErrorToast("Vui lòng chọn ít nhất một lý do từ chối!");
      return;
    }

    let reasons = selectedRejectReasons.filter(reason => reason !== 'other');
    if (selectedRejectReasons.includes('other')) {
      reasons.push(rejectReason);
    }

    try {
      setIsLoading(true);
      const response = await axiosInstance.post('/admin/report/product/reject', {
        id: selectedItem.id,
        reasons: reasons
      });

      if (response.status === 200 && response.data.status === true) {
        showSuccessToast("Đã từ chối sản phẩm thành công!");
      } else {
        showErrorToast(response.data.message || "Có lỗi xảy ra khi từ chối sản phẩm!");
      }
    } catch (error) {
      console.error('Error rejecting product:', error);
      showErrorToast("Có lỗi xảy ra khi từ chối sản phẩm!");
    } finally {
      setIsLoading(false);
      setShowRejectModal(false);
      setSelectedItem(null);
      setRejectReason('');
      setSelectedRejectReasons([]);
    }
  };

  const handleReasonChange = (reason) => {
    setSelectedRejectReasons(prev => {
      if (prev.includes(reason)) {
        return prev.filter(r => r !== reason);
      } else {
        return [...prev, reason];
      }
    });
  };

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
          onClick={() => navigate("/admin/reports/products")}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Quay lại danh sách báo cáo
        </button>
      </div>
    )
  }

  return (
    <>
      {isLoading && <Loading />}
      <div className="my-4 bg-white rounded-lg shadow-sm overflow-hidden max-w-full min-h-screen">
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <a href="#" className="hover:text-blue-600 transition-colors duration-200">Trang chủ</a>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
                <Link to="/admin/reports/products" className="hover:text-blue-600 transition-colors duration-200">Quản lý báo cáo sản phẩm</Link>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-gray-900 font-medium truncate max-w-xs">{report?.productName || ''}</span>
              </div>

              <div className="flex justify-end">
                <div className="flex gap-2">
                  {report?.active === null && (
                    <>
                      <button
                        onClick={() => handleApproveClick(report)}
                        className="px-3 py-1.5 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors text-sm font-medium flex items-center shadow-sm hover:shadow"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Duyệt
                      </button>
                      <button
                        onClick={() => handleRejectClick(report)}
                        className="px-3 py-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors text-sm font-medium flex items-center shadow-sm hover:shadow"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Từ chối
                      </button>
                    </>
                  )}

                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Chi tiết báo cáo sản phẩm {report?.productName}</h1>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">Chi tiết báo cáo sản phẩm</p>
              </div>
            </div>


          </div>
        </div>

        <div className="p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div className="flex items-start space-x-4">
              <img
                src={report.productImage || "/placeholder.svg"}
                alt={report.productName}
                className="w-24 h-24 object-cover rounded-lg border border-gray-200"
              />
              <div>
                <h3 className="font-medium text-gray-800 text-xl">{report.productName}</h3>
                <p className="text-sm text-gray-600 mt-1">Mã sản phẩm: {report.productCode}</p>
                <p className="text-sm text-gray-500 mt-1">Email người dùng: {report.emailUser}</p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col items-end space-y-2">
              <div className="text-sm">
                <span className={`px-3 py-1 rounded-full text-sm ${report.active === null
                  ? 'bg-yellow-100 text-yellow-800'
                  : report.active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                  }`}>
                  {report.active === null
                    ? 'Chờ duyệt'
                    : report.active
                      ? 'Đã duyệt'
                      : 'Từ chối'}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Ngày tạo:</span> {formatDate(report.createAt)}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Ngày duyệt:</span> {formatDate(report.approvalDate)}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-md font-semibold text-gray-700 mb-2">Lý do báo cáo</h4>
              <p className="text-gray-800">{report.note}</p>
            </div>

            {report.images && report.images.length > 0 && (
              <div>
                <h4 className="text-md font-semibold text-gray-700 mb-4">Hình ảnh minh chứng</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                  {report.images.map((image, index) => (
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
        {showApproveModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
              <div className="text-center mb-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Xác nhận duyệt báo cáo sản phẩm</h3>
                <p className="text-sm text-gray-500 mb-2">
                  Bạn có chắc chắn muốn duyệt báo cáo sản phẩm "{selectedItem?.productName || ''}" không?
                </p>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-sm">
                  <p className="font-medium text-yellow-700">Lưu ý quan trọng:</p>
                  <p className="text-yellow-600">
                    Sau khi duyệt, sản phẩm sẽ bị khóa trên hệ thống và không thể khôi phục.
                    <span className="font-bold"> Bạn sẽ không thể hủy duyệt báo cáo sản phẩm sau khi xác nhận.</span>
                  </p>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowApproveModal(false);
                    setSelectedItem(null);
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all duration-200"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleApprove}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-all duration-200"
                >
                  Xác nhận duyệt
                </button>
              </div>
            </div>
          </div>
        )}

        {showRejectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                      <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Từ chối báo cáo</h3>
                  </div>
                </div>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lý do từ chối
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <input
                          id="reason-invalid"
                          name="reject-reason"
                          type="checkbox"
                          className="h-4 w-4 mt-1 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                          value="Nội dung báo cáo không hợp lệ hoặc không rõ ràng"
                          onChange={() => handleReasonChange("Nội dung báo cáo không hợp lệ hoặc không rõ ràng")}
                          checked={selectedRejectReasons.includes("Nội dung báo cáo không hợp lệ hoặc không rõ ràng")}
                        />
                        <label htmlFor="reason-invalid" className="ml-3 text-sm text-gray-700">
                          Nội dung báo cáo không hợp lệ hoặc không rõ ràng
                        </label>
                      </div>

                      <div className="flex items-start">
                        <input
                          id="reason-evidence"
                          name="reject-reason"
                          type="checkbox"
                          className="h-4 w-4 mt-1 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                          value="Không đủ bằng chứng để xử lý"
                          onChange={() => handleReasonChange("Không đủ bằng chứng để xử lý")}
                          checked={selectedRejectReasons.includes("Không đủ bằng chứng để xử lý")}
                        />
                        <label htmlFor="reason-evidence" className="ml-3 text-sm text-gray-700">
                          Không đủ bằng chứng để xử lý
                        </label>
                      </div>

                      <div className="flex items-start">
                        <input
                          id="reason-duplicate"
                          name="reject-reason"
                          type="checkbox"
                          className="h-4 w-4 mt-1 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                          value="Báo cáo đã được xử lý trước đó hoặc bị trùng"
                          onChange={() => handleReasonChange("Báo cáo đã được xử lý trước đó hoặc bị trùng")}
                          checked={selectedRejectReasons.includes("Báo cáo đã được xử lý trước đó hoặc bị trùng")}
                        />
                        <label htmlFor="reason-duplicate" className="ml-3 text-sm text-gray-700">
                          Báo cáo đã được xử lý trước đó hoặc bị trùng
                        </label>
                      </div>

                      <div className="flex items-start">
                        <input
                          id="reason-policy"
                          name="reject-reason"
                          type="checkbox"
                          className="h-4 w-4 mt-1 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                          value="Không vi phạm chính sách hoặc quy định"
                          onChange={() => handleReasonChange("Không vi phạm chính sách hoặc quy định")}
                          checked={selectedRejectReasons.includes("Không vi phạm chính sách hoặc quy định")}
                        />
                        <label htmlFor="reason-policy" className="ml-3 text-sm text-gray-700">
                          Không vi phạm chính sách hoặc quy định
                        </label>
                      </div>

                      <div className="flex items-start">
                        <input
                          id="reason-other"
                          name="reject-reason"
                          type="checkbox"
                          className="h-4 w-4 mt-1 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                          value="other"
                          onChange={() => handleReasonChange("other")}
                          checked={selectedRejectReasons.includes("other")}
                        />
                        <label htmlFor="reason-other" className="ml-3 text-sm text-gray-700">
                          Lý do khác
                        </label>
                      </div>
                    </div>
                  </div>

                  {selectedRejectReasons.includes('other') && (
                    <div>
                      <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                        Chi tiết lý do
                      </label>
                      <textarea
                        id="reason"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                        placeholder="Nhập chi tiết lý do từ chối báo cáo..."
                        required
                      />
                    </div>
                  )}
                </form>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setSelectedItem(null);
                    setSelectedRejectReasons([]);
                    setRejectReason('');
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all duration-200"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-all duration-200"
                  disabled={selectedRejectReasons.length === 0 || (selectedRejectReasons.includes('other') && !rejectReason)}
                >
                  Xác nhận từ chối
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default AdminReportProductDetail

