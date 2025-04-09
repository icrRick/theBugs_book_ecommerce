import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';


const SellerOrderDetail = () => {
    const { orderId } = useParams();
    const [item, setItem] = useState(null); // Khởi tạo là null thay vì mảng rỗng
    const [loading, setLoading] = useState(true); // Thêm trạng thái loading
    const [error, setError] = useState(null); // Thêm trạng thái error

    const fetchOrderDetails = async (orderId) => {
        setLoading(true); // Bắt đầu tải dữ liệu
        setError(null); // Xóa lỗi cũ
        try {
            const response = await axiosInstance.get(`/user/order/${orderId}`);
            if (!response.data.status) {
                throw new Error(response.data.message || 'Không thể tải chi tiết đơn hàng');
            }
            setItem(response.data.data); // Cập nhật dữ liệu
        } catch (error) {
            console.error('Có vấn đề khi tải dữ liệu:', error);
            setError(error.message || 'Đã xảy ra lỗi khi tải chi tiết đơn hàng');
        } finally {
            setLoading(false); // Kết thúc tải dữ liệu
        }
    };

    useEffect(() => {
        if (orderId) {
            fetchOrderDetails(orderId); // Truyền orderId vào hàm
        }
    }, [orderId]);
if(item === null) {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 animate-spin text-gray-500" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8.009 8.009 0 0 1 12 20Z" />
                </svg>
                <p className="mt-4 text-lg text-gray-700">Không tìm thấy order</p>
            </div>
        </div>
    );
}
    return (
        <div className="max-w-full">
            <div className="flex items-center justify-between mb-8 bg-white rounded-lg border border-gray-100 p-6">
                <h2 className="text-2xl font-bold text-gray-800">Chi tiết đơn hàng #{item?.orderId }</h2>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadgeColor(item?.orderStatusName)}`}>
                    {item?.orderStatusName}
                </span>
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
                                <p className="text-sm text-gray-700">Phí vận chuyển: {item?.shippingFee}</p>
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
                                            <div className="text-sm text-gray-900">{product.priceProduct}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="text-sm text-gray-900">{product.totalPriceProduct}</div>
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
                            <span>{item?.totalPrice}</span>
                        </div>
                        <div className="flex justify-between items-center text-base text-green-600 mb-2">
                            <span>Giảm giá:</span>
                            <span>-{item?.totalDiscount}</span>
                        </div>
                        <div className="flex justify-between items-center text-base text-gray-700 mb-2">
                            <span>Phí vận chuyển:</span>
                            <span>{item?.shippingFee}</span>
                        </div>
                        <div className="flex justify-between items-center text-xl font-bold text-blue-600 mt-4 pt-4 border-t border-gray-200">
                            <span>Tổng cộng:</span>
                            <span>{item?.total}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const getStatusBadgeColor = (status) => {
    switch (status) {
        case 'Chờ duyệt':
            return 'bg-yellow-100 text-yellow-800';
        case 'Đã duyệt':
            return 'bg-blue-100 text-blue-800';
        case 'Đang giao':
            return 'bg-purple-100 text-purple-800';
        case 'Đã nhận':
            return 'bg-green-100 text-green-800';
        case 'Đã hủy':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

export default SellerOrderDetail;