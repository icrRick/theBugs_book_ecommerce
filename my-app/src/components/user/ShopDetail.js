"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import ChatButton from "./ChatButton"

import { showErrorToast } from "../../utils/Toast";
import ProductCard from "./ProductCard";
import axios from "axios"
import Pagination from "../admin/Pagination";
const ShopDetail = () => {
  const { id } = useParams()
  const [shop, setShop] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("price_desc");
  const [items, setItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000000);
  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const itemsPerPage = 12;
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const updateURL = (params) => {
    const urlParams = new URLSearchParams(window.location.search);
    Object.keys(params).forEach(key => {
      if (params[key]) {
        urlParams.set(key, params[key]);
      } else {
        urlParams.delete(key);
      }
    });
    window.history.pushState(null, '', `?${urlParams.toString()}`);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    updateURL({ page: newPage });
    handleFilter(id, newPage);
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const handleSort = (value) => {
    setSortBy(value);
  };

  const handlePriceRangeChange = (range) => {
    setSelectedPriceRange(range);
    switch (range) {
      case 'all':
        setMinPrice(0);
        setMaxPrice(1000000000);
        break;
      case '0-50000':
        setMinPrice(0);
        setMaxPrice(50000);
        break;
      case '50000-100000':
        setMinPrice(50000);
        setMaxPrice(100000);
        break;
      case '100000-200000':
        setMinPrice(100000);
        setMaxPrice(200000);
        break;
      case '200000-up':
        setMinPrice(200000);
        setMaxPrice(1000000000);
        break;
      default:
        setMinPrice(0);
        setMaxPrice(1000000000);
    }
  };

  const handleFilter = async (id, page) => {
    try {
      const requestBody = {
        "productName": searchQuery,
        "minPrice": minPrice,
        "maxPrice": maxPrice,
        "sortType": sortBy,
        "genresIntegers": genres,
        "authorsIntegers": authors
      }
      updateURL({
        productName: searchQuery,
        minPrice: minPrice,
        maxPrice: maxPrice,
        sortType: sortBy,
        page: page
      });
      const response = await axios.post(`http://localhost:8080/shop/filter?shopSlug=${id}&page=${page}`, requestBody);
      if (response.status === 200 && response.data.status === true) {
        setItems(response.data.data.arrayList)
        setTotalItems(response.data.data.totalItems)
      }
    } catch (error) {
      showErrorToast(error.response?.data?.message || "Có lỗi xảy ra")
      console.error("Lỗi khi lấy dữ liệu:", error)
    }
  }

  const handleGenreChange = (genreId) => {
    setGenres(prev => {
      if (prev.includes(genreId)) {
        return prev.filter(id => id !== genreId);
      }
      return [...prev, genreId];
    });
  };

  const handleAuthorChange = (authorId) => {
    setAuthors(prev => {
      if (prev.includes(authorId)) {
        return prev.filter(id => id !== authorId);
      }
      return [...prev, authorId];
    });
  };

  const handleApplyFilter = () => {
    setCurrentPage(1);
    handleFilter(id, 1);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlProductName = params.get("productName");
    const urlMinPrice = parseInt(params.get("minPrice"));
    const urlMaxPrice = parseInt(params.get("maxPrice"));
    const urlSortType = params.get("sortType");
    const urlPage = parseInt(params.get("page"));

    if (urlProductName) setSearchQuery(urlProductName);
    if (urlMinPrice) setMinPrice(urlMinPrice);
    if (urlMaxPrice) setMaxPrice(urlMaxPrice);
    if (urlSortType) setSortBy(urlSortType);
    if (urlPage) setCurrentPage(urlPage);
  }, []);

  const fechData = async (id) => {
    setLoading(true)
    try {
      console.log("Đang gọi API với shopSlug:", id)
      const response = await axios.get(`http://localhost:8080/shop/detail?shopSlug=${id}`);
      console.log("Dữ liệu nhận được:", response.data)
      if (response.status === 200 && response.data.status === true) {
        setShop(response.data.data)
        console.log("Dữ liệu shop sau khi set:", response.data.data)
      }
    } catch (error) {
      showErrorToast(error.response?.data?.message || "Có lỗi xảy ra")
      console.error("Lỗi khi lấy dữ liệu:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fechData(id);
    }
  }, [id])

  useEffect(() => {
    if (id) {
      handleFilter(id, currentPage);
    }
  }, [id, currentPage])

  const handleChat = () => {
    console.log("Chat với cửa hàng:", shop?.shopName);
  };

  const handleReport = () => {
    console.log("Báo cáo cửa hàng:", shop?.shopName);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!shop) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Không tìm thấy thông tin cửa hàng</div>
      </div>
    )
  }

  return (
    <div className="w-full my-4">
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
                    <button
                      className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                      onClick={handleChat}
                    >
                      <i className="bi bi-chat-dots"></i>
                      <span>Chat</span>
                    </button>
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
                  <div className="flex items-center bg-gray-50 rounded-full px-3 py-1">
                    <i className="bi bi-star-fill text-yellow-400 mr-2"></i>
                    <span>{shop?.shopRating || 0} ({shop?.shopRatingCount || 0} đánh giá)</span>
                  </div>
                  <div className="flex items-center bg-gray-50 rounded-full px-3 py-1">
                    <i className="bi bi-box text-gray-500 mr-2"></i>
                    <span>{shop?.productsCount} sản phẩm</span>
                  </div>
                  <div className="flex items-center bg-gray-50 rounded-full px-3 py-1">
                    <i className="bi bi-geo-alt text-gray-500 mr-2"></i>
                    <span>{shop?.shopAddress}</span>
                  </div>
                  <div className="flex items-center bg-gray-50 rounded-full px-3 py-1">
                    <i className="bi bi-calendar text-gray-500 mr-2"></i>
                    <span>Tham gia từ {new Date(shop?.shopCreatAt).toLocaleDateString('vi-VN')}</span>
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

      {/* Product List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 mt-6">
        {/* Filter Sidebar */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm p-4 sticky top-0 ">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Bộ lọc</h3>
            <ul className="space-y-4">
              <li className="text-gray-600">
                <h4 className="font-medium text-gray-700 mb-3">Thể loại</h4>
                <ul className="space-y-2">
                  {shop?.genres?.length > 0 && shop?.genres?.map((genre) => (
                    <li key={genre.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`genre-${genre.id}`}
                        value={genre.id}
                        className="mr-2"
                        checked={genres.includes(genre.id)}
                        onChange={() => handleGenreChange(genre.id)}
                      />
                      <label htmlFor={`genre-${genre.id}`}>{genre.name}</label>
                    </li>
                  ))}
                </ul>
              </li>

              <li className="text-gray-600">
                <h4 className="font-medium text-gray-700 mb-3">Tác giả</h4>
                <ul className="space-y-2">
                  {shop?.authors?.length > 0 && shop?.authors?.map((author) => (
                    <li key={author.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`author-${author.id}`}
                        value={author.id}
                        className="mr-2"
                        checked={authors.includes(author.id)}
                        onChange={() => handleAuthorChange(author.id)}
                      />
                      <label htmlFor={`author-${author.id}`}>{author.name}</label>
                    </li>
                  ))}
                </ul>
              </li>

              <li className="text-gray-600">
                <h4 className="font-medium text-gray-700 mb-3">Giá</h4>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <input
                      type="radio"
                      name="price"
                      id="price-all"
                      value="all"
                      checked={selectedPriceRange === 'all'}
                      onChange={() => handlePriceRangeChange('all')}
                      className="mr-2"
                    />
                    <label htmlFor="price-all">Tất cả</label>
                  </li>
                  <li className="flex items-center">
                    <input
                      type="radio"
                      name="price"
                      id="price-0-50000"
                      value="0-50000"
                      checked={selectedPriceRange === '0-50000'}
                      onChange={() => handlePriceRangeChange('0-50000')}
                      className="mr-2"
                    />
                    <label htmlFor="price-0-50000">Dưới 50.000đ</label>
                  </li>
                  <li className="flex items-center">
                    <input
                      type="radio"
                      name="price"
                      id="price-50000-100000"
                      value="50000-100000"
                      checked={selectedPriceRange === '50000-100000'}
                      onChange={() => handlePriceRangeChange('50000-100000')}
                      className="mr-2"
                    />
                    <label htmlFor="price-50000-100000">50.000đ - 100.000đ</label>
                  </li>
                  <li className="flex items-center">
                    <input
                      type="radio"
                      name="price"
                      id="price-100000-200000"
                      value="100000-200000"
                      checked={selectedPriceRange === '100000-200000'}
                      onChange={() => handlePriceRangeChange('100000-200000')}
                      className="mr-2"
                    />
                    <label htmlFor="price-100000-200000">100.000đ - 200.000đ</label>
                  </li>
                  <li className="flex items-center">
                    <input
                      type="radio"
                      name="price"
                      id="price-200000-up"
                      value="200000-up"
                      checked={selectedPriceRange === '200000-up'}
                      onChange={() => handlePriceRangeChange('200000-up')}
                      className="mr-2"
                    />
                    <label htmlFor="price-200000-up">Trên 200.000đ</label>
                  </li>
                </ul>
              </li>

              <li className="mt-4">
                <button
                  onClick={handleApplyFilter}
                  className="w-full bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                  Áp dụng bộ lọc
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Product List */}
        <div className="lg:col-span-9">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search Input */}
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* Sort Combobox */}
              <div className="w-full md:w-48">
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                  value={sortBy}
                  onChange={(e) => handleSort(e.target.value)}
                >
                  <option value="popular">Phổ biến nhất</option>
                  <option value="price_asc">Giá tăng dần</option>
                  <option value="price_desc">Giá giảm dần</option>
                  <option value="newest">Mới nhất</option>
                </select>
              </div>

              {/* Search Button */}
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                onClick={handleApplyFilter}
              >
                <i className="bi bi-search"></i>
              </button>
            </div>

            <div className="my-4">
              <div className="flex flex-wrap justify-between items-center mb-4">
                <div className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-0">
                  <span className="hidden sm:inline">Hiển thị</span>{" "}
                  <span className="font-medium">{items.length > 0 ? startItem : 0}-{items.length > 0 ? endItem : 0}</span>{" "}
                  <span className="hidden sm:inline">trên</span>{" "}
                  <span className="font-medium">{totalItems}</span> sản phẩm{" "}
                  <span className="inline sm:hidden">• Trang {currentPage}</span>
                </div>
              </div>
            </div>
            {/* Product grid will go here */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {items.map((item) => (
                <ProductCard key={item?.id} product={item} />
              ))}

            </div>
            {/* Pagination */}
            {items.length > 0 && (
              <div className={`border-t border-gray-200 mt-4 ${isLoading ? 'opacity-50' : ''}`}>
                <Pagination currentPage={currentPage} totalPages={Math.ceil(totalItems / 10)} setCurrentPage={handlePageChange} />
              </div>
            )}
          </div>
        </div>
      </div>

    </div>

  )
}

export default ShopDetail
