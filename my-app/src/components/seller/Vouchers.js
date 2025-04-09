import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const VoucherCard = ({ item, onDelete, onViewDetail }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold">{item?.code}</h3>
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
      
        
      

        <div className="flex items-center text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          <span>Ngày tạo: {item?.creatAt}</span>
        </div>

        <div className="flex items-center text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          <div className="flex flex-col">
            <span>Bắt đầu: {item?.startDate}</span>
            <span>Kết thúc: {item?.endDate}</span>
          </div>
        </div>
        <div className="flex items-center text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          <span>Giảm giá: {item?.discount}%</span>
        </div>
        <div className="flex items-center text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <div className="flex flex-col">
            <span>Đơn tối thiểu: {item?.mintotal?.toLocaleString()}đ</span>
            <span>Giảm tối đa: {item?.maxdiscount?.toLocaleString()}đ</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const Vouchers = () => {
  const navigate=useNavigate();
  const [searchParams, setSearchParams] = useState({
    startDate: '',
    endDate: '',
    searchText: ''
  })

  const handleDelete = (item) => {
    // Xử lý xóa voucher
    console.log('Xóa voucher:', item)
  }

  const handleViewDetail = (item) => {
    navigate(`/seller/editvoucher/${item.id}`);
    console.log('Xem chi tiết voucher:', item)
  }

  const handleAddVoucher = () => {
    navigate("/seller/addvoucher");
    console.log('Thêm voucher mới')
  }

  const dummyVouchers = [
    {
      id:1,
      code: 'SUMMER2024',
      creatAt: '2024-06-01',
      startDate: '2024-06-01',
      endDate: '2024-08-31',
      mintotal: 200000,
      maxdiscount: 50000,
      discount: 20
    },
    {
      id:2,
      code: 'SPECIAL50',
      creatAt: '2024-05-01',
      startDate: '2024-05-01',
      endDate: '2024-05-31',
      mintotal: 500000,
      maxdiscount: 100000,
      discount: 50
    },
    {
      id:3,
      code: 'APRIL30',
      creatAt: '2024-04-01',
      startDate: '2024-04-01',
      endDate: '2024-04-30',
      mintotal: 300000,
      maxdiscount: 60000,
      discount: 30
    }
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="w-full mx-auto">

      <div className="flex items-center justify-between my-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Voucher</h1>
        <button
          onClick={() => handleAddVoucher()}
          className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-1.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H6a1 1 0 110-2h4V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          <span>Thêm</span>
        </button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Bộ lọc đơn voucher</h2>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-7 space-y-2">
            <label className="block text-sm font-medium text-gray-700" htmlFor="name-filter">
              Tên
            </label>
            <input
              type="text"
              id="name-filter"
              placeholder="Nhập tên khách hàng..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
            />
          </div>

          <div className="col-span-2 space-y-2">
            <label className="block text-sm font-medium text-gray-700" htmlFor="start-date">
              Từ ngày
            </label>
            <input
              type="date"
              id="start-date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
            />
          </div>

          <div className="col-span-2 space-y-2">
            <label className="block text-sm font-medium text-gray-700" htmlFor="end-date">
              Đến ngày
            </label>
            <input
              type="date"
              id="end-date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
            />
          </div>

          <div className="col-span-1 flex items-end">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-md transition duration-150 ease-in-out flex items-center justify-center space-x-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Lọc</span>
            </button>
          </div>
        </div>
      </div>

      {/* Danh sách vouchers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dummyVouchers.map((voucher, index) => (
          <VoucherCard 
            key={index} 
            item={voucher}
            onDelete={handleDelete}
            onViewDetail={handleViewDetail}
          />
        ))}
      </div>
    </div>
  )
}

export default Vouchers