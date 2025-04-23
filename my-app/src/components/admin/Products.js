import React, { useState, useEffect } from 'react';

import axiosInstance from '../../utils/axiosInstance';
import Pagination from './Pagination';
import { showErrorToast, showSuccessToast } from '../../utils/Toast';
import { useForm } from "react-hook-form";
import Loading from '../../utils/Loading';
import { useNavigate } from 'react-router-dom';

const Products = () => {
  const [items, setItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate=useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 10;

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    defaultValues: {
      name: '',
      image: null
    }
  });

  const getQueryParams = () => {
    const params = new URLSearchParams(window.location.search);
    const keyword = params.get("keyword") || "";
    const page = parseInt(params.get("page")) || 1;
    return { keyword, page };
  };

  const fetchItems = async (keyword, currentPage) => {
    try {
      const response = await axiosInstance.get('/admin/product/list', {
        params: {
          keyword: keyword || '',
          page: currentPage || 1,
        }
      });
      if (response.data.status === true) {
        setItems(response.data.data.arrayList);
        setTotalItems(response.data.data.totalItems);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      showErrorToast('Không thể tải danh sách sản phẩm');
    } 
  };

  useEffect(() => {
    const { keyword, page } = getQueryParams();
    setKeyword(keyword);
    setCurrentPage(page);
    fetchItems(keyword, page);
  }, []);

  const handleSearch = (value) => {
    setKeyword(value);
    setCurrentPage(1);
    const params = new URLSearchParams(window.location.search);
    params.set('keyword', value);
    params.set('page', 1);
    window.history.pushState(null, '', "?" + params.toString());
    fetchItems(value, 1);
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    const params = new URLSearchParams(window.location.search);
    params.set('keyword', keyword || '');
    params.set('page', newPage);
    window.history.pushState(null, '', "?" + params.toString());
    fetchItems(keyword, newPage);
  };

  const configMessage=(item)=>{
    let message="Từ tối";
    if(item == null){
      message= "Chờ xác nhận";
    }else if(item === true){
      message= "Đã xác nhận";
    }
    return <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      item
        ? 'bg-green-100 text-green-800'
        : item === null 
          ? 'bg-yellow-100 text-yellow-800' 
          : 'bg-red-100 text-red-800'
    }`}>
      {message}
    </div>;
  }

  const handleEdit = (item) => {
    navigate(`/admin/product/${item.productCode}`);
  };

  const handleRefresh = () => {
    fetchItems(keyword, currentPage);
    showSuccessToast('Đã làm mới danh sách sản phẩm');
  };


  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (isLoading && items.length === 0) {
    return <Loading />
  }

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
                <span className="text-gray-700 font-medium">Quản lý sản phẩm</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Quản lý sản phẩm</h1>
                  <p className="text-gray-500 text-xs sm:text-sm mt-1">Quản lý tất cả sản phẩm trong hệ thống</p>
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
          {/* Search Box */}
          <div className="w-full md:max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                id="search"
                placeholder="Tìm kiếm theo tên, mã sản phẩm..."
                value={keyword}
                onChange={(e) => handleSearch(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 sm:py-3 border border-gray-300 rounded-lg bg-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Results stats */}
        <div className="flex flex-wrap justify-between items-center mb-4">
          <div className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-0">
            <span className="hidden sm:inline">Hiển thị</span>{" "}
            <span className="font-medium">{items.length > 0 ? startItem : 0}-{items.length > 0 ? endItem : 0}</span>{" "}
            <span className="hidden sm:inline">trên</span>{" "}
            <span className="font-medium">{totalItems}</span> sản phẩm{" "}
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
                    Cửa hàng
                  </th>
                 
                  <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên SP
                  </th>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    TT hoạt động
                  </th>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    TT khóa
                  </th>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    TT duyệt
                  </th>
                  <th scope="col" className="relative px-4 sm:px-6 py-3 w-[80px] sm:w-[100px] md:w-[140px]">
                    <span className="sr-only">Thao tác</span>
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
                        <span>Không tìm thấy sản phẩm nào</span>
                        {keyword && (
                          <button 
                            onClick={() => handleSearch('')}
                            className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Xóa tìm kiếm
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50 transition-colors duration-150">
           
                      <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
                        <div className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[80px] sm:max-w-[120px] md:max-w-[180px] lg:max-w-none">{item?.shopName}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
                        <div className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[80px] sm:max-w-[120px] md:max-w-[180px] lg:max-w-none">{item?.productName}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-3 whitespace-nowrap hidden sm:table-cell">
                        <span className={`inline-flex items-center px-1.5 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item?.active 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item?.active ? "Đang hoạt động" : "Ngừng hoạt động"}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-3 whitespace-nowrap hidden md:table-cell">
                        <span className={`inline-flex items-center px-1.5 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item?.status 
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {item?.status ? "Đã khóa" : "Không khóa"}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-3 whitespace-nowrap hidden md:table-cell">
                          {configMessage(item?.approve)}
                      </td>
                      <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 border border-gray-300 shadow-sm text-xs sm:text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                          >
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span className="hidden sm:inline">Chi tiết</span>
                          </button>
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
                  <span>Không tìm thấy sản phẩm nào</span>
                  {keyword && (
                    <button 
                      onClick={() => handleSearch('')}
                      className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Xóa tìm kiếm
                    </button>
                  )}
                </div>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="border-t border-gray-200 px-4 py-3 hover:bg-blue-50 transition-colors duration-150">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-900 truncate max-w-[180px]">{item?.productName}</span>
                    <button
                      onClick={() => handleEdit(item)}
                      className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                      <svg className="w-3 h-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Chi tiết
                    </button>
                  </div>
                  <div className="text-xs text-gray-600 mb-1">Cửa hàng: {item?.shopName}</div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
                      item?.active 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item?.active ? "Đang hoạt động" : "Ngừng hoạt động"}
                    </span>
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
                      item?.status 
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {item?.status ? "Đã khóa" : "Không khóa"}
                    </span>
                    {configMessage(item?.approve)}
                  </div>
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

export default Products;
