import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/zoom";
import "swiper/css/pagination";
import { FreeMode, Navigation, Thumbs, Zoom, Pagination } from 'swiper/modules';
import axiosInstance from '../../utils/axiosInstance';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from '../../utils/Loading';
import { showErrorToast, showSuccessToast } from '../../utils/Toast';

const AdminProductDetail = () => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [showImageModal, setShowImageModal] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [selectedRejectReasons, setSelectedRejectReasons] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const { productCode } = useParams();

    const showSuccessToast = (message) => {
        toast.success(message);
    };

    const showErrorToast = (message) => {
        toast.error(message);
    };

    const handleImageClick = (index) => {
        setCurrentImageIndex(index);
        setShowImageModal(true);
    };

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

        // Tạo mảng lý do từ chối
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
        <>
            {isLoading && <Loading />}
            <div className="my-4 bg-white max-w-full">
                {/* Header */}
                <div className="bg-white shadow-sm border-b border-gray-200">
                    <div className="w-full p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <a href="#" className="hover:text-blue-600 transition-colors duration-200">Trang chủ</a>
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                                <Link to="/admin/products" className="hover:text-blue-600 transition-colors duration-200">Quản lý sản phẩm</Link>
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                                <span className="text-gray-900 font-medium truncate max-w-xs">{productDetail?.name || ''}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                {productDetail.approve === null ? (
                                    <>
                                        <button
                                            onClick={() => setShowApproveModal(true)}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Duyệt sản phẩm</span>
                                        </button>

                                        <button
                                            onClick={() => setShowRejectModal(true)}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            <span>Từ chối</span>
                                        </button>
                                    </>
                                ) : null}
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Chi tiết sản phẩm {productDetail?.name}</h1>
                                <p className="text-gray-500 text-xs sm:text-sm mt-1">Chi tiết sản phẩm</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="w-full p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                        {/* Cột trái - Thông tin shop và Hình ảnh sản phẩm */}
                        <div className="lg:col-span-5 flex flex-col gap-4">
                            {/* Thông tin shop */}
                            <div className="rounded-lg border border-gray-300 p-6 transition-all duration-300">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="relative group">
                                            <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white border-2 border-blue-300 transition-all duration-300">
                                                <span className="text-xl font-medium">{productDetail?.shop?.shopName?.charAt(0)}</span>
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                                {productDetail?.shop?.verify ? (
                                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 0v3m0-3h3m-3 0H9m1-9a2 2 0 00-2 2v1h10V8a2 2 0 00-2-2H10z" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">{productDetail?.shop?.shopName || ''}</div>
                                            <div className="text-sm text-gray-500 flex items-center space-x-1">
                                                <span className="flex items-center">
                                                    <svg className="w-4 h-4 text-blue-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                    {productDetail?.shop?.verify ? 'Đã xác thực' : 'Chưa xác thực'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <Link to={`/admin/shop/${productDetail?.shop?.id}`} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-all duration-200 flex items-center space-x-2 border-2 border-blue-300">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>Xem shop</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Hình ảnh sản phẩm */}
                            <div className="rounded-lg border border-gray-300 p-4 transition-all duration-300 flex-grow">
                                <div className="flex items-center mb-3">
                                    <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <h3 className="text-lg font-semibold text-gray-800">Hình ảnh sản phẩm</h3>
                                </div>

                                {!productDetail?.images || productDetail.images.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-[300px] bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className="text-gray-500">Chưa có hình ảnh nào</p>
                                    </div>
                                ) : (
                                    <div className="w-full">
                                        <Swiper
                                            style={{
                                                "--swiper-navigation-color": "#3b82f6",
                                                "--swiper-pagination-color": "#3b82f6",
                                            }}
                                            loop={productDetail.images.length > 1}
                                            spaceBetween={10}
                                            navigation={true}
                                            thumbs={{ swiper: thumbsSwiper }}
                                            modules={[FreeMode, Navigation, Thumbs, Zoom, Pagination]}
                                            zoom={true}
                                            className="h-[400px] w-full rounded-lg overflow-hidden bg-gray-50 border-2 border-gray-300"
                                        >
                                            {productDetail?.images && productDetail?.images.map((img, index) => (
                                                <SwiperSlide key={img.id} onClick={() => handleImageClick(index)}>
                                                    <div className="swiper-zoom-container w-full h-full cursor-zoom-in group flex items-center justify-center">
                                                        <img
                                                            src={img?.name}
                                                            alt={`${productDetail?.name} - Hình ${index + 1}`}
                                                            className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                                                            loading="lazy"
                                                        />
                                                    </div>
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>

                                        {productDetail?.images?.length > 1 && (
                                            <div className="mt-4">
                                                <Swiper
                                                    onSwiper={setThumbsSwiper}
                                                    loop={false}
                                                    spaceBetween={8}
                                                    slidesPerView={5}
                                                    freeMode={true}
                                                    watchSlidesProgress={true}
                                                    modules={[FreeMode, Navigation, Thumbs]}
                                                    className="h-30"
                                                >
                                                    {productDetail?.images?.length > 0 && productDetail?.images.map((img, index) => (
                                                        <SwiperSlide key={img.id}>
                                                            <div className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-300 ${currentImageIndex === index
                                                                ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50 shadow-md transform scale-80'
                                                                : 'border-transparent hover:border-blue-500 hover:shadow-md hover:scale-80'
                                                                }`}>
                                                                <img
                                                                    src={img?.name}
                                                                    alt={`Thumbnail ${index + 1}`}
                                                                    className="w-full h-full object-cover aspect-square"
                                                                    loading="lazy"
                                                                />
                                                            </div>
                                                        </SwiperSlide>
                                                    ))}
                                                </Swiper>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Cột phải - Thông tin sản phẩm */}
                        <div className="lg:col-span-7 flex flex-col gap-4">
                            <div className="rounded-lg border border-gray-300 p-6 transition-all duration-300 h-full">
                                <div className="border-b pb-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h1 className="text-3xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200">{productDetail?.name || ''}</h1>
                                    </div>
                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                        <div className="flex items-center space-x-1 group">
                                            <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                            </svg>
                                            <span className="group-hover:text-blue-600 transition-colors duration-200">Mã SP: {productDetail?.productCode || ''}</span>
                                        </div>
                                        <span>•</span>
                                        <div className="flex items-center space-x-1 group">
                                            <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                            </svg>
                                            <span className="group-hover:text-blue-600 transition-colors duration-200">Khối lượng: {productDetail?.weight || 0}g</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="py-4 border-b">
                                    <div className="flex items-baseline group">
                                        <span className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                                            {productDetail?.price ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(productDetail?.price) : ''}
                                        </span>
                                        <span className="ml-2 text-sm text-gray-500">/ cuốn</span>
                                    </div>
                                </div>

                                <div className="space-y-6 mt-4">
                                    <div className="mt-6">
                                        <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                            <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                            </svg>
                                            Thể loại
                                        </label>
                                        <div className="flex flex-wrap gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                            {productDetail?.genres && productDetail?.genres.length > 0 ?
                                                productDetail?.genres.map(genre => (
                                                    <span key={genre.id} className="px-3 py-1.5 bg-white text-blue-600 rounded-full text-sm font-medium hover:bg-blue-100 transition-all duration-200 cursor-pointer transform hover:scale-105 border border-blue-200">
                                                        {genre.name}
                                                    </span>
                                                )) :
                                                <span className="text-sm text-gray-500">Không có thể loại</span>
                                            }
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                            <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Tác giả
                                        </label>
                                        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            {productDetail?.authors && productDetail?.authors.length > 0 ?
                                                productDetail?.authors.map(author => (
                                                    <span key={author.id} className="px-3 py-1.5 bg-white text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-all duration-200 cursor-pointer transform hover:scale-105 border border-gray-300 flex items-center space-x-1">
                                                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                        <span>{author.name}</span>
                                                    </span>
                                                )) :
                                                <span className="text-sm text-gray-500">Không có tác giả</span>
                                            }
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                            <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                            Nhà xuất bản
                                        </label>
                                        <div className="flex items-center space-x-2 bg-green-50 px-4 py-3 rounded-lg hover:bg-green-100 transition-colors duration-200 cursor-pointer border border-green-200">
                                            <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                            </div>
                                            <span className="text-gray-900 font-medium group-hover:text-blue-600 transition-colors duration-200">{productDetail?.publisher?.name || 'Không có thông tin'}</span>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Trạng thái sản phẩm</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            {/* Hoạt động */}
                                            <div className={`p-4 rounded-lg border ${productDetail?.status ? 'bg-green-50 border-green-200' : ' border-gray-200'}`}>
                                                <div className="flex items-center space-x-3">
                                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${productDetail?.status ? 'bg-green-100' : 'bg-gray-100'}`}>
                                                        <svg className={`h-5 w-5 ${productDetail?.status ? 'text-green-600' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={productDetail?.status ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">Hoạt động</p>
                                                        <p className={`text-sm ${productDetail?.status ? 'text-green-600' : 'text-gray-600'}`}>
                                                            {productDetail?.status ? 'Đang hoạt động' : 'Chưa hoạt động'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Duyệt */}
                                            <div className={`p-4 rounded-lg border ${productDetail?.approve === true ? 'bg-green-50 border-green-200' :
                                                productDetail?.approve === null ? 'bg-yellow-50 border-yellow-200' :
                                                    'bg-red-50 border-red-200'}`}>
                                                <div className="flex items-center space-x-3">
                                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${productDetail?.approve === true ? 'bg-green-100' :
                                                        productDetail?.approve === null ? 'bg-yellow-100' :
                                                            'bg-red-100'}`}>
                                                        <svg className={`h-5 w-5 ${productDetail?.approve === true ? 'text-green-600' :
                                                            productDetail?.approve === null ? 'text-yellow-600' :
                                                                'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={
                                                                productDetail?.approve === true ? "M5 13l4 4L19 7" :
                                                                    productDetail?.approve === null ? "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" :
                                                                        "M6 18L18 6M6 6l12 12"
                                                            } />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">Trạng thái duyệt</p>
                                                        <p className={`text-sm ${productDetail?.approve === true ? 'text-green-600' :
                                                            productDetail?.approve === null ? 'text-yellow-600' :
                                                                'text-red-600'}`}>
                                                            {productDetail?.approve === true ? 'Đã xác nhận' :
                                                                productDetail?.approve === null ? 'Chờ xác nhận' :
                                                                    'Từ chối'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Kích hoạt */}
                                            <div className={`p-4 rounded-lg border ${productDetail?.active ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                                <div className="flex items-center space-x-3">
                                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${productDetail?.active ? 'bg-green-100' : 'bg-red-100'}`}>
                                                        <svg className={`h-5 w-5 ${productDetail?.active ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={productDetail?.active ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" : "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"} />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">Kích hoạt</p>
                                                        <p className={`text-sm ${productDetail?.active ? 'text-green-600' : 'text-red-600'}`}>
                                                            {productDetail?.active ? 'Đang kích hoạt' : 'Bị tắt'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mô tả sản phẩm */}
                    <div className="rounded-lg border border-gray-300 p-6 transition-all duration-300 my-4">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 hover:text-blue-600 transition-colors duration-200 flex items-center">
                            <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                            </svg>
                            <span>Mô tả sản phẩm</span>
                        </h2>
                        <div className="prose max-w-none text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200">
                            {productDetail?.description ? (
                                <p className="whitespace-pre-line">{productDetail.description}</p>
                            ) : (
                                <p className="text-gray-500 italic">Không có mô tả cho sản phẩm này.</p>
                            )}
                        </div>
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
                            <p className="text-sm text-gray-500 mb-2">
                                Bạn có chắc chắn muốn duyệt sản phẩm "{productDetail?.name || ''}" không?
                            </p>
                            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-sm">
                                <p className="font-medium text-yellow-700">Lưu ý quan trọng:</p>
                                <p className="text-yellow-600">
                                    Sau khi duyệt, sản phẩm sẽ xuất hiện trên cửa hàng và có thể được khách hàng mua.
                                    <span className="font-bold"> Bạn sẽ không thể hủy duyệt sản phẩm sau khi xác nhận.</span>
                                </p>
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
                    <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
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
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Lý do từ chối (có thể chọn nhiều)
                                    </label>
                                    <div className="space-y-2">
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
                                            <label htmlFor="reason-images" className="ml-3 text-sm text-gray-700">
                                                Hình ảnh sản phẩm không rõ ràng hoặc thiếu hình ảnh
                                            </label>
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
                                            <label htmlFor="reason-description" className="ml-3 text-sm text-gray-700">
                                                Mô tả sản phẩm chưa đầy đủ hoặc không chính xác
                                            </label>
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
                                            <label htmlFor="reason-price" className="ml-3 text-sm text-gray-700">
                                                Giá sản phẩm không hợp lý hoặc thiếu thông tin về giá
                                            </label>
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
                                            <label htmlFor="reason-policy" className="ml-3 text-sm text-gray-700">
                                                Sản phẩm thuộc danh mục bị cấm hoặc vi phạm chính sách
                                            </label>
                                        </div>

                                        <div className="flex items-start">
                                            <input
                                                id="reason-duplicate"
                                                name="reject-reason"
                                                type="checkbox"
                                                className="h-4 w-4 mt-1 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                                value="Thông tin sản phẩm bị trùng lặp với các sản phẩm khác"
                                                onChange={() => handleReasonChange("Thông tin sản phẩm bị trùng lặp với các sản phẩm khác")}
                                                checked={selectedRejectReasons.includes("Thông tin sản phẩm bị trùng lặp với các sản phẩm khác")}
                                            />
                                            <label htmlFor="reason-duplicate" className="ml-3 text-sm text-gray-700">
                                                Thông tin sản phẩm bị trùng lặp với các sản phẩm khác
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
                                            placeholder="Nhập chi tiết lý do từ chối sản phẩm..."
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

            {/* Modal xem ảnh đầy đủ */}
            {showImageModal && (
                <div
                    className="fixed inset-0 z-50 bg-black flex items-center justify-center"
                    onClick={() => setShowImageModal(false)}
                >
                    <div className="relative w-full max-w-5xl px-4">
                        <button
                            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 bg-black p-2 rounded-full transition-all duration-300 hover:bg-opacity-70 hover:scale-110"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowImageModal(false);
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="text-center mb-2">
                            <h3 className="text-white text-lg font-semibold">
                                {productDetail?.name} - Hình {currentImageIndex + 1}/{productDetail?.images?.length}
                            </h3>
                        </div>
                        <Swiper
                            initialSlide={currentImageIndex}
                            navigation={{
                                nextEl: '.swiper-button-next-custom',
                                prevEl: '.swiper-button-prev-custom',
                            }}
                            pagination={{
                                clickable: true,
                                dynamicBullets: true,
                            }}
                            modules={[Navigation, Zoom, Pagination]}
                            zoom={{
                                maxRatio: 5,
                                minRatio: 1
                            }}
                            className="w-full rounded-lg overflow-hidden"
                        >
                            {productDetail?.images?.map((img, index) => (
                                <SwiperSlide key={img.id}>
                                    <div className="swiper-zoom-container w-full h-[80vh] flex items-center justify-center p-0">
                                        <img
                                            src={img.name}
                                            alt={`${productDetail?.name} - Hình ${index + 1}`}
                                            className="max-w-full max-h-full object-contain brightness-110 contrast-110"
                                            loading="lazy"
                                        />
                                        <div className="absolute bottom-8 left-0 right-0 text-center text-white text-sm bg-black py-2 px-4 mx-auto w-auto inline-block rounded-full">
                                            <p>Nhấp đúp để phóng to/thu nhỏ hoặc kéo để di chuyển</p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {/* Custom navigation buttons */}
                        <div className="swiper-button-prev-custom absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-20 hover:bg-opacity-40 rounded-full w-12 h-12 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </div>
                        <div className="swiper-button-next-custom absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-20 hover:bg-opacity-40 rounded-full w-12 h-12 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
            .swiper-button-next,
            .swiper-button-prev {
                background-color: rgba(255, 255, 255, 0.9);
                padding: 20px;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                transition: all 0.3s ease;
                backdrop-filter: blur(4px);
            }
            .swiper-button-next:hover,
            .swiper-button-prev:hover {
                background-color: rgba(255, 255, 255, 0.95);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                transform: scale(1.05);
            }
            .swiper-button-next:after,
            .swiper-button-prev:after {
                font-size: 16px;
                font-weight: bold;
                color: #1a1a1a;
            }
            .swiper-button-disabled {
                opacity: 0.35;
                cursor: not-allowed;
            }
           
            .swiper-slide-thumb-active {
                opacity: 1;
            }
        `}</style>
        </>
    );
};

export default AdminProductDetail;