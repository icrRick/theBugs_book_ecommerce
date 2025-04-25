"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import axiosInstance from "../../utils/axiosInstance"
import { showSuccessToast, showErrorToast } from "../../utils/Toast"
import Loading from "../../utils/Loading"
import Pagination from "./Pagination"

const ReportProducts = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedRejectReasons, setSelectedRejectReasons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [activeTab, setActiveTab] = useState("all");
  const itemsPerPage = 10;
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);


  const fetchData = async (active, page) => {
    try {
    
      const response = await axiosInstance.get(`/admin/report/product/list?active=${active}&page=${page}`);
      if (response.status === 200) {
        setReports(response.data.data.arrayList);
        setTotalItems(response.data.data.totalItems);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      showErrorToast("Có lỗi xảy ra khi tải dữ liệu báo cáo");
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    const params = new URLSearchParams(window.location.search);
    if (tab === "null") {
      params.set("active", null);
    } else {
      params.set("active", tab);
    }
    navigate(`/admin/reports/products?${params.toString()}`);
    fetchData(tab, 1);
  };


  const handlePageChange = (page) => {
    setCurrentPage(page);
    const params = new URLSearchParams(window.location.search);
    params.set("page", page);
    navigate(`/admin/reports/products?${params.toString()}`);
  };

  const getQueryParams = () => {
    const params = new URLSearchParams(window.location.search);
    const activeValue = params.get("active") || "all";
    const page = params.get("page") || 1;
    return { activeValue, page };
  };

  useEffect(() => {
    if (getQueryParams().activeValue === "null") {
      setActiveTab("null");
    } else {
      setActiveTab(getQueryParams().activeValue);
    }
    setCurrentPage(Number(getQueryParams().page));
    fetchData(getQueryParams().activeValue, getQueryParams().page);
  }, []);



  const getStatusInfo = (active) => {
    switch (active) {
      case "all":
        return {
          color: "bg-gray-100 text-gray-800",
          text: "Tất cả",
        }
      case null:
        return {
          color: "bg-yellow-100 text-yellow-800",
          text: "Chờ duyệt",
        }
      case true:
        return {
          color: "bg-green-100 text-green-800",
          text: "Đã duyệt",
        }
      case false:
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
        fetchData(activeTab, currentPage);
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
        fetchData(activeTab, currentPage);
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




  return (
    <>
      {isLoading && <Loading />}
      <div className="my-4 bg-white rounded-lg shadow-sm overflow-hidden max-w-full">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <a href="#" className="hover:text-blue-600 transition-colors duration-200">Trang chủ</a>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 mx-2 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                  <span className="text-gray-700 font-medium">Quản lý báo cáo sản phẩm</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Quản lý báo cáo sản phẩm</h1>
                    <p className="text-gray-500 text-xs sm:text-sm mt-1">Quản lý tất cả báo cáo sản phẩm trong hệ thống</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Main */}
        <div className="p-4">
          {/* Tab */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-6">
              <button
                onClick={() => handleTabChange("all")}
                className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-all duration-300 ease-in-out ${activeTab === "all"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => handleTabChange("null")}
                className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-all duration-300 ease-in-out ${activeTab === "null"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                Chờ duyệt
              </button>
              <button
                onClick={() => handleTabChange("true")}
                className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-all duration-300 ease-in-out ${activeTab === "true"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                Đã duyệt
              </button>
              <button
                onClick={() => handleTabChange("false")}
                className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-all duration-300 ease-in-out ${activeTab === "false"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                Từ chối
              </button>
            </nav>
          </div>
          {/* Results stats */}
          {reports.length > 0 && (
            <div className="flex flex-wrap justify-between items-center mb-4">
              <div className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-0">
                <span className="hidden sm:inline">Hiển thị</span>{" "}
                <span className="font-medium">{startItem}-{endItem}</span>{" "}
                <span className="hidden sm:inline">trên</span>{" "}
                <span className="font-medium">{totalItems}</span> sản phẩm{" "}
                <span className="inline sm:hidden">• Trang {currentPage}</span>
              </div>


            </div>
          )}


          {/* Content */}

          <div className="grid gap-4">
            {reports.length === 0 && (
              <div className="flex justify-center items-center h-64">
                <div className="text-gray-500">Không có báo cáo nào</div>
              </div>
            )}
            {reports.length > 0 && reports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-lg border border-gray-200 p-5 hover:border-blue-200 hover:shadow-sm transition-all duration-300 group"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                        {report?.productName}
                      </h3>
                      <div className="text-sm text-gray-500 mt-1">
                        Mã sản phẩm: {report?.productCode}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Người báo cáo: {report?.emailUser}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500 mr-1">Trạng thái:</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium shadow-sm ${getStatusInfo(report?.active).color}`}>
                            {getStatusInfo(report?.active).text}
                          </span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="mr-1">Ngày tạo:</span>
                          <svg className="w-3 h-3 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {report?.createAt}
                        </div>
                        {report?.active !== null && report?.approvalDate && (
                          <div className="flex items-center text-xs text-gray-500">
                            <span className="mr-1">Ngày {report?.active ? "duyệt" : "từ chối"}:</span>
                            <svg className="w-3 h-3 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {report?.approvalDate}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="bg-gray-50 rounded-md p-3 border border-gray-100">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Lý do báo cáo
                        </span>
                        <span className="text-gray-400">|</span>
                        <Link
                          to={report?.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-300"
                        >
                          Xem hình ảnh báo cáo
                        </Link>
                      </div>
                      <p className="text-sm text-gray-600">
                        {report?.note}
                      </p>
                    </div>
                  </div>

                  {/* Hiển thị nhiều hình ảnh */}
                  {report?.images && report.images.length > 0 && (
                    <div className="mt-4">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {report.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image}
                              alt={`Hình ảnh báo cáo ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-300"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <a
                                href={image}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all duration-300"
                              >
                                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                                </svg>
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

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
              </div>

            ))}
            {reports.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(
                  totalItems / 10
                )}
                setCurrentPage={handlePageChange}
              />
            )}
          </div>
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

    </>
  )
}

export default ReportProducts;

