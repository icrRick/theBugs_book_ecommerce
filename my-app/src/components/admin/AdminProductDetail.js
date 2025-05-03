import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { Link, useParams } from 'react-router-dom';
import Loading from '../../utils/Loading';
import { showErrorToast, showSuccessToast } from '../../utils/Toast';
import { formatCurrency } from '../../utils/Format';

const AdminProductDetail = () => {
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [selectedRejectReasons, setSelectedRejectReasons] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const { productCode } = useParams();

    const handleApprove = async () => {
        try {
            setIsLoading(true);
            const response = await axiosInstance.post(`/admin/product/approve?productCode=${productCode}`);
            if (response.status === 200 && response.data.status === true) {
                showSuccessToast("Đã duyệt sản phẩm thành công!");
                fetchProductDetail(productCode);
            } else {
                showErrorToast("Có lỗi xảy ra khi duyệt sản phẩm!");
            }
        } catch (error) {
            console.error('Error approving product:', error);
            showErrorToast("Có lỗi xảy ra khi duyệt sản phẩm!");
        } finally {
            setIsLoading(false);
            setShowApproveModal(false);
        }
    };

    const handleReject = async () => {
        if (selectedRejectReasons.length === 0 || (selectedRejectReasons.includes('other') && !rejectReason)) {
            showErrorToast("Vui lòng chọn ít nhất một lý do từ chối!");
            return;
        }

        let reasons = selectedRejectReasons.map(reason => {
            if (reason === 'other') {
                return rejectReason;
            }
            return reason;
        });

        try {
            setIsLoading(true);
            const response = await axiosInstance.post('/admin/product/reject', {
                rejectCode: productCode,
                reasons: reasons
            });

            if (response.status === 200 && response.data.status === true) {
                showSuccessToast("Đã từ chối sản phẩm thành công!");
                fetchProductDetail(productCode);
            } else {
                showErrorToast(response.data.message || "Có lỗi xảy ra khi từ chối sản phẩm!");
            }
        } catch (error) {
            console.error('Error rejecting product:', error);
            showErrorToast("Có lỗi xảy ra khi từ chối sản phẩm!");
        } finally {
            setIsLoading(false);
            setShowRejectModal(false);
            setRejectReason('');
            setSelectedRejectReasons([]);
        }
    };

    const handleReasonChange = (reason) => {
        setSelectedRejectReasons(prev => {
            if (prev.includes(reason)) {
                return prev.filter(r => r !== reason);
            } else {
                return [...prev, reason];
            }
        });
    };

    const [productDetail, setProductDetail] = useState({});
    const fetchProductDetail = async (productCode) => {
        try {
            const response = await axiosInstance.get(`/admin/product/productDetail?productCode=${productCode}`);
            if (response.status === 200 && response.data.status === true) {
                setProductDetail(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching product detail:', error);
        }
    };

    useEffect(() => {
        if (productCode) {
            fetchProductDetail(productCode);
        }
    }, [productCode]);

    return (

        <div className="my-4 bg-white rounded-lg shadow-sm overflow-hidden max-w-full">
            {isLoading && <Loading />}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 text-sm text-gray-600">
                            <Link to="/admin/dashboard" className="hover:text-blue-600 transition-colors">
                                Trang chủ
                            </Link>
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                            <Link to="/admin/products" className="hover:text-blue-600 transition-colors">
                                Quản lý sản phẩm
                            </Link>
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                            <span className="text-gray-900 font-medium">{productDetail?.productCode || 'Chi tiết sản phẩm'}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            {productDetail.approve === null && (
                                <>
                                    <button
                                        onClick={() => setShowApproveModal(true)}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        Duyệt sản phẩm
                                    </button>
                                    <button
                                        onClick={() => setShowRejectModal(true)}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Từ chối
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Chi tiết sản phẩm {productDetail?.productCode}</h1>
                    <p className="text-gray-500 text-sm mt-1">Quản lý thông tin chi tiết sản phẩm</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="flex flex-col h-full">
                        <div className="flex-1 rounded-lg border border-gray-300 p-6 transition-all duration-300">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                                <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Thông tin sản phẩm
                            </h3>
                            <div className="grid grid-cols-12 gap-4">
                                <div className="col-span-4">
                                    <p className="text-sm font-medium text-gray-500">Tên sản phẩm</p>
                                </div>
                                <div className="col-span-8">
                                    <p className="text-sm text-gray-900 font-medium">{productDetail?.name || 'Không có tên sản phẩm'}</p>
                                </div>
                                <div className="col-span-4">
                                    <p className="text-sm font-medium text-gray-500">Mã sản phẩm</p>
                                </div>
                                <div className="col-span-8">
                                    <p className="text-sm text-gray-900 font-medium">{productDetail?.productCode || 'Không có mã sản phẩm'}</p>
                                </div>
                                <div className="col-span-4">
                                    <p className="text-sm font-medium text-gray-500">Giá</p>
                                </div>
                                <div className="col-span-8">
                                    <p className="text-sm text-gray-900 font-medium">
                                        {formatCurrency(productDetail?.price)}
                                    </p>
                                </div>
                                <div className="col-span-4">
                                    <p className="text-sm font-medium text-gray-500">Số lượng</p>
                                </div>
                                <div className="col-span-8">
                                    <p className="text-sm text-gray-900 font-medium">
                                        {productDetail?.quantity}
                                    </p>
                                </div>
                                <div className="col-span-4">
                                    <p className="text-sm font-medium text-gray-500">Khối lượng</p>
                                </div>
                                <div className="col-span-8">
                                    <p className="text-sm text-gray-900 font-medium">{productDetail?.weight || 0}g</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 rounded-lg border p-6 border-gray-300 transition-all duration-300">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                Thông tin cửa hàng
                            </h3>
                            <div className="grid grid-cols-12 gap-4">
                                <div className="col-span-4">
                                    <p className="text-sm font-medium text-gray-500">Tên cửa hàng</p>
                                </div>
                                <div className="col-span-8">
                                    <p className="text-sm text-gray-900 font-medium">{productDetail?.shop?.shopName || 'Không có tên cửa hàng'}</p>
                                </div>
                                <div className="col-span-4">
                                    <p className="text-sm font-medium text-gray-500">Trạng thái xác thực</p>
                                </div>
                                <div className="col-span-8">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${productDetail?.shop?.verify
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {productDetail?.shop?.verify ? 'Đã xác thực' : 'Chưa xác thực'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col h-full">
                        <div className="flex-1 rounded-lg border border-gray-300 p-6 transition-all duration-300">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                                <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                Thông tin bổ sung
                            </h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="col-span-4">
                                        <p className="text-sm font-medium text-gray-500">Thể loại</p>
                                    </div>
                                    <div className="col-span-8">
                                        <div className="flex flex-wrap gap-2">
                                            {productDetail?.genres?.map(genre => (
                                                <span key={genre.id} className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                                    {genre.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="col-span-4">
                                        <p className="text-sm font-medium text-gray-500">Tác giả</p>
                                    </div>
                                    <div className="col-span-8">
                                        <div className="flex flex-wrap gap-2">
                                            {productDetail?.authors?.map(author => (
                                                <span key={author.id} className="px-2.5 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                                                    {author.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="col-span-4">
                                        <p className="text-sm font-medium text-gray-500">Nhà xuất bản</p>
                                    </div>
                                    <div className="col-span-8">
                                        <p className="text-sm text-gray-900 font-medium">{productDetail?.publisher?.name || 'Không có nhà xuất bản'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 rounded-lg border p-6 border-gray-300 transition-all duration-300">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Trạng thái sản phẩm
                            </h3>
                            <div className="grid grid-cols-12 gap-4">
                                <div className="col-span-4">
                                    <p className="text-sm font-medium text-gray-500">Trạng thái duyệt</p>
                                </div>
                                <div className="col-span-8">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${productDetail?.approve === null
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : productDetail?.approve === true
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                        }`}>
                                        {productDetail?.approve === null ? 'Chưa duyệt' : productDetail?.approve === true ? 'Đã duyệt' : 'Từ chối'}
                                    </span>
                                </div>
                                {
                                    productDetail?.status === true && (
                                        <>
                                            <div className="col-span-4">
                                                <p className="text-sm font-medium text-gray-500">Trạng thái khóa</p>
                                            </div>
                                            <div className="col-span-8">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    Đã khóa
                                                </span>
                                            </div>
                                        </>
                                    )
                                }

                                <div className="col-span-4">
                                    <p className="text-sm font-medium text-gray-500">Trạng thái hoạt động</p>
                                </div>
                                <div className="col-span-8">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${productDetail?.active === true
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                        }`}>
                                        {productDetail?.active === true ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>

                {/* Product Description */}
                <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                        Mô tả sản phẩm
                    </h3>
                    <div className="prose max-w-none">
                        <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                            {productDetail?.description || 'Không có mô tả'}
                        </p>
                    </div>
                </div>
            </div>
            {/* Modal xác nhận duyệt */}
            {showApproveModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
                    <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
                        <div className="text-center mb-6">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Xác nhận duyệt sản phẩm</h3>
                            <p className="text-sm text-gray-500 mb-4">
                                Bạn có chắc chắn muốn duyệt sản phẩm <span className="font-medium">"{productDetail?.name || ''}"</span> không?
                            </p>
                            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                <div className="flex space-x-2">
                                    <svg className="h-5 w-5 text-yellow-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <div className="flex-1 text-left">
                                        <p className="font-medium text-yellow-700 text-sm">Lưu ý quan trọng:</p>
                                        <ul className="mt-1 text-sm text-yellow-600 list-disc list-inside space-y-1">
                                            <li>Sản phẩm sẽ được hiển thị công khai trên hệ thống</li>
                                            <li>Khách hàng có thể tìm thấy và mua sản phẩm</li>
                                            <li>Hành động này không thể hoàn tác sau khi xác nhận</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowApproveModal(false)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all duration-200"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleApprove}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-all duration-200"
                            >
                                Xác nhận duyệt
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal từ chối với form */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
                    <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4 transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto">
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-2">
                                    <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                                        <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900">Từ chối sản phẩm</h3>
                                </div>
                            </div>

                            <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-4">
                                <div className="flex space-x-2">
                                    <svg className="h-5 w-5 text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <div className="flex-1">
                                        <p className="text-sm text-red-800">
                                            Bạn đang từ chối sản phẩm <span className="font-medium">"{productDetail?.name || ''}"</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <form className="space-y-4">
                                <div>
                                    <p className="block text-sm font-medium text-gray-700 mb-2">
                                        Lý do từ chối (có thể chọn nhiều)
                                    </p>
                                    <div className="space-y-3">
                                        <div className="flex items-start">
                                            <input
                                                id="reason-images"
                                                name="reject-reason"
                                                type="checkbox"
                                                className="h-4 w-4 mt-1 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                                value="Hình ảnh sản phẩm không rõ ràng hoặc thiếu hình ảnh"
                                                onChange={() => handleReasonChange("Hình ảnh sản phẩm không rõ ràng hoặc thiếu hình ảnh")}
                                                checked={selectedRejectReasons.includes("Hình ảnh sản phẩm không rõ ràng hoặc thiếu hình ảnh")}
                                            />
                                            <p htmlFor="reason-images" className="ml-3 text-sm text-gray-700">
                                                Hình ảnh sản phẩm không rõ ràng hoặc thiếu hình ảnh
                                            </p>
                                        </div>

                                        <div className="flex items-start">
                                            <input
                                                id="reason-description"
                                                name="reject-reason"
                                                type="checkbox"
                                                className="h-4 w-4 mt-1 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                                value="Mô tả sản phẩm chưa đầy đủ hoặc không chính xác"
                                                onChange={() => handleReasonChange("Mô tả sản phẩm chưa đầy đủ hoặc không chính xác")}
                                                checked={selectedRejectReasons.includes("Mô tả sản phẩm chưa đầy đủ hoặc không chính xác")}
                                            />
                                            <p htmlFor="reason-description" className="ml-3 text-sm text-gray-700">
                                                Mô tả sản phẩm chưa đầy đủ hoặc không chính xác
                                            </p>
                                        </div>

                                        <div className="flex items-start">
                                            <input
                                                id="reason-price"
                                                name="reject-reason"
                                                type="checkbox"
                                                className="h-4 w-4 mt-1 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                                value="Giá sản phẩm không hợp lý hoặc thiếu thông tin về giá"
                                                onChange={() => handleReasonChange("Giá sản phẩm không hợp lý hoặc thiếu thông tin về giá")}
                                                checked={selectedRejectReasons.includes("Giá sản phẩm không hợp lý hoặc thiếu thông tin về giá")}
                                            />
                                            <p htmlFor="reason-price" className="ml-3 text-sm text-gray-700">
                                                Giá sản phẩm không hợp lý hoặc thiếu thông tin về giá
                                            </p>
                                        </div>

                                        <div className="flex items-start">
                                            <input
                                                id="reason-policy"
                                                name="reject-reason"
                                                type="checkbox"
                                                className="h-4 w-4 mt-1 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                                value="Sản phẩm thuộc danh mục bị cấm hoặc vi phạm chính sách"
                                                onChange={() => handleReasonChange("Sản phẩm thuộc danh mục bị cấm hoặc vi phạm chính sách")}
                                                checked={selectedRejectReasons.includes("Sản phẩm thuộc danh mục bị cấm hoặc vi phạm chính sách")}
                                            />
                                            <p htmlFor="reason-policy" className="ml-3 text-sm text-gray-700">
                                                Sản phẩm thuộc danh mục bị cấm hoặc vi phạm chính sách
                                            </p>
                                        </div>

                                        <div className="flex items-start">
                                            <input
                                                id="reason-other"
                                                name="reject-reason"
                                                type="checkbox"
                                                className="h-4 w-4 mt-1 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                                value="other"
                                                onChange={() => handleReasonChange("other")}
                                                checked={selectedRejectReasons.includes("other")}
                                            />
                                            <p htmlFor="reason-other" className="ml-3 text-sm text-gray-700">
                                                Lý do khác
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {selectedRejectReasons.includes('other') && (
                                    <div>
                                        <p htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                                            Chi tiết lý do
                                        </p>
                                        <textarea
                                            id="reason"
                                            value={rejectReason}
                                            onChange={(e) => setRejectReason(e.target.value)}
                                            rows={4}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                                            placeholder="Vui lòng nhập chi tiết lý do từ chối..."
                                            required
                                        />
                                    </div>
                                )}
                            </form>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setSelectedRejectReasons([]);
                                    setRejectReason('');
                                }}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all duration-200"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleReject}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-all duration-200"
                                disabled={selectedRejectReasons.length === 0 || (selectedRejectReasons.includes('other') && !rejectReason)}
                            >
                                Xác nhận từ chối
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProductDetail;