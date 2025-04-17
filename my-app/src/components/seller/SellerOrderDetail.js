import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { formatCurrency } from '../../utils/Format';


const SellerOrderDetail = () => {
    const { orderId } = useParams();
    const [item, setItem] = useState(null); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 

    const navigate = useNavigate();
    const handleNavigate = () =>{
        navigate('/seller/orders')
    }

    const fetchOrderDetails = async (orderId) => {
        setLoading(true); 
        setError(null);
        try {
            const response = await axiosInstance.get(`/seller/order/${orderId}`);
            if (!response.data.status) {
                throw new Error(response.data.message || 'Không thể tải chi tiết đơn hàng');
            }
            setItem(response.data.data); 
        } catch (error) {
            console.error('Có vấn đề khi tải dữ liệu:', error);
            setError(error.message || 'Đã xảy ra lỗi khi tải chi tiết đơn hàng');
        } finally {
            setLoading(false); 
        }
    };

    useEffect(() => {
        if (orderId) {
            fetchOrderDetails(orderId); 
        }
    }, [orderId]);
if(item === null) {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
            <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-gray-500 mx-auto"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
              clipRule="evenodd"
            />
          </svg>
          <p className="mt-4 text-lg text-gray-700">Không tìm thấy đơn hàng</p>
          <button
            onClick={handleNavigate}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Quay lại danh sách đơn hàng
          </button>
            </div>
            
        </div>
    );
}
const statusConfig = {
    "Chờ duyệt": {
      color: "bg-amber-100 text-amber-800 border-amber-200",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    "Đã hủy": {
      color: "bg-red-100 text-red-800 border-red-200",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    "Đã duyệt": {
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    "Đang giao": {
      color: "bg-purple-100 text-purple-800 border-purple-200",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
        </svg>
      ),
    },
    "Đã nhận": {
      color: "bg-green-100 text-green-800 border-green-200",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path
            fillRule="evenodd"
            d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  }
    return (
        <div className="max-w-full">
            <div className="flex items-center justify-between mb-8 bg-white rounded-lg border border-gray-100 p-6">
                <h2 className="text-2xl font-bold text-gray-800">Chi tiết đơn hàng #{item?.orderId }</h2>
                <div className="flex flex-col items-end space-y-2">
                    <div
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-sm border ${
                        statusConfig[item.orderStatusName]?.color || "bg-gray-100 text-gray-800 border-gray-200"
                      }`}
                    >
                      {statusConfig[item.orderStatusName]?.icon || (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      <span className="font-medium">{item.orderStatusName || "Không xác định"}</span>
                    </div>
                </div>    
            </div>

            <div className="space-y-8">
                {/* Thông tin cơ bản */}
                <div className="bg-white rounded-lg border border-gray-100 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Thông tin khách hàng */}
                        <div className="border-r border-gray-100 pr-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                                Thông tin khách hàng
                            </h3>
                            <div className="space-y-3">
                                <p className="text-sm text-gray-700">{item?.fullName}</p>
                                <p className="text-sm text-gray-700">{item?.phone}</p>
                                <p className="text-sm text-gray-700">{item?.address}</p>
                            </div>
                        </div>

                        {/* Thông tin giao hàng */}
                        <div className="border-r border-gray-100 pr-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                                </svg>
                                Thông tin giao hàng
                            </h3>
                            <div className="space-y-3">
                                <p className="text-sm text-gray-700">Phương thức: Giao hang nhanh</p>
                                <p className="text-sm text-gray-700">Phí vận chuyển: {formatCurrency(item?.shippingFee)}</p>
                            </div>
                        </div>

                        {/* Thông tin thanh toán */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                Thông tin thanh toán
                            </h3>
                            <div className="space-y-3">
                                <p className="text-sm text-gray-700">Phương thức: {item?.paymentMethod}</p>
                                <p className="text-sm text-gray-700">Trạng thái: {item?.paymentStatus}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Danh sách sản phẩm */}
                <div className="bg-white rounded-lg bitem border-gray-100 p-6">
                    <h3 className="text-lg font-semibold mb-6 flex items-center text-gray-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                        </svg>
                        Danh sách sản phẩm
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                        Sản phẩm
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                        Số lượng
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-right text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                        Đơn giá
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-right text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                        Tổng tiền
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {/* Kiểm tra nếu item tồn tại và có orderItems */}
                                {item?.orderItems && item.orderItems.length > 0 && item.orderItems.map((product) => (
                                 
                                    <tr key={product.productId} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-16 w-16">
                                                    <img className="h-16 w-16 rounded-lg object-cover" src={product.productImage} alt={product.productName} />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{product.productName}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="text-sm text-gray-900">{product.quantityProduct}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="text-sm text-gray-900">{formatCurrency(product.priceProduct)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="text-sm text-gray-900">{formatCurrency(product.totalPriceProduct)}</div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Tổng tiền */}
                <div className='bg-white rounded-lg border border-gray-100 p-6'>
                    <div className="pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center text-base text-gray-700 mb-2">
                            <span>Tạm tính:</span>
                            <span>{formatCurrency(item?.totalPrice)}</span>
                        </div>
                        <div className="flex justify-between items-center text-base text-green-600 mb-2">
                            <span>Giảm giá:</span>
                            <span>-{formatCurrency(item?.totalDiscount)}</span>
                        </div>
                        <div className="flex justify-between items-center text-base text-gray-700 mb-2">
                            <span>Phí vận chuyển:</span>
                            <span>{formatCurrency(item?.shippingFee)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xl font-bold text-blue-600 mt-4 pt-4 border-t border-gray-200">
                            <span>Tổng cộng:</span>
                            <span>{formatCurrency(item?.total)}</span>
                        </div>
                    </div>
                </div>
            </div>
             <div className="mt-6">
         <button
             onClick={handleNavigate}
             className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
        >
          Quay lại
        </button>
      </div>
        </div>
    );
}



export default SellerOrderDetail;