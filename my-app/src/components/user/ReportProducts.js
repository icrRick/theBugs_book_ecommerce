
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { showErrorToast } from "../../utils/Toast";
import axiosInstance from "../../utils/axiosInstance";
import Pagination from "../admin/Pagination";

const ReportProducts = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);


  const [isLoading, setIsLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [activeTab, setActiveTab] = useState("all");
  const itemsPerPage = 10;
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);


  const fetchData = async (active, page) => {
    try {
      const response = await axiosInstance.get(`/user/report/product/list?active=${active}&page=${page}`);
      if (response.status === 200 && response.data.status === true) {
        setReports(response.data.data.arrayList);
        setTotalItems(response.data.data.totalItems);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      showErrorToast("Có lỗi xảy ra khi tải dữ liệu báo cáo" + error.response?.data?.message);
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
    navigate(`/account/report-products?${params.toString()}`);
    fetchData(tab, 1);
  };

  const handleViewDetails = (report) => {
    navigate(`/account/report-product-detail/${report.id}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const params = new URLSearchParams(window.location.search);
    params.set("page", page);
    navigate(`/account/report-products?${params.toString()}`);
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




  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-lg font-semibold">Báo cáo sản phẩm</h2>

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
                          <span className="text-xs text-gray-500 mr-1">Trạng thái báo cáo:</span>
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
                  <div className="flex justify-end">
                        <div className="flex gap-2">

                          <button
                            onClick={() => handleViewDetails(report)}
                            className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors text-sm font-medium flex items-center shadow-sm hover:shadow"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Xem chi tiết
                          </button>
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
  )
}

export default ReportProducts;