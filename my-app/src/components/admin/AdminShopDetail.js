import React, { useEffect, useState } from 'react';

import axiosInstance from '../../utils/axiosInstance';
import { Link, useParams } from 'react-router-dom';

import Loading from '../../utils/Loading';
import { showErrorToast, showSuccessToast } from '../../utils/Toast';

const AdminShopDetail = () => {
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [selectedRejectReasons, setSelectedRejectReasons] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const { shopSlug } = useParams();

    // useEffect(() => {
    //     // Thêm overflow-hidden vào body khi modal mở
    //     if (showApproveModal || showRejectModal) {
    //         document.body.style.overflow = 'hidden';
    //     } else {
    //         document.body.style.overflow = 'unset';
    //     }

    //     // Cleanup function
    //     return () => {
    //         document.body.style.overflow = 'unset';
    //     };
    // }, [showApproveModal, showRejectModal]);

    const handleApprove = async () => {
        try {
            setIsLoading(true);
            const response = await axiosInstance.post(`/admin/shop/approve?shopSlug=${shopSlug}`);
            if (response.status === 200 && response.data.status === true) {
                showSuccessToast("Đã duyệt cửa hàng thành công!");
                fetchShopDetail(shopSlug);
            } else {
                showErrorToast("Có lỗi xảy ra khi duyệt cửa hàng!");
            }
        } catch (error) {
            console.error('Error approving product:', error);
            showErrorToast("Có lỗi xảy ra khi duyệt cửa hàng!");
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

        // Tạo mảng lý do từ chối
        let reasons = selectedRejectReasons.map(reason => {
            if (reason === 'other') {
                return rejectReason;
            }
            return reason;
        });

        try {
            setIsLoading(true);
            const response = await axiosInstance.post('/admin/shop/reject', {
                rejectCode: shopSlug,
                reasons: reasons
            });

            if (response.status === 200 && response.data.status === true) {
                showSuccessToast("Đã từ chối cửa hàng thành công!");
                fetchShopDetail(shopSlug);
            } else {
                showErrorToast(response.data.message || "Có lỗi xảy ra khi từ chối cửa hàng!");
            }
        } catch (error) {
            console.error('Error rejecting product:', error);
            showErrorToast("Có lỗi xảy ra khi từ chối cửa hàng!");
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

    const [shopDetail, setShopDetail] = useState({});
    const fetchShopDetail = async (shopSlug) => {
        try {
            const response = await axiosInstance.get(`/admin/shop/shopDetail?shopSlug=${shopSlug}`);
            if (response.status === 200 && response.data.status === true) {
                setShopDetail(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching product detail:', error);
        }
    };

    useEffect(() => {
        if (shopSlug) {
            fetchShopDetail(shopSlug);
        }
    }, [shopSlug]);

    return (
        <div className="my-4 bg-white rounded-lg shadow-sm overflow-hidden max-w-full">
            {isLoading && <Loading />}

            {/* Header */}
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
                            <Link to="/admin/shops" className="hover:text-blue-600 transition-colors">
                                Quản lý cửa hàng
                            </Link>
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                            <span className="text-gray-900 font-medium">{shopDetail?.shopName || 'Chi tiết cửa hàng'}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            {shopDetail.approve === null && (
                                <>
                                    <button
                                        onClick={() => setShowApproveModal(true)}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        Duyệt cửa hàng
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
                </div>
            </div>

            {/* Main Content */}
            <div className="p-4">
                {/* Banner Shop */}
                <div className='rounded-lg border border-gray-300 p-6 transition-all duration-300  overflow-hidden'>
                    {shopDetail?.banner ? (
                        <div className='relative w-full h-[400px] rounded-lg overflow-hidden shadow-sm flex items-center justify-center '>
                            <img
                                src={shopDetail.banner}
                                alt="Banner cửa hàng"
                                className="max-h-full max-w-full object-contain transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
                        </div>
                    ) : (
                        <div className="w-full h-[400px] bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-gray-500 text-sm">Chưa có ảnh banner</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    {/* Left Column - Thông tin chủ sở hữu */}
                    <div className="flex flex-col h-full">
                        <div className="flex-1 rounded-lg border border-gray-300 p-6 transition-all duration-300">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin chủ sở hữu</h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-1">
                                        <label className="text-sm font-medium text-gray-500">Họ và tên</label>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-sm text-gray-900">{shopDetail?.userFullName || 'Không có họ và tên'}</p>
                                    </div>
                                    <div className="col-span-1">
                                        <label className="text-sm font-medium text-gray-500">Email</label>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-sm text-gray-900">{shopDetail?.email || 'Không có email'}</p>
                                    </div>
                                    <div className="col-span-1">
                                        <label className="text-sm font-medium text-gray-500">Số điện thoại</label>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-sm text-gray-900">{shopDetail?.phone || 'Không có số điện thoại'}</p>
                                    </div>
                                    <div className="col-span-1">
                                        <label className="text-sm font-medium text-gray-500">CCCD</label>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-sm text-gray-900">{shopDetail?.cccd || 'Không có CCCD'}</p>
                                    </div>
                                    <div className="col-span-1">
                                        <label className="text-sm font-medium text-gray-500">Ngày sinh</label>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-sm text-gray-900">
                                            {shopDetail?.dob ? new Date(shopDetail.dob).toLocaleDateString('vi-VN') : 'Không có ngày sinh'}
                                        </p>
                                    </div>
                                    <div className="col-span-1">
                                        <label className="text-sm font-medium text-gray-500">Giới tính</label>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-sm text-gray-900">{shopDetail?.gender === null ? 'Không xác định' : shopDetail?.gender === true ? 'Nam' : 'Nữ'}</p>
                                    </div>
                                    <div className="col-span-1">
                                        <label className="text-sm font-medium text-gray-500">Địa chỉ</label>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-sm text-gray-900">{shopDetail?.address || 'Không có địa chỉ'}</p>
                                    </div>

                                </div>

                            </div>
                        </div>

                        <div className="mt-6 rounded-lg border p-6 border-gray-300 transition-all duration-300">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin tài khoản ngân hàng</h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-1">
                                        <label className="text-sm font-medium text-gray-500">Chủ tài khoản</label>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-sm text-gray-900">{shopDetail?.bankOwnerName || 'Không có chủ tài khoản'}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-1">
                                        <label className="text-sm font-medium text-gray-500">Số tài khoản</label>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-sm text-gray-900">{shopDetail?.bankOwnerNumber || 'Không có số tài khoản'}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-1">
                                        <label className="text-sm font-medium text-gray-500">Ngân hàng</label>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-sm text-gray-900">{shopDetail?.bankProvideName || 'Không có ngân hàng'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Thông tin cửa hàng */}
                    <div className="flex flex-col h-full">
                        {/* Shop Information Card */}
                        <div className="flex-1 rounded-lg border border-gray-300 p-6 transition-all duration-300">
                            <div className="flex items-center space-x-6">
                                <div className="flex-shrink-0">
                                    <div className="h-20 w-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg overflow-hidden">
                                        {shopDetail?.image ? (
                                            <img
                                                src={shopDetail.image}
                                                alt="Ảnh cửa hàng"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            shopDetail?.shopName?.charAt(0)
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-2xl font-bold text-gray-900 truncate">
                                        {shopDetail?.shopName || 'Không có tên cửa hàng'}
                                    </h2>
                                    <div className="mt-3 flex items-center space-x-6">
                                        <span className="flex items-center text-sm text-gray-500">
                                            <svg className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {shopDetail?.shopCreatAt ? new Date(shopDetail?.shopCreatAt).toLocaleDateString('vi-VN') : 'Không có ngày tạo'}
                                        </span>
                                        <span className="flex items-center text-sm text-gray-500">
                                            <svg className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {shopDetail?.verify ? 'Đã xác thực' : 'Chưa xác thực'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 rounded-lg border p-6 border-gray-300 transition-all duration-300">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Địa chỉ cửa hàng</h3>
                            <div className="grid grid-cols-1 gap-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 block mb-1">Họ tên</label>
                                            <p className="text-sm text-gray-900  p-2.5 rounded-md">{shopDetail?.addressFullName || 'Không có họ tên'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 block mb-1">Số điện thoại</label>
                                            <p className="text-sm text-gray-900  p-2.5 rounded-md">{shopDetail?.addressPhone || 'Không có số điện thoại'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 block mb-1">Tỉnh/Thành phố</label>
                                            <p className="text-sm text-gray-900  p-2.5 rounded-md">{shopDetail?.provinceName || 'Không có tỉnh/thành phố'}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 block mb-1">Quận/Huyện</label>
                                            <p className="text-sm text-gray-900  p-2.5 rounded-md">{shopDetail?.districtName || 'Không có quận/huyện'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 block mb-1">Phường/Xã</label>
                                            <p className="text-sm text-gray-900  p-2.5 rounded-md">{shopDetail?.wardName || 'Không có phường/xã'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 block mb-1">Địa chỉ chi tiết</label>
                                            <p className="text-sm text-gray-900  p-2.5 rounded-md">{shopDetail?.street || 'Không có địa chỉ'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Shop Status */}
                        <div className="mt-6 rounded-lg border p-6 border-gray-300 transition-all duration-300">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Trạng thái cửa hàng</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {/* Hoạt động */}
                                <div className={`p-4 rounded-lg border ${shopDetail?.status ? 'bg-green-50 border-green-200' : ' border-gray-200'}`}>
                                    <div className="flex items-center space-x-3">
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${shopDetail?.status ? 'bg-green-100' : 'bg-gray-100'}`}>
                                            <svg className={`h-5 w-5 ${shopDetail?.status ? 'text-green-600' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={shopDetail?.status ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Hoạt động</p>
                                            <p className={`text-sm ${shopDetail?.status ? 'text-green-600' : 'text-gray-600'}`}>
                                                {shopDetail?.status ? 'Đang hoạt động' : 'Chưa hoạt động'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Duyệt */}
                                <div className={`p-4 rounded-lg border ${shopDetail?.approve === true ? 'bg-green-50 border-green-200' :
                                    shopDetail?.approve === null ? 'bg-yellow-50 border-yellow-200' :
                                        'bg-red-50 border-red-200'}`}>
                                    <div className="flex items-center space-x-3">
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${shopDetail?.approve === true ? 'bg-green-100' :
                                            shopDetail?.approve === null ? 'bg-yellow-100' :
                                                'bg-red-100'}`}>
                                            <svg className={`h-5 w-5 ${shopDetail?.approve === true ? 'text-green-600' :
                                                shopDetail?.approve === null ? 'text-yellow-600' :
                                                    'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={
                                                    shopDetail?.approve === true ? "M5 13l4 4L19 7" :
                                                        shopDetail?.approve === null ? "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" :
                                                            "M6 18L18 6M6 6l12 12"
                                                } />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Trạng thái duyệt</p>
                                            <p className={`text-sm ${shopDetail?.approve === true ? 'text-green-600' :
                                                shopDetail?.approve === null ? 'text-yellow-600' :
                                                    'text-red-600'}`}>
                                                {shopDetail?.approve === true ? 'Đã xác nhận' :
                                                    shopDetail?.approve === null ? 'Chờ xác nhận' :
                                                        'Từ chối'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Kích hoạt */}
                                <div className={`p-4 rounded-lg border ${shopDetail?.active ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                    <div className="flex items-center space-x-3">
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${shopDetail?.active ? 'bg-green-100' : 'bg-red-100'}`}>
                                            <svg className={`h-5 w-5 ${shopDetail?.active ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={shopDetail?.active ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" : "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"} />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Kích hoạt</p>
                                            <p className={`text-sm ${shopDetail?.active ? 'text-green-600' : 'text-red-600'}`}>
                                                {shopDetail?.active ? 'Đang kích hoạt' : 'Bị tắt'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Shop Description */}
                <div className="mt-6 rounded-lg border border-gray-300 p-6 transition-all duration-300">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Mô tả cửa hàng</h3>
                    <div className="prose max-w-none">
                        {shopDetail?.description ? (
                            <p className="text-gray-600 whitespace-pre-line leading-relaxed">{shopDetail.description}</p>
                        ) : (
                            <p className="text-gray-400 italic">Không có mô tả</p>
                        )}
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
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Xác nhận duyệt cửa hàng</h3>
                            <p className="text-sm text-gray-500 mb-4">
                                Bạn có chắc chắn muốn duyệt cửa hàng <span className="font-medium">"{shopDetail?.shopName || ''}"</span> không?
                            </p>
                            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                <div className="flex space-x-2">
                                    <svg className="h-5 w-5 text-yellow-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <div className="flex-1 text-left">
                                        <p className="font-medium text-yellow-700 text-sm">Lưu ý quan trọng:</p>
                                        <ul className="mt-1 text-sm text-yellow-600 list-disc list-inside space-y-1">
                                            <li>Cửa hàng sẽ được hiển thị công khai trên hệ thống</li>
                                            <li>Khách hàng có thể tìm thấy và mua sắm từ cửa hàng</li>
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
                                    <h3 className="text-lg font-medium text-gray-900">Từ chối cửa hàng</h3>
                                </div>
                            </div>

                            <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-4">
                                <div className="flex space-x-2">
                                    <svg className="h-5 w-5 text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <div className="flex-1">
                                        <p className="text-sm text-red-800">
                                            Bạn đang từ chối cửa hàng <span className="font-medium">"{shopDetail?.shopName || ''}"</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Lý do từ chối (có thể chọn nhiều)
                                    </label>
                                    <div className="space-y-3">
                                        <div className="flex items-start">
                                            <input
                                                id="reason-info"
                                                name="reject-reason"
                                                type="checkbox"
                                                className="h-4 w-4 mt-1 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                                value="Thông tin cửa hàng không đầy đủ hoặc không chính xác"
                                                onChange={() => handleReasonChange("Thông tin cửa hàng không đầy đủ hoặc không chính xác")}
                                                checked={selectedRejectReasons.includes("Thông tin cửa hàng không đầy đủ hoặc không chính xác")}
                                            />
                                            <label htmlFor="reason-info" className="ml-3 text-sm text-gray-700">
                                                Thông tin cửa hàng không đầy đủ hoặc không chính xác
                                            </label>
                                        </div>

                                        <div className="flex items-start">
                                            <input
                                                id="reason-images"
                                                name="reject-reason"
                                                type="checkbox"
                                                className="h-4 w-4 mt-1 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                                value="Hình ảnh không đạt yêu cầu hoặc không phù hợp"
                                                onChange={() => handleReasonChange("Hình ảnh không đạt yêu cầu hoặc không phù hợp")}
                                                checked={selectedRejectReasons.includes("Hình ảnh không đạt yêu cầu hoặc không phù hợp")}
                                            />
                                            <label htmlFor="reason-images" className="ml-3 text-sm text-gray-700">
                                                Hình ảnh không đạt yêu cầu hoặc không phù hợp
                                            </label>
                                        </div>

                                        <div className="flex items-start">
                                            <input
                                                id="reason-policy"
                                                name="reject-reason"
                                                type="checkbox"
                                                className="h-4 w-4 mt-1 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                                value="Vi phạm chính sách của sàn thương mại"
                                                onChange={() => handleReasonChange("Vi phạm chính sách của sàn thương mại")}
                                                checked={selectedRejectReasons.includes("Vi phạm chính sách của sàn thương mại")}
                                            />
                                            <label htmlFor="reason-policy" className="ml-3 text-sm text-gray-700">
                                                Vi phạm chính sách của sàn thương mại
                                            </label>
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
                                            <label htmlFor="reason-other" className="ml-3 text-sm text-gray-700">
                                                Lý do khác
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {selectedRejectReasons.includes('other') && (
                                    <div>
                                        <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                                            Chi tiết lý do
                                        </label>
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

export default AdminShopDetail;