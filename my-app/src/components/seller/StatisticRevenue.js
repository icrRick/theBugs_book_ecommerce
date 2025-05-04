import React, { useState, useEffect } from 'react';

import axiosInstance from '../../utils/axiosInstance';
import { showErrorToast, showSuccessToast } from '../../utils/Toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { formatCurrency } from '../../utils/Format';
import Pagination from '../admin/Pagination';

const StatisticRevenue = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [items, setItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const [currentPage, setCurrentPage] = useState(parseInt(queryParams.get('page')) || 1);
  const [startDate, setStartDate] = useState(queryParams.get('startDate') || '');
  const [endDate, setEndDate] = useState(queryParams.get('endDate') || '');

  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 10;
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getQueryParams = () => {
    const params = new URLSearchParams(window.location.search);
    const startDate = params.get('startDate') || '';
    const endDate = params.get('endDate') || '';
    const currentPage = params.get('page') || 1;
    return { startDate, endDate, currentPage };
  }

  // Cập nhật ngày và gọi API lần đầu khi component mount
  useEffect(() => {
    const start = new Date();
    start.setDate(start.getDate() - 31);
    const end = new Date();
    const startDateString = start.toISOString().split('T')[0];
    const endDateString = end.toISOString().split('T')[0];

    setStartDate(startDateString);
    setEndDate(endDateString);

    updateUrlParams(startDateString, endDateString, 1);
    fetchData();
  }, []); // Chạy 1 lần khi component mount

  // Lấy dữ liệu từ API
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/seller/revenue/shop/list?startDate=${startDate}&endDate=${endDate}&page=${currentPage}`);
      if (response.status === 200 && response.data.status === true) {
        setItems(response.data.data.arrayList);
        setTotalItems(response.data.data.totalItems);
        setTotalRevenue(response.data.data.totalRevenue);
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
      showErrorToast("Có lỗi xảy ra khi tải dữ liệu thống kê " + error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Gọi API mỗi khi startDate, endDate, currentPage thay đổi
  useEffect(() => {
    if (getQueryParams().startDate && getQueryParams().endDate && getQueryParams().currentPage) {
      fetchData();
    }
  }, [getQueryParams().startDate, getQueryParams().endDate, getQueryParams().currentPage]);

  // Hàm thay đổi trang
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    updateUrlParams(startDate, endDate, newPage);
  };

  // Hàm làm mới trang
  const handleRefresh = () => {
    setCurrentPage(1);
    setStartDate('');
    setEndDate('');
    updateUrlParams('', '', 1);
    fetchData();
  };

  // Hàm tìm kiếm
  const handleSearch = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (end < start) {
      showErrorToast("Ngày kết thúc phải sau ngày bắt đầu");
      return;
    }

    if (diffDays > 31) {
      showErrorToast("Khoảng thời gian tìm kiếm không được vượt quá 31 ngày");
      return;
    }

    setCurrentPage(1); // Đặt lại trang về 1
    updateUrlParams(startDate, endDate, 1);
    fetchData(); // Gọi lại API sau khi kiểm tra điều kiện hợp lệ
  };

  // Cập nhật URL query parameters
  const updateUrlParams = (startDate, endDate, page) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (page > 1) params.append('page', page);

    navigate({
      pathname: location.pathname,
      search: params.toString()
    });
  };

  // Hàm thay đổi ngày bắt đầu
  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    const startDate = new Date(e.target.value);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 31);
    setEndDate(endDate.toISOString().split('T')[0]);
  };

  // Hàm thay đổi ngày kết thúc
  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  return (
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
                <span className="text-gray-700 font-medium">Thống kê</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Thống kê doanh thu cửa hàng</h1>
                  <p className="text-gray-500 text-xs sm:text-sm mt-1">Thống kê doanh thu từng cửa hàng trong hệ thống</p>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <button
                onClick={handleRefresh}
                className="inline-flex items-center px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 shadow-sm text-xs sm:text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="hidden xs:inline">Làm mới</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        <div className="mb-6">
          {/* Date Range Picker */}
          <div className="flex items-center gap-4">
            <div className="w-56">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={handleStartDateChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out shadow-sm"
                />
              </div>
            </div>

            <div className="w-56">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={handleEndDateChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out shadow-sm"
                />
              </div>
            </div>

            <button
              onClick={handleSearch}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Tìm kiếm
            </button>
            <div className='flex items-center gap-2 text-sm font-medium text-gray-900'>
              <div>Tổng doanh thu:</div>
              <div className="text-red-600 text-lg font-bold ml-auto">{formatCurrency(totalRevenue)}</div>
            </div>
          </div>
        </div>

        {/* Results stats */}
        <div className="flex flex-wrap justify-between items-center mb-4">
          <div className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-0">
            <span className="hidden sm:inline">Hiển thị</span>{" "}
            <span className="font-medium">{items.length > 0 ? startItem : 0}-{items.length > 0 ? endItem : 0}</span>{" "}
            <span className="hidden sm:inline">trên</span>{" "}
            <span className="font-medium">{totalItems}</span> cửa hàng{" "}
            <span className="inline sm:hidden">• Trang {currentPage}</span>
          </div>


        </div>

        {/* Table Container */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {isLoading && items.length > 0 && (
            <div className="p-4 flex justify-center">
              <div className="animate-pulse flex space-x-2 items-center">
                <div className="h-2 sm:h-3 w-2 sm:w-3 bg-blue-400 rounded-full"></div>
                <div className="h-2 sm:h-3 w-2 sm:w-3 bg-blue-400 rounded-full"></div>
                <div className="h-2 sm:h-3 w-2 sm:w-3 bg-blue-400 rounded-full"></div>
                <span className="text-xs sm:text-sm text-gray-500">Đang tải...</span>
              </div>
            </div>
          )}

          {/* Table for tablet and desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">

                  <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Id
                  </th>


                  <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>

                  <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doanh thu gốc
                  </th>

                  <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doanh thu sau khi giảm giá
                  </th>

                  <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phí cố định (5%)
                  </th>

                  <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doanh thu sau khi trừ phí
                  </th>

                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.length === 0 && !isLoading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-10 text-center text-sm text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 sm:h-10 w-8 sm:w-10 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <span>Không tìm thấy dữ liệu</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.orderId} className="hover:bg-blue-50 transition-colors duration-150">
                      <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
                        <div className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[80px] sm:max-w-[120px] md:max-w-[180px] lg:max-w-none">{item?.orderId}</div>
                      </td>

                      <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
                        <div className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[80px] sm:max-w-[120px] md:max-w-[180px] lg:max-w-none">
                          {item?.createdAt}
                        </div>
                      </td>

                      <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
                        <div className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[80px] sm:max-w-[120px] md:max-w-[180px] lg:max-w-none">
                          {formatCurrency(item?.totalOlPrice || 0)}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
                        <div className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[80px] sm:max-w-[120px] md:max-w-[180px] lg:max-w-none">
                          {formatCurrency(item?.totalPromoPrice || 0)}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
                        <div className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[80px] sm:max-w-[120px] md:max-w-[180px] lg:max-w-none">
                          {formatCurrency(item?.totalOlPrice * 0.05 || 0)}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
                        <div className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[80px] sm:max-w-[120px] md:max-w-[180px] lg:max-w-none">
                          {formatCurrency(item?.totalPromoPrice - (item?.totalOlPrice * 0.05) || 0)}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile card view for small screens */}
          <div className="md:hidden">
            {items.length === 0 && !isLoading ? (
              <div className="px-4 py-8 text-center text-sm text-gray-500">
                <div className="flex flex-col items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <span>Không tìm thấy dữ liệu</span>
                </div>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.orderId} className="border-t border-gray-200 px-4 py-3 hover:bg-blue-50 transition-colors duration-150">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-900 truncate max-w-[180px]">ID: {item?.orderId}</span>
                  </div>
                  <div className="text-xs text-gray-600 mb-1">Ngày tạo: {item?.createdAt}</div>
                  <div className="text-xs text-gray-600 mb-1">Doanh thu gốc: {formatCurrency(item?.totalOlPrice || 0)}</div>
                  <div className="text-xs text-gray-600 mb-1">Doanh thu sau khi giảm giá: {formatCurrency(item?.totalPromoPrice || 0)}</div>
                  <div className="text-xs text-gray-600 mb-1">Phí cố định (5%): {formatCurrency(item?.totalOlPrice * 0.05 || 0)}</div>
                  <div className="text-xs text-gray-600">Doanh thu sau khi trừ phí: {formatCurrency(item?.totalPromoPrice - (item?.totalOlPrice * 0.05) || 0)}</div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {items.length > 0 && (
            <div className={`border-t border-gray-200 ${isLoading ? 'opacity-50' : ''}`}>
              <Pagination currentPage={currentPage} totalPages={Math.ceil(totalItems / 10)} setCurrentPage={handlePageChange} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatisticRevenue;
