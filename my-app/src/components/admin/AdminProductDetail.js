import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/zoom";
import { FreeMode, Navigation, Thumbs, Zoom } from 'swiper/modules';

const AdminProductDetail = () => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [showImageModal, setShowImageModal] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [rejectEmail, setRejectEmail] = useState('');

    const handleImageClick = (index) => {
        setCurrentImageIndex(index);
        setShowImageModal(true);
    };

    const handleApprove = () => {
        // Xử lý logic duyệt sản phẩm ở đây
        setShowApproveModal(false);
    };

    const handleReject = () => {
        // Xử lý logic từ chối sản phẩm ở đây
        console.log('Email:', rejectEmail);
        console.log('Lý do:', rejectReason);
        setShowRejectModal(false);
        setRejectReason('');
        setRejectEmail('');
    };

    const productDetail = {
        id: 1,
        name: "Sách Văn Học",
        description: "Sách Văn Học là một cuốn sách về văn học Việt Nam",
        price: 100000,
        quantity: 100,
        weight: 100,
        productCode: "1234567890",
        images: [
            {
                id: 1,
                url: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80",
            },
            {
                id: 2,
                url: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80",
            },
            {
                id: 3,
                url: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80",
            },
        ],
        genres: [
            {
                id: 1,
                name: "Văn Học",
            },
            {
                id: 2,
                name: "Văn Học",
            },
            {
                id: 3,
                name: "Văn Học",
            },
        ],
        authors: [
            {
                id: 1,
                name: "Nguyễn Văn A",
            },
            {
                id: 2,
                name: "Nguyễn Văn B",
            },
            {
                id: 3,
                name: "Nguyễn Văn C",
            },
        ],
        publisher: {
            id: 1,
            name: "Nhà Xuất Bản A",
        },
        status: true,
        approve: true,
        active: true,
        shopName: "Nhà Xuất Bản A",
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10 backdrop-blur-sm bg-white/90">
                <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <a href="#" className="hover:text-blue-600 transition-colors duration-200">Trang chủ</a>
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                            <a href="#" className="hover:text-blue-600 transition-colors duration-200">Quản lý sản phẩm</a>
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                            <span className="text-gray-900 font-medium truncate max-w-xs">{productDetail.name}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            {productDetail.approve && (
                                <button 
                                    onClick={() => setShowApproveModal(true)}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Duyệt sản phẩm</span>
                                </button>
                            )}
                            <button 
                                onClick={() => setShowRejectModal(true)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <span>Từ chối</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal xác nhận duyệt */}
            {showApproveModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
                        <div className="text-center mb-6">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Xác nhận duyệt sản phẩm</h3>
                            <p className="text-sm text-gray-500">
                                Bạn có chắc chắn muốn duyệt sản phẩm "{productDetail.name}" không? 
                                Hành động này không thể hoàn tác.
                            </p>
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email liên hệ
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={rejectEmail}
                                        onChange={(e) => setRejectEmail(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                                        placeholder="Nhập email của bạn"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                                        Lý do từ chối
                                    </label>
                                    <textarea
                                        id="reason"
                                        value={rejectReason}
                                        onChange={(e) => setRejectReason(e.target.value)}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                                        placeholder="Nhập lý do từ chối sản phẩm..."
                                        required
                                    />
                                </div>
                            </form>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowRejectModal(false)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all duration-200"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleReject}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-all duration-200"
                                disabled={!rejectEmail || !rejectReason}
                            >
                                Xác nhận từ chối
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cột trái - Thông tin shop và Hình ảnh sản phẩm */}
                    <div className="lg:w-[480px] flex-shrink-0 flex flex-col gap-6">
                        {/* Thông tin shop */}
                        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="relative group">
                                        <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white shadow-lg group-hover:shadow-blue-200 transition-all duration-300">
                                            <span className="text-xl font-medium">{productDetail.shopName.charAt(0)}</span>
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">{productDetail.shopName}</div>
                                        <div className="text-sm text-gray-500 flex items-center space-x-1">
                                            <span className="flex items-center">
                                                <svg className="w-4 h-4 text-blue-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                Nhà xuất bản chính thức
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-all duration-200 flex items-center space-x-2 hover:shadow-sm">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Xem shop</span>
                                </button>
                            </div>
                        </div>

                        {/* Hình ảnh sản phẩm */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 flex-grow">
                            <div className="relative p-6">
                                <Swiper
                                    style={{
                                        "--swiper-navigation-color": "#fff",
                                        "--swiper-pagination-color": "#fff",
                                    }}
                                    loop={true}
                                    spaceBetween={10}
                                    navigation={true}
                                    thumbs={{ swiper: thumbsSwiper }}
                                    modules={[FreeMode, Navigation, Thumbs, Zoom]}
                                    zoom={true}
                                    className="h-[400px] rounded-xl overflow-hidden bg-gray-50 border border-gray-100"
                                >
                                    {productDetail.images.map((img, index) => (
                                        <SwiperSlide key={img.id} onClick={() => handleImageClick(index)}>
                                            <div className="swiper-zoom-container w-full h-full cursor-zoom-in group">
                                                <img
                                                    src={img.url}
                                                    alt={`${productDetail.name} - Hình ${index + 1}`}
                                                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                                                    loading="lazy"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>

                                <div className="mt-4">
                                    <Swiper
                                        onSwiper={setThumbsSwiper}
                                        loop={false}
                                        spaceBetween={8}
                                        slidesPerView={5}
                                        freeMode={true}
                                        watchSlidesProgress={true}
                                        modules={[FreeMode, Navigation, Thumbs]}
                                        className="h-20"
                                    >
                                        {productDetail.images.map((img, index) => (
                                            <SwiperSlide key={img.id}>
                                                <div className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                                                    currentImageIndex === index 
                                                    ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50 shadow-md transform scale-95' 
                                                    : 'border-transparent hover:border-blue-500 hover:shadow-md hover:scale-105'
                                                }`}>
                                                    <img
                                                        src={img.url}
                                                        alt={`Thumbnail ${index + 1}`}
                                                        className="w-full h-full object-cover aspect-square"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cột phải - Thông tin sản phẩm */}
                    <div className="flex-grow flex flex-col gap-6">
                        <div className="bg-white rounded-xl shadow-sm p-6 flex-grow hover:shadow-md transition-shadow duration-300">
                            <div className="border-b pb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h1 className="text-3xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200">{productDetail.name}</h1>
                                    <div className="flex items-center space-x-2">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${productDetail.status ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'} hover:shadow-sm transition-shadow duration-200`}>
                                            {productDetail.status ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${productDetail.approve ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'} hover:shadow-sm transition-shadow duration-200`}>
                                            {productDetail.approve ? 'Đã duyệt' : 'Chờ duyệt'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <div className="flex items-center space-x-1 group">
                                        <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                        </svg>
                                        <span className="group-hover:text-blue-600 transition-colors duration-200">Mã SP: {productDetail.productCode}</span>
                                    </div>
                                    <span>•</span>
                                    <div className="flex items-center space-x-1 group">
                                        <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                        </svg>
                                        <span className="group-hover:text-blue-600 transition-colors duration-200">Khối lượng: {productDetail.weight}g</span>
                                    </div>
                                </div>
                            </div>

                            <div className="py-4 border-b">
                                <div className="flex items-baseline group">
                                    <span className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(productDetail.price)}
                                    </span>
                                    <span className="ml-2 text-sm text-gray-500">/ cuốn</span>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm font-medium text-gray-600">Số lượng trong kho</label>
                                        <span className={`px-2 py-1 rounded text-xs font-medium transition-all duration-200 hover:shadow-sm ${
                                            productDetail.quantity > 50 ? 'bg-green-50 text-green-600 hover:bg-green-100' : 
                                            productDetail.quantity > 20 ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100' : 
                                            'bg-red-50 text-red-600 hover:bg-red-100'
                                        }`}>
                                            {productDetail.quantity > 50 ? 'Còn nhiều' : 
                                             productDetail.quantity > 20 ? 'Sắp hết' : 
                                             'Còn ít'}
                                        </span>
                                    </div>
                                    <div className="flex items-baseline space-x-2 group">
                                        <span className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">{productDetail.quantity}</span>
                                        <span className="text-sm text-gray-500">cuốn</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-600 mb-2 block">Thể loại</label>
                                    <div className="flex flex-wrap gap-2">
                                        {productDetail.genres.map(genre => (
                                            <span key={genre.id} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-100 transition-all duration-200 cursor-pointer hover:shadow-sm transform hover:scale-105">
                                                {genre.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-600 mb-2 block">Tác giả</label>
                                    <div className="flex flex-wrap gap-2">
                                        {productDetail.authors.map(author => (
                                            <span key={author.id} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-all duration-200 cursor-pointer hover:shadow-sm transform hover:scale-105 flex items-center space-x-1">
                                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                <span>{author.name}</span>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-600 mb-2 block">Nhà xuất bản</label>
                                    <div className="flex items-center space-x-2 bg-gray-50 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 group cursor-pointer">
                                        <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        <span className="text-gray-900 font-medium group-hover:text-blue-600 transition-colors duration-200">{productDetail.publisher.name}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mô tả sản phẩm - Đã được đưa ra ngoài */}
                <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-2">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                        <span>Mô tả sản phẩm</span>
                    </h2>
                    <div className="prose max-w-none text-gray-700">
                        {productDetail.description}
                    </div>
                </div>
            </div>

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
                .swiper-slide {
                    opacity: 0.4;
                    transition: all 0.3s ease;
                }
                .swiper-slide-thumb-active {
                    opacity: 1;
                }
            `}</style>
        </div>
    );
};

export default AdminProductDetail;