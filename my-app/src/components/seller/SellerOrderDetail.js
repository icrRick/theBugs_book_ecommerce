import { useParams } from 'react-router-dom';

const SellerOrderDetail = () => {
    const { orderId } = useParams();

    // Dữ liệu mẫu
    const order = {
        id: 1,
        date: '2024-03-20',
        status: 'Đang giao',
        customerInfo: {
            name: 'Nguyễn Văn A',
            phone: '0909090909',
            address: '123 Đường ABC, Quận 1, TP.HCM'
        },
        shippingInfo: {
            method: 'Giao hàng nhanh',
            fee: '30.000đ'
        },
        paymentInfo: {
            method: 'Thanh toán tiền mặt',
            status: 'Đã thanh toán',
            total: '1.500.000đ',
            subtotal: '1.470.000đ',
            shippingFee: '30.000đ',
            discount: '50.000đ'
        },
        products: [
            {
                id: 1,
                name: 'Sản phẩm 1',
                image: 'https://via.placeholder.com/150',
                price: '500.000đ',
                quantity: 2,
                total: '1.000.000đ',
                status: 'Đang giao'
            },
            {
                id: 2,
                name: 'Sản phẩm 2',
                image: 'https://via.placeholder.com/150',
                price: '470.000đ',
                quantity: 1,
                total: '470.000đ',
                status: 'Đang giao'
            }
        ]
    };

    return (
        <div className="max-w-full">
            <div className="flex items-center justify-between mb-8 bg-white rounded-lg border border-gray-100 p-6">
                <h2 className="text-2xl font-bold text-gray-800">Chi tiết đơn hàng #{order.id}</h2>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadgeColor(order.status)}`}>
                    {order.status}
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
                                <p className="text-sm text-gray-700">{order.customerInfo.name}</p>
                                <p className="text-sm text-gray-700">{order.customerInfo.phone}</p>
                                <p className="text-sm text-gray-700">{order.customerInfo.address}</p>
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
                                <p className="text-sm text-gray-700">Phương thức: {order.shippingInfo.method}</p>
                                <p className="text-sm text-gray-700">Phí vận chuyển: {order.shippingInfo.fee}</p>
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
                                <p className="text-sm text-gray-700">Phương thức: {order.paymentInfo.method}</p>
                                <p className="text-sm text-gray-700">Trạng thái: {order.paymentInfo.status}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Danh sách sản phẩm */}
                <div className="bg-white rounded-lg border border-gray-100 p-6">
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
                                {order.products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-16 w-16">
                                                    <img className="h-16 w-16 rounded-lg object-cover" src={product.image} alt={product.name} />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="text-sm text-gray-900">{product.quantity}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="text-sm text-gray-900">{product.price}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="text-sm font-medium text-blue-600">{product.total}</div>
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
                            <span>{order.paymentInfo.subtotal}</span>
                        </div>
                        <div className="flex justify-between items-center text-base text-green-600 mb-2">
                            <span>Giảm giá:</span>
                            <span>-{order.paymentInfo.discount}</span>
                        </div>
                        <div className="flex justify-between items-center text-base text-gray-700 mb-2">
                            <span>Phí vận chuyển:</span>
                            <span>{order.paymentInfo.shippingFee}</span>
                        </div>
                        <div className="flex justify-between items-center text-xl font-bold text-blue-600 mt-4 pt-4 border-t border-gray-200">
                            <span>Tổng cộng:</span>
                            <span>{order.paymentInfo.total}</span>
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