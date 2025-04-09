import React from 'react'
import { useNavigate } from 'react-router-dom'
const Promotions = () => {
  const navigate=useNavigate();
  // Dữ liệu mẫu
  const promotions = [
    {
      id: 1,
      createat: '2024-03-20',
      startdate: '2024-03-21',
      enddate: '2024-04-21',
      promitonvalue: '20%',
      status: 'sắp diễn ra',
      active: true,
    },
    {
      id: 2, 
      createat: '2024-03-19',
      startdate: '2024-03-20',
      enddate: '2024-04-20',
      promitonvalue: '15%',
      status: 'đang diễn ra',
      active: true,
    },
    {
      id: 3,
      createat: '2024-03-18',
      startdate: '2024-03-19', 
      enddate: '2024-04-19',
      promitonvalue: '25%',
      status: 'đã kết thúc',
      active: false,
    }
  ]

  const getStatusColor = (status) => {
    switch(status) {
      case 'sắp diễn ra':
        return 'bg-yellow-100 text-yellow-800';
      case 'đang diễn ra':
        return 'bg-green-100 text-green-800';
      case 'đã kết thúc':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
  
  const handleAdd= ()=> {
    navigate('/seller/addpromotion');
   
  }

  const handleDelete = (id) => {
    // Xử lý xóa promotion
    console.log('Delete promotion:', id)
  }

  const handleViewDetails = (id) => {
    // Xử lý xem chi tiết promotion
    console.log('View promotion details:', id) 
  }

  return (
    <div className='my-6'>
      {/* Header & Filter Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Quản lý Promotions</h1>
            <p className="text-xs text-gray-500">Tổng quan và quản lý các chương trình khuyến mãi</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Đặt lại</span>
            </button>
            <button  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-sm text-sm"        onClick={() => handleAdd()}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H6a1 1 0 110-2h4V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              <span>Tạo khuyến mãi mới</span>
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-5">
              <div className="relative">
                <input
                  type="date"
                  id="start-date"
                  placeholder="Từ ngày"
                  className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="col-span-5">
              <div className="relative">
                <input
                  type="date"
                  id="end-date"
                  placeholder="Đến ngày"
                  className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="col-span-2">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1.5 px-3 rounded-md transition duration-150 ease-in-out flex items-center justify-center space-x-2 shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Lọc</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid của các promotion cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map((promotion) => (
          <div key={promotion.id} className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden ${!promotion.active ? 'opacity-75' : ''}`}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-blue-600">{promotion.promitonvalue}</span>
                    {promotion.active ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Đang hoạt động
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Đã tắt
                      </span>
                    )}
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${getStatusColor(promotion.status)}`}>
                    {promotion.status}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewDetails(promotion.id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(promotion.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1 flex justify-between">
                    <span className="text-gray-600">Thời gian:</span>
                    <span className="font-medium text-gray-900">{promotion.startdate} - {promotion.enddate}</span>
                  </div>
                </div>

                <div className="flex items-center text-sm">
                  <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div className="flex-1 flex justify-between">
                    <span className="text-gray-600">Ngày tạo:</span>
                    <span className="font-medium text-gray-900">{promotion.createat}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Promotions