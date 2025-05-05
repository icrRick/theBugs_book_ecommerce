import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import Pagination from '../admin/Pagination'
import { showErrorToast, showSuccessToast } from '../../utils/Toast'



const VoucherCard = ({ item, onDelete, onViewDetail }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold">{item?.codeVoucher}</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => onViewDetail(item)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            title="Xem chi tiết"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(item)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
            title="Xóa voucher"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium w-fit ${item?.active ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {item?.active ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Đang hoạt động</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Đã tắt</span>
            </>
          )}
        </div>

        <div className="flex items-center text-gray-600 bg-gray-50 p-1 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          <span className="text-base">Tạo: {new Date(item?.createAt).toLocaleDateString('vi-VN')}</span>
        </div>

        <div className="flex items-center text-gray-600 bg-gray-50 p-1 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          <div className="flex flex-col text-base">
            <span>Bắt đầu: {new Date(item?.startDate).toLocaleDateString('vi-VN')}</span>
            <span>Kết thúc: {new Date(item?.expireDate).toLocaleDateString('vi-VN')}</span>
          </div>
        </div>
        <div className="flex items-center text-gray-600 bg-gray-50 p-1 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          <span className="text-base">Giảm: {item?.discountPercentage}%</span>
        </div>
        <div className="flex items-center text-gray-600 bg-gray-50 p-1 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <div className="flex flex-col text-base">
            <span>Tối thiểu: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item?.minTotalOrder)}</span>
            <span>Tối đa: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item?.maxDiscount)}</span>
          </div>
        </div>
      
        <div className="relative overflow-hidden bg-white rounded-xl border border-gray-100 shadow-sm group hover:shadow-lg hover:border-blue-100 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
          <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 transform origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
          <div className="p-3 relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-20"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-indigo-400/30 rounded-full animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 p-2 rounded-full transform group-hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-lg shadow-blue-500/25 hover:shadow-indigo-500/40">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white transform group-hover:rotate-12 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-500 tracking-wider uppercase">Số lượng còn lại</span>
                  <div className="flex items-baseline space-x-1 mt-0.5">
                    <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
                      {item?.quantity || 0}
                    </span>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">voucher</span>
                  </div>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold transform transition-all duration-300 group-hover:scale-105 ${
                item?.quantity > 10 
                  ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-2 border-green-200 shadow-green-100' 
                  : item?.quantity > 0 
                    ? 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-2 border-yellow-200 shadow-yellow-100' 
                    : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-2 border-red-200 shadow-red-100'
              } shadow-sm`}>
                {item?.quantity > 10 
                  ? 'Còn nhiều' 
                  : item?.quantity > 0 
                    ? 'Sắp hết' 
                    : 'Đã hết'
                }
              </div>
            </div>
            
            {/* Thêm phần hiển thị số lượng voucher đã sử dụng */}
            <div className="mt-2 flex items-center space-x-2">
              <div className="relative flex items-center justify-center">
                <div className="relative bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-full flex items-center justify-center shadow-sm shadow-purple-500/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500 tracking-wider uppercase">Đã sử dụng</span>
                <div className="flex items-baseline space-x-1 mt-0.5">
                  <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {item?.used_count || 0}
                  </span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">lượt</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const Vouchers = () => {
  const navigate = useNavigate();
  //code voucher
  const [vouchers, setVouchers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [expireDate, setExpireDate] = useState('');
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const fetchVouchers = useCallback(async (start, expire, page) => {

    try {
      const response = await axiosInstance.get('/seller/voucher/list', {
        params: {
          startDate: start || null,
          expireDate: expire || null,
          page: page || 1,
        },
      });
      if (response.data.status === true) {
        setVouchers(response.data.data.arrayList);
        setTotalItems(response.data.data.totalItems);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách voucher:', error);

    }

  }, []);

  useEffect(() => {
    fetchVouchers(startDate, expireDate, currentPage);
  }, [fetchVouchers, startDate, expireDate, currentPage]);

  const updateUrlParams = useCallback((start, expire, page) => {
    const params = new URLSearchParams();
    if (start) params.set('startDate', start);
    if (expire) params.set('expireDate', expire);
    if (page) params.set('page', page.toString());
    window.history.pushState(null, '', params.toString() ? `?${params.toString()}` : window.location.pathname);
  }, []);
  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
    updateUrlParams(startDate, expireDate, newPage);
    fetchVouchers(startDate, expireDate, newPage);
  }, [startDate, expireDate, updateUrlParams, fetchVouchers]);

  const handleDelete = (item) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  }

  const confirmDelete = async (id) => {
    try {
      // Gọi API xóa voucher
      const response = await axiosInstance.post(`/seller/voucher/delete?id=${id}`);
      
      if (response.data.status === true) {

      
        // Đóng modal
        setShowDeleteModal(false);
        setSelectedItem(null);
        showSuccessToast(response.data.message || 'Xóa voucher thành công');
        fetchVouchers(startDate, expireDate, currentPage);
      }
    } catch (error) {
      console.error('Lỗi khi xóa voucher:', error);
      showErrorToast('Xóa voucher thất bại' + error.response.data.message);
    }
  }

  const handleViewDetail = (item) => {
    navigate(`/seller/editvoucher/${item.id}`);
    console.log('Xem chi tiết voucher:', item)
  }


  const handleAdd = () => {
    navigate('/seller/addvoucher');
  };

  const handleSearch = useCallback(() => {
    setCurrentPage(1);
    updateUrlParams(startDate, expireDate, 1);
    fetchVouchers(startDate, expireDate, 1);
  }, [startDate, expireDate, updateUrlParams, fetchVouchers]);


  const handleReset = useCallback(() => {
    setStartDate('');
    setExpireDate('');
    setCurrentPage(1);
    updateUrlParams('', '', 1);
    fetchVouchers('', '', 1);
  }, [updateUrlParams, fetchVouchers]);

  // Khởi tạo từ URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const start = params.get('startDate') || '';
    const expire = params.get('expireDate') || '';
    const page = parseInt(params.get('page')) || 1;

    setStartDate(start);
    setExpireDate(expire);
    setCurrentPage(page);
    fetchVouchers(start, expire, page);
  }, [fetchVouchers]); // Chỉ chạy một lần khi mount







  return (
    <div className="w-full mx-auto">

      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 my-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Quản lý voucher</h1>
            <p className="text-sm text-gray-600">Quản lý và theo dõi các voucher của bạn</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 flex items-center gap-2"
              onClick={handleReset}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Đặt lại
            </button>
            <button
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm"
              onClick={handleAdd}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Tạo voucher mới
            </button>
          </div>
        </div>

        {/* Filter Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-5">
            <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>
          <div className="md:col-span-5">
            <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
            <input
              type="date"
              id="end-date"
              value={expireDate}
              onChange={(e) => setExpireDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>
          <div className="md:col-span-2">
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className={`w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Lọc
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Danh sách vouchers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {vouchers.map((voucher, index) => (
          <VoucherCard
            key={index}
            item={voucher}
            onDelete={handleDelete}
            onViewDetail={handleViewDetail}
          />
        ))}
      </div>
      <div className="mt-8">
        {vouchers.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(totalItems / 9)}
            setCurrentPage={handlePageChange}
          />
        )}
      </div>
      
     {/* Delete Modal */}
     {showDeleteModal && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Xác nhận xóa
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Bạn có chắc chắn muốn xóa voucher <span className="font-bold text-red-500">{selectedItem?.codeVoucher}</span> này? Hành động này không thể hoàn tác.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => confirmDelete(selectedItem.id)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Xóa
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedItem(null);
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Vouchers