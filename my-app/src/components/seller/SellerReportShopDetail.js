"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Loading from "../../utils/Loading";

const SellerReportShopDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReportDetail = async (id) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `/seller/report/shop/detail?id=${id}`
      );
      if (response.status === 200 && response.data.status == true) {
        setReport(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching report details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchReportDetail(id);
    }
  }, [id]);

  // Định dạng ngày tháng
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const getStatusBadge = (status) => {
    if (status === null) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
          <span className="w-2 h-2 mr-1.5 rounded-full bg-yellow-500"></span>
          Chờ duyệt
        </span>
      );
    } else if (status) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <span className="w-2 h-2 mr-1.5 rounded-full bg-green-500"></span>
          Đã duyệt
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
          <span className="w-2 h-2 mr-1.5 rounded-full bg-red-500"></span>
          Từ chối
        </span>
      );
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!report) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-lg mx-auto mt-10">
        <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-gray-400"
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
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Không tìm thấy báo cáo
        </h3>
        <p className="text-gray-600 mb-6">
          Báo cáo bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
        <button
          onClick={() => navigate("/seller/report-shops")}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Quay lại danh sách báo cáo
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/seller/report-shops")}
            className="mr-3 flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm hover:bg-gray-50 transition-colors"
            aria-label="Quay lại"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-800">
            Chi tiết báo cáo cửa hàng #{report.id}
          </h1>
        </div>

        {/* Main content */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Shop info section */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0">
                  <img
                    src={report?.shopImage || "/placeholder.svg"}
                    alt={report?.shopName}
                    className="w-24 h-24 object-cover rounded-lg border border-gray-200 shadow-sm"
                  />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-800 text-xl mb-1">
                    {report?.shopName}
                  </h2>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Mã cửa hàng:</span>{" "}
                    {report?.shopSlug}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Email người dùng:</span>{" "}
                    {report?.emailUser}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start md:items-end space-y-3">
                <div>{getStatusBadge(report?.active)}</div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Ngày tạo:</span>{" "}
                  {formatDate(report?.createAt)}
                </div>
                {report?.active !== null && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">
                      Ngày {report?.active === true ? "duyệt" : "từ chối"}:
                    </span>{" "}
                    {formatDate(report?.approvalDate)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Report reason section */}
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-md font-semibold text-gray-700 mb-3">
              Lý do báo cáo
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-800 whitespace-pre-line">
                {report?.note}
              </p>
            </div>
          </div>

          {/* Evidence images section */}
          {report?.images && report?.images.length > 0 && (
            <div className="p-6">
              <h3 className="text-md font-semibold text-gray-700 mb-4">
                Hình ảnh minh chứng
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {report?.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative group rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 aspect-square"
                  >
                    <img
                      src={image?.name || "/placeholder.svg"}
                      alt={`Hình ảnh ${index + 1}`}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <a
                        href={image?.name}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white/90 hover:bg-white p-3 rounded-full transform hover:scale-110 transition-all duration-200 shadow-sm"
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
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerReportShopDetail;
