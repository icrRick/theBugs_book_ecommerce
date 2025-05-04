"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useParams, Link, useLocation, useNavigate } from "react-router-dom"
import ChatButton from "./ChatButton"
import { Swiper, SwiperSlide } from "swiper/react"
import { FreeMode, Autoplay, Pagination as SwiperPagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/autoplay"
import "swiper/css/pagination"

import { showErrorToast } from "../../utils/Toast";
import ProductCard from "./ProductCard";
import axios from "axios"
import Pagination from "../admin/Pagination";
import Loading from "../../utils/Loading"

// Tạo instance axios để sử dụng xuyên suốt
const api = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 2000,
});

const ShopDetail = () => {
  const { id } = useParams()
  const location = useLocation()
  const initialState = location.state || {}

  const [shop, setShop] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [showAllGenres, setShowAllGenres] = useState(false);
  const [showAllAuthors, setShowAllAuthors] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialState.searchQuery || "")
  const [sortBy, setSortBy] = useState(initialState.sortBy || "popular");
  const [items, setItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialState.page || 1);
  const [minPrice, setMinPrice] = useState(initialState.minPrice || 0);
  const [maxPrice, setMaxPrice] = useState(initialState.maxPrice || 1000000000);
  const [priceRangeValue, setPriceRangeValue] = useState(0);
  const [genres, setGenres] = useState(initialState.genres || []);
  const [genreNames, setGenreNames] = useState(initialState.genreNames || []);
  const [authors, setAuthors] = useState(initialState.authors || []);
  const [authorNames, setAuthorNames] = useState(initialState.authorNames || []);
  const [selectedPriceRange, setSelectedPriceRange] = useState(initialState.priceRange || 'all');
  const navigate = useNavigate();
  const itemsPerPage = 12;
  const startItem = useMemo(() => (currentPage - 1) * itemsPerPage + 1, [currentPage, itemsPerPage]);
  const endItem = useMemo(() => Math.min(currentPage * itemsPerPage, totalItems), [currentPage, itemsPerPage, totalItems]);
  const [promotion, setPromotion] = useState(null);
  const updateURL = useCallback((params) => {
    const urlParams = new URLSearchParams(window.location.search);
    Object.keys(params).forEach(key => {
      if (params[key]) {
        urlParams.set(key, params[key]);
      } else {
        urlParams.delete(key);
      }
    });
    window.history.pushState(null, '', `?${urlParams.toString()}`);
  }, []);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const handleSort = (value) => {
    setSortBy(value);
  };

  const handlePriceRangeChange = (e) => {
    const value = parseInt(e.target.value);
    setPriceRangeValue(value);

    // Ánh xạ giá trị thanh trượt thành khoảng giá
    const priceRanges = {
      0: { min: 0, max: 1000000000 },
      25: { min: 0, max: 50000 },
      50: { min: 50000, max: 100000 },
      75: { min: 100000, max: 200000 },
      100: { min: 200000, max: 1000000000 }
    };

    const range = priceRanges[value] || priceRanges[0];
    setMinPrice(range.min);
    setMaxPrice(range.max);
  };

  const handleFilter = async (id, page, isInitial = false) => {
    if (!id) return;

    try {
      const requestBody = {
        "productName": searchQuery || "",
        "minPrice": minPrice || 0,
        "maxPrice": maxPrice || 1000000000,
        "sortType": sortBy || "price_desc",
        "genresIntegers": genres || [],
        "authorsIntegers": authors || []
      };

      if (!isInitial) {
        updateURL({
          productName: searchQuery,
          minPrice: minPrice || 0,
          maxPrice: maxPrice || 1000000000,
          sortType: sortBy || "price_desc",
          page: page || 1,
          genres: genreNames.join(','),
          authors: authorNames.join(',')
        });
      }

      const response = await api.post(`/shop/filter?shopSlug=${id}&page=${page}`, requestBody);
      if (response.status === 200 && response.data.status === true) {
        setItems(response.data.data.arrayList);
        setTotalItems(response.data.data.totalItems);
      }
    } catch (error) {
      showErrorToast(error.response?.data?.message || "Có lỗi xảy ra");
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  };

  const handleResetFilter = () => {
    setSearchQuery("");
    setMinPrice(0);
    setMaxPrice(1000000000);
    setPriceRangeValue(0);
    setSortBy("price_desc");
    setGenres([]);
    setGenreNames([]);
    setAuthors([]);
    setAuthorNames([]);
    setSelectedPriceRange('all');
    setCurrentPage(1);

    handleFilter(id, 1);
  }

  const handleGenreChange = (genreId, genreName) => {
    setGenres(prev => {
      const newGenres = prev.includes(genreId)
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId];
      return newGenres;
    });

    setGenreNames(prev => {
      const newNames = prev.includes(genreName)
        ? prev.filter(name => name !== genreName)
        : [...prev, genreName];
      return newNames;
    });
  };

  const handleAuthorChange = (authorId, authorName) => {
    setAuthors(prev => {
      const newAuthors = prev.includes(authorId)
        ? prev.filter(id => id !== authorId)
        : [...prev, authorId];
      return newAuthors;
    });

    setAuthorNames(prev => {
      const newNames = prev.includes(authorName)
        ? prev.filter(name => name !== authorName)
        : [...prev, authorName];
      return newNames;
    });
  };

  const handleApplyFilter = () => {
    setCurrentPage(1);
    handleFilter(id, 1);
  };
  const getQueryParams = useCallback(() => {
    const params = new URLSearchParams(window.location.search);

    // Xử lý các giá trị số
    const parseSafeInt = (value, defaultValue) => {
      const parsed = parseInt(value);
      return isNaN(parsed) ? defaultValue : parsed;
    };

    // Xử lý các mảng từ chuỗi
    const parseArray = (value) => {
      return value ? value.split(',').filter(item => item.trim()) : [];
    };

    return {
      keyword: params.get("productName") || "",
      page: parseSafeInt(params.get("page"), 1),
      genres: parseArray(params.get("genres")),
      authors: parseArray(params.get("authors")),
      minPrice: parseSafeInt(params.get("minPrice"), 0),
      maxPrice: parseSafeInt(params.get("maxPrice"), 1000000000),
      sortType: params.get("sortType") || "price_desc"
    };
  }, []);

  // Thêm useEffect để xử lý params từ URL khi component mount
  useEffect(() => {
    if (id) {
      fechData(id);
      getProductDiscount(id);
    }
  }, [id]);

  useEffect(() => {
    if (id && shop) {
      if (initialState.fromProductDetail) {
        handleFilter(id, currentPage);
      } else {
        const params = getQueryParams();
        if (params.keyword) setSearchQuery(params.keyword);
        if (params.minPrice) setMinPrice(params.minPrice);
        if (params.maxPrice) setMaxPrice(params.maxPrice);
        if (params.sortType) setSortBy(params.sortType);
        if (params.page) setCurrentPage(params.page);
        handleFilter(id, params.page);
      }
    }
  }, [shop, id]);

  useEffect(() => {
    if (id && shop && currentPage > 1) {
      handleFilter(id, currentPage);
    }
  }, [currentPage]);

  const fechData = async (id) => {
    setLoading(true);
    try {
      const response = await api.get(`/shop/detail?shopSlug=${id}`);
      if (response.status === 200 && response.data.status === true) {
        setShop(response.data.data);
      }
    } catch (error) {
      
      console.error("Lỗi khi lấy dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  const getProductDiscount = async (id) => {
    try {
      const response = await api.get(`/shop/promotion?shopSlug=${id}`);
      if (response.status === 200 && response.data.status === true) {
        setPromotion(response.data.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy khuyến mãi:", error);
      setPromotion([]);
    }
  };

  const handleReport = () => {
    navigate(`/report-shop/${id}`);
  };

  // Sử dụng memo cho các điều kiện render phổ biến
  const visibleGenres = useMemo(() => {
    return shop?.genres?.length > 0
      ? (showAllGenres ? shop.genres : shop.genres.slice(0, 5))
      : [];
  }, [shop?.genres, showAllGenres]);

  const visibleAuthors = useMemo(() => {
    return shop?.authors?.length > 0
      ? (showAllAuthors ? shop.authors : shop.authors.slice(0, 5))
      : [];
  }, [shop?.authors, showAllAuthors]);



  if (!shop) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Không tìm thấy thông tin cửa hàng</div>
      </div>
    )
  }

  return (
    <div className="w-full my-4">
      {loading && <Loading />}
      <div className="relative rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Banner */}
        <div className="h-80 overflow-hidden">
          <img
            src={shop?.shopBanner || "/placeholder.svg"}
            alt={shop?.shopName}
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Thông tin cửa hàng */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Logo */}
              <div className="w-20 hidden md:block h-20 md:w-24 md:h-24 rounded-full border-4 border-white bg-white shadow-sm overflow-hidden flex-shrink-0 mx-auto md:mx-0">
                <img
                  src={shop?.shopImage || "/placeholder.svg"}
                  alt={`${shop?.shopName} logo`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thông tin chi tiết */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-3">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                      {shop?.shopName}
                      {shop?.verify && (
                        <span className="ms-3 inline-flex items-center bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1.5 rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Đã xác thực
                        </span>
                      )}
                    </h1>
                  </div>
                  <div className="flex gap-2">
                    {/* <button
                      className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                      onClick={handleChat}
                    >
                      <i className="bi bi-chat-dots"></i>
                      <span>Chat</span>
                    </button> */}
                    <button
                      className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors text-sm"
                      onClick={handleReport}
                    >
                      <i className="bi bi-flag"></i>
                      <span>Báo cáo</span>
                    </button>
                  </div>
                </div>

                {/* Thông tin bổ sung */}
                <div className="flex flex-wrap gap-3 mb-4 text-sm text-gray-600">
                  <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-full">
                    <i className="bi bi-star-fill text-yellow-400 mr-2"></i>
                    <span>{shop?.shopRating || 0} ({shop?.shopRatingCount || 0} đánh giá)</span>
                  </div>
                  <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-full">
                    <i className="bi bi-box text-gray-500 mr-2"></i>
                    <span>{shop?.productsCount} sản phẩm</span>
                  </div>
                  <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-full">
                    <i className="bi bi-geo-alt text-gray-500 mr-2"></i>
                    <span>{shop?.shopAddress || "Không có địa chỉ"}</span>
                  </div>
                  <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-full">
                    <i className="bi bi-calendar text-gray-500 mr-2"></i>
                    {shop?.shopCreatAt}
                  </div>
                </div>

                {/* Mô tả cửa hàng */}
                <div className="text-gray-600 text-sm leading-relaxed">
                  <p className={showFullDescription ? "" : "line-clamp-1"}>
                    {shop?.shopDescription}
                  </p>
                  {shop?.shopDescription && shop.shopDescription.length > 100 && (
                    <button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="text-indigo-600 hover:text-indigo-700 text-sm font-medium mt-1"
                    >
                      {showFullDescription ? "Thu gọn" : "Xem thêm"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phần sản phẩm đang giảm giá */}
      {
        promotion && promotion.length > 0 && (
          <div className="mt-10 relative overflow-hidden">
            {/* Banner nền với gradient và border */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 rounded-2xl opacity-75"></div>
            
            {/* Viền trang trí */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400"></div>
            
            {/* Huy hiệu sale */}
            <div className="absolute -top-3 -right-3 md:top-4 md:right-4 bg-red-600 text-white text-xs md:text-sm font-bold px-3 py-1 rounded-full shadow-lg transform rotate-12 z-10">
              SALE
            </div>
            
            <div className="relative rounded-2xl shadow-lg p-6 md:p-8 border border-orange-100 z-0">
              {/* Tiêu đề với icon */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-red-600 flex items-center">
                  <i className="bi bi-lightning-charge-fill text-orange-500 mr-2 text-2xl"></i>
                  <span>Sản phẩm đang giảm giá hôm nay</span>
                </h2>
                
                {/* Badge chớp nháy "HOT" */}
                <span className="inline-flex items-center justify-center px-3 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full shadow-sm animate-pulse">
                  HOT DEAL
                </span>
              </div>
              
              <div className="relative featured-swiper-container">
                <Swiper
                  slidesPerView={2}
                  spaceBetween={16}
                  freeMode={{
                    enabled: true,
                    sticky: false,
                    momentumBounce: true,
                    minimumVelocity: 0.1,
                    momentum: true
                  }}
                  navigation={false}
                  autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                  }}
                  pagination={{
                    el: '.swiper-pagination',
                    clickable: true,
                    dynamicBullets: true,
                    dynamicMainBullets: 3,
                  }}
                  grabCursor={true}
                  breakpoints={{
                    640: {
                      slidesPerView: 3,
                      spaceBetween: 20,
                    },
                    768: {
                      slidesPerView: 4,
                      spaceBetween: 24,
                    },
                    1024: {
                      slidesPerView: 5,
                      spaceBetween: 28,
                    },
                  }}
                  modules={[FreeMode, Autoplay, SwiperPagination]}
                  className="featured-products-swiper"
                >
                  {promotion?.map((product) => (
                    <SwiperSlide key={product.id}>
                      <div className="transform transition-transform duration-300">
                        <ProductCard product={product} />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div className="swiper-pagination mt-6"></div>
              </div>

              <style jsx="true">{`
            .featured-swiper-container {
              position: relative;
              padding: 0;
            }
            
            .swiper-pagination {
              position: relative;
              bottom: 0;
              margin-top: 16px;
            }
            
            .swiper-pagination-bullet {
              width: 8px;
              height: 8px;
              margin: 0 4px;
              background: #fecaca;
              opacity: 1;
              transition: all 0.3s ease;
            }
            
            .swiper-pagination-bullet-active {
              background: #ef4444;
              width: 24px;
              border-radius: 4px;
            }
            
            @keyframes pulsate {
              0% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.1); opacity: 0.8; }
              100% { transform: scale(1); opacity: 1; }
            }
            
            .featured-products-swiper .swiper-slide {
              transition: transform 0.3s ease;
            }
            
            .featured-products-swiper .swiper-slide:hover {
              z-index: 1;
            }
          `}</style>
            </div>
          </div>
        )
      }

      {/* Product List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-8">
        {/* Filter Sidebar */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
              <i className="bi bi-funnel mr-2 text-indigo-600"></i>
              Bộ lọc
            </h3>
            <ul className="space-y-6">
              <li className="pb-5 border-b border-gray-100">
                <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                  <i className="bi bi-tags mr-2 text-indigo-500"></i>
                  Thể loại
                </h4>
                <ul className="space-y-2 pl-2">
                  {visibleGenres.map((genre) => (
                    <li key={genre.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`genre-${genre.id}`}
                        value={genre.id}
                        className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 mr-2"
                        checked={genres.includes(genre.id)}
                        onChange={() => handleGenreChange(genre.id, genre.name)}
                      />
                      <label htmlFor={`genre-${genre.id}`} className="text-gray-600 cursor-pointer select-none hover:text-indigo-600 transition-colors">{genre.name}</label>
                    </li>
                  ))}
                </ul>
                {shop?.genres?.length > 5 && (
                  <button
                    onClick={() => setShowAllGenres(!showAllGenres)}
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium mt-3 flex items-center"
                  >
                    <i className={`bi ${showAllGenres ? 'bi-chevron-up' : 'bi-chevron-down'} mr-1`}></i>
                    {showAllGenres ? "Thu gọn" : `Xem thêm (${shop.genres.length - 5})`}
                  </button>
                )}
              </li>

              <li className="pb-5 border-b border-gray-100">
                <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                  <i className="bi bi-person mr-2 text-indigo-500"></i>
                  Tác giả
                </h4>
                <ul className="space-y-2 pl-2">
                  {visibleAuthors.map((author) => (
                    <li key={author.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`author-${author.id}`}
                        value={author.id}
                        className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 mr-2"
                        checked={authors.includes(author.id)}
                        onChange={(e) => handleAuthorChange(author.id, author.name)}
                      />
                      <label htmlFor={`author-${author.id}`} className="text-gray-600 cursor-pointer select-none hover:text-indigo-600 transition-colors">{author.name}</label>
                    </li>
                  ))}
                </ul>
                {shop?.authors?.length > 5 && (
                  <button
                    onClick={() => setShowAllAuthors(!showAllAuthors)}
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium mt-3 flex items-center"
                  >
                    <i className={`bi ${showAllAuthors ? 'bi-chevron-up' : 'bi-chevron-down'} mr-1`}></i>
                    {showAllAuthors ? "Thu gọn" : `Xem thêm (${shop.authors.length - 5})`}
                  </button>
                )}
              </li>

              <li className="pb-5 border-b border-gray-100">
                <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                  <i className="bi bi-currency-dollar mr-2 text-indigo-500"></i>
                  Giá
                </h4>
                <div className="space-y-4">
                  <div className="relative px-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="25"
                      value={priceRangeValue}
                      onChange={handlePriceRangeChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>Tất cả</span>
                      <span>50K</span>
                      <span>100K</span>
                      <span>200K</span>
                      <span>200K+</span>
                    </div>
                  </div>
                  <div className="bg-indigo-50 px-4 py-3 rounded-lg">
                    <p className="font-medium text-indigo-700 text-sm">
                      Khoảng giá: <span className="font-semibold">{minPrice.toLocaleString('vi-VN')}đ - {maxPrice === 1000000000 ? '∞' : maxPrice.toLocaleString('vi-VN') + 'đ'}</span>
                    </p>
                  </div>
                </div>
              </li>

              <li className="mt-6 space-y-3">
                <button
                  onClick={handleApplyFilter}
                  className="w-full bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center justify-center">
                  <i className="bi bi-funnel-fill mr-2"></i>
                  Áp dụng bộ lọc
                </button>
                <button
                  onClick={handleResetFilter}
                  className="w-full bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center justify-center">
                  <i className="bi bi-arrow-counterclockwise mr-2"></i>
                  Xóa bộ lọc
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Product List */}
        <div className="lg:col-span-9">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search Input */}
              <div className="flex-1 w-full">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <i className="bi bi-search"></i>
                  </span>
                </div>
              </div>

              {/* Sort Combobox */}
              <div className="w-full md:w-56">
                <div className="relative">
                  <select
                    className="w-full pl-10 pr-4 py-2.5 appearance-none border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                    value={sortBy}
                    onChange={(e) => handleSort(e.target.value)}
                  >
                    <option value="popular">Phổ biến nhất</option>
                    <option value="price_asc">Giá tăng dần</option>
                    <option value="price_desc">Giá giảm dần</option>
                    <option value="newest">Mới nhất</option>
                  </select>
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                    <i className="bi bi-sort-down"></i>
                  </span>
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                    <i className="bi bi-chevron-down"></i>
                  </span>
                </div>
              </div>

              {/* Search Button */}
              <button
                className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                onClick={handleApplyFilter}
              >
                <i className="bi bi-search mr-1"></i>
                <span className="hidden sm:inline">Tìm</span>
              </button>

              {/* Reset Button */}
              <button
                className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                onClick={handleResetFilter}
              >
                <i className="bi bi-arrow-counterclockwise mr-1"></i>
                <span className="hidden sm:inline">Đặt lại</span>
              </button>
            </div>

            <div className="my-6">
              <div className="flex flex-wrap justify-between items-center">
                <div className="text-xs sm:text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                  <span className="text-gray-500">Hiển thị</span>{" "}
                  <span className="font-medium text-indigo-700">{items.length > 0 ? startItem : 0}-{items.length > 0 ? endItem : 0}</span>{" "}
                  <span className="text-gray-500">trên</span>{" "}
                  <span className="font-medium text-indigo-700">{totalItems}</span> sản phẩm{" "}
                  <span className="text-gray-500">• Trang {currentPage}</span>
                </div>
              </div>
            </div>
            
            {/* Product grid will go here */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <ProductCard key={item?.id} product={item} />
              ))}
            </div>
            
            {/* Pagination */}
            {items.length > 0 && (
              <div className={`border-t border-gray-100 mt-8 pt-6 ${isLoading ? 'opacity-50' : ''}`}>
                <Pagination currentPage={currentPage} totalPages={Math.ceil(totalItems / 10)} setCurrentPage={handlePageChange} />
              </div>
            )}
          </div>
        </div>
      </div>

    </div>

  )
}

export default ShopDetail;
