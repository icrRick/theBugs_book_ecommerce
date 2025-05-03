"use client";

import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { showErrorToast } from "../../utils/Toast";
import { formatCurrency } from "../../utils/Format";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("relevance");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [genres, setGenres] = useState([]);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const keyword = searchParams.get("keyword") || "";
        const minPriceParams = searchParams.get("minPrice") || "";
        const maxPriceParams = searchParams.get("maxPrice") || "";
        const pageParam = parseInt(searchParams.get("page") || 1);
        const genresIDs = searchParams.getAll("genresID");
        const sortByParam = searchParams.get("sortBy") || "relevance";

        setPriceRange({ min: minPriceParams, max: maxPriceParams });
        setCurrentPage(pageParam);

        if (genresIDs.length > 0) {
          const selected = genres
            .filter((cat) => genresIDs.includes(cat.id.toString()))
            .map((cat) => cat.name);
          setSelectedCategories(selected);
        } else {
          setSelectedCategories([]);
        }

        const params = new URLSearchParams();
        if (keyword) params.append("keyword", keyword);
        if (priceRange.min !== "") params.append("minPrice", priceRange.min);
        if (priceRange.max !== "") params.append("maxPrice", priceRange.max);
        genresIDs.forEach((id) => params.append("genresID", id));
        params.append("page", pageParam);
        params.append("sortBy", sortByParam);

        const response = await axiosInstance.get(
          `/search?${params.toString()}`
        );
        const data = response.data;
        if (data.status) {
          setProducts(data.data.data);
          setGenres(data.data.listGenres);
          const totalItems = Number(data.data.totalItem) || 0;
          setTotalPages(Math.ceil(totalItems / 16));
        } else {
          console.error("Lỗi từ API:", data.message);
          setProducts([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.log("Lỗi khi gọi API:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.data?.message ||
          "Đã xảy ra lỗi không xác định!";

        showErrorToast(errorMessage);
      }
      setTimeout(() => {
        setLoading(false);
      }, 300);
    };
    fetchProducts();
  }, [searchParams]);

  const handleSortChange = (e) => {
    const newSortBy = e.target.value;
    setSortBy(newSortBy);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sortBy", newSortBy);
    newParams.set("page", 1);
    setSearchParams(newParams);
  };

  const handleCategoryChange = (category) => {
    setLoading(true);
    setSelectedCategories((prev) => {
      let newSelected;
      if (prev.includes(category)) {
        newSelected = prev.filter((cat) => cat !== category);
      } else {
        newSelected = [...prev, category];
      }

      const params = new URLSearchParams(searchParams);
      params.delete("genresID");
      newSelected.forEach((cat) => {
        const catObj = genres.find((g) => g.name === cat);
        if (catObj) {
          params.append("genresID", catObj.id);
        }
      });
      params.set("page", 1);
      setSearchParams(params);
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: "auto",
        });
      }, 200);

      return newSelected;
    });
  };

  const handlePriceRangeChange = (e) => {
    const { name, value } = e.target;
    setPriceRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePageChange = (page) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", page);
    setSearchParams(newParams);
    setCurrentPage(page);
    setTimeout(() => {
      window.scrollTo({
        top: 10,
        behavior: "auto",
      });
    }, 200);
  };

  const handleApplyFilter = () => {
    const params = new URLSearchParams();

    if (keyword) params.set("keyword", keyword);
    if (priceRange.min) params.set("minPrice", priceRange.min);
    if (priceRange.max) params.set("maxPrice", priceRange.max);
    if (selectedCategories.length > 0) {
      selectedCategories.forEach((cat) => {
        const catObj = genres.find((c) => c.name === cat);
        if (catObj) params.append("genresID", catObj.id);
      });
    }

    params.set("page", 1);

    setSearchParams(params);

    setIsFilterOpen(false);

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 100);
  };

  const handleResetFilter = () => {
    const params = new URLSearchParams(searchParams);

    params.delete("keyword");
    params.delete("genresID");
    params.delete("minPrice");
    params.delete("maxPrice");
    params.set("page", 1);

    setSelectedCategories([]);
    setPriceRange({ min: "", max: "" });

    setSearchParams(params);
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 200);
  };

  const formatSold = (sold) => {
    if (sold >= 1000000) {
      return (sold / 1000000).toFixed(1).replace(".0", "") + "m"; // triệu
    }
    if (sold >= 1000) {
      return (sold / 1000).toFixed(1).replace(".0", "") + "k"; // nghìn
    }
    return sold.toString();
  };

  const formatSumCountReview = (countRateProduct) => {
    if (countRateProduct >= 1000000) {
      return (countRateProduct / 1000000).toFixed(1).replace(".0", "") + "m"; // triệu
    }
    if (countRateProduct >= 1000) {
      return (countRateProduct / 1000).toFixed(1).replace(".0", "") + "k"; // nghìn
    }
    return countRateProduct.toString();
  };

  const keyword = searchParams.get("keyword") || "";

  return (
    <div className="container mx-auto px-4 min-h-[calc(100vh-50px)]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {keyword ? `Kết quả tìm kiếm cho "${keyword}"` : "Tất cả sản phẩm"}
        </h1>
        <p className="text-gray-600 mt-1">
          Tìm thấy {products.length} sản phẩm
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter sidebar - Desktop */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3">Danh mục</h3>
              <div className="space-y-2">
                {(showAllCategories ? genres : genres.slice(0, 5)).map(
                  (category) => (
                    <div key={category?.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`category-${category.id}`}
                        checked={selectedCategories.includes(category?.name)}
                        onChange={() => handleCategoryChange(category?.name)}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`category-${category?.id}`}
                        className="ml-2 text-sm text-gray-700"
                      >
                        {category?.name}
                      </label>
                    </div>
                  )
                )}
                {genres.length > 5 && (
                  <button
                    onClick={() => setShowAllCategories(!showAllCategories)}
                    className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium mt-3 transition-colors"
                  >
                    <span>{showAllCategories ? "Thu gọn" : "Xem thêm"}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 ml-1 transition-transform duration-300 ${
                        showAllCategories ? "transform rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3">Giá</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label
                    htmlFor="min-price"
                    className="text-sm text-gray-600 block mb-1"
                  >
                    Từ
                  </label>
                  <input
                    type="number"
                    id="min-price"
                    name="min"
                    value={priceRange.min}
                    onChange={handlePriceRangeChange}
                    placeholder="0đ"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="max-price"
                    className="text-sm text-gray-600 block mb-1"
                  >
                    Đến
                  </label>
                  <input
                    type="number"
                    id="max-price"
                    name="max"
                    value={priceRange.max}
                    onChange={handlePriceRangeChange}
                    placeholder="1.000.000đ"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <button
                onClick={handleApplyFilter}
                className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Áp dụng
              </button>
              <button
                onClick={handleResetFilter}
                className="w-full py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          {/* Sort and filter bar */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center">
                <span className="text-gray-700 mr-2">Sắp xếp theo:</span>
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="relevance">Độ phù hợp</option>
                  <option value="price-asc">Giá: Thấp đến cao</option>
                  <option value="price-desc">Giá: Cao đến thấp</option>
                  <option value="rating">Đánh giá cao</option>
                  <option value="bestseller">Bán chạy nhất</option>
                </select>
              </div>

              {/* Filter button for mobile */}
              <button
                className="lg:hidden flex items-center space-x-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Bộ lọc</span>
              </button>
            </div>
          </div>

          {/* Mobile filter drawer */}
          {isFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={() => setIsFilterOpen(false)}
              ></div>
              <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl p-4 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Bộ lọc</h3>
                  <button onClick={() => setIsFilterOpen(false)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-3">Danh mục</h3>
                  <div className="space-y-2">
                    {(showAllCategories ? genres : genres.slice(0, 5)).map(
                      (category) => (
                        <div key={category?.id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`category-${category.id}`}
                            checked={selectedCategories.includes(
                              category?.name
                            )}
                            onChange={() =>
                              handleCategoryChange(category?.name)
                            }
                            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <label
                            htmlFor={`category-${category?.id}`}
                            className="ml-2 text-sm text-gray-700"
                          >
                            {category?.name}
                          </label>
                        </div>
                      )
                    )}

                    {genres.length > 5 && (
                      <button
                        onClick={() => setShowAllCategories(!showAllCategories)}
                        className="text-blue-600 hover:underline text-sm mt-2"
                      >
                        {showAllCategories ? "Thu gọn" : "Xem thêm"}
                      </button>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-3">Giá</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label
                        htmlFor="mobile-min-price"
                        className="text-sm text-gray-600 block mb-1"
                      >
                        Từ
                      </label>
                      <input
                        type="number"
                        id="mobile-min-price"
                        name="min"
                        value={priceRange.min}
                        onChange={handlePriceRangeChange}
                        placeholder="0đ"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="mobile-max-price"
                        className="text-sm text-gray-600 block mb-1"
                      >
                        Đến
                      </label>
                      <input
                        type="number"
                        id="mobile-max-price"
                        name="max"
                        value={priceRange.max}
                        onChange={handlePriceRangeChange}
                        placeholder="1.000.000đ"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 mt-auto">
                  <button
                    onClick={handleApplyFilter}
                    className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Áp dụng
                  </button>
                  <button
                    onClick={handleResetFilter}
                    className="w-full py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Products grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product?.productId}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <Link
                    to={`/product-detail/${product?.productId}`}
                    className="block"
                    // onClick={() => handleSelectProduct(product)}
                  >
                    <div className="relative">
                      <img
                        src={product?.imageName || "/placeholder.svg"}
                        alt={product?.productName}
                        className="w-full aspect-[3/4] object-cover"
                      />
                      {product?.promotionValue && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm">
                          -{product.promotionValue}%
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 mb-2 line-clamp-2 h-12">
                        {product?.productName}
                      </h3>

                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex text-yellow-400">
                          {[...Array(Math.floor(product?.rate))].map(
                            (_, index) => (
                              <i key={index} className="bi bi-star-fill"></i>
                            )
                          )}
                          {product?.rate % 1 !== 0 && (
                            <i className="bi bi-star-half"></i>
                          )}
                          {[...Array(5 - Math.ceil(product?.rate))].map(
                            (_, index) => (
                              <i key={index} className="bi bi-star"></i>
                            )
                          )}
                        </div>
                        {product?.countRateProduct > 0 && (
                          <span className="text-gray-500 text-sm">
                            ({formatSumCountReview(product?.countRateProduct)})
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <div>
                          {product?.discountPrice ? (
                            <>
                              <span className="text-red-600 font-bold text-lg">
                                {formatCurrency(product?.discountPrice)}
                              </span>
                              <span className="text-gray-500 line-through ml-2 text-sm">
                                {formatCurrency(product?.price)}
                              </span>
                            </>
                          ) : (
                            <span className="text-red-600 font-bold text-lg">
                              {formatCurrency(product?.price)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <Link
                          to={`/shop/${product?.shopId}`}
                          className="flex items-center text-gray-500 hover:text-gray-800 text-sm space-x-1"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="h-4 w-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 9.75L12 4.5l9 5.25M4.5 10.5v8.25A1.5 1.5 0 006 20.25h12a1.5 1.5 0 001.5-1.5V10.5M12 12v8.25"
                            />
                          </svg>
                          <span>{product?.shopName}</span>
                        </Link>
                        <div className="flex items-center text-gray-500 text-sm space-x-1 mt-1">
                          {product?.sold > 1000 && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-4 h-4 text-red-500"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 2C8.686 2 6 5.134 6 8.5c0 2.358 1.5 3.816 3 4.5-.75.5-1.5 1.25-1.5 2.5 0 1.381 1.119 2.5 2.5 2.5.828 0 1.5-.672 1.5-1.5S11.828 15 11 15c-.552 0-1 .448-1 1s.448 1 1 1 1-.448 1-1c0-.828-.672-1.5-1.5-1.5-.828 0-1.5.672-1.5 1.5S9.172 18 10 18c1.381 0 2.5-1.119 2.5-2.5 0-1.25-.75-2-1.5-2.5 1.5-.684 3-2.142 3-4.5C18 5.134 15.314 2 12 2z"
                              />
                            </svg>
                          )}
                          <span>Đã bán: {formatSold(product?.sold)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Không tìm thấy sản phẩm nào
              </h3>
              <p className="text-gray-600">
                Vui lòng thử lại với từ khóa khác hoặc điều chỉnh bộ lọc của
                bạn.
              </p>
            </div>
          )}

          {products.length > 0 && !loading && (
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center space-x-2">
                {/* Prev button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-full ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  ←
                </button>

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, index) => index + 1)
                  .filter((page) => {
                    return (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 2 && page <= currentPage + 2)
                    );
                  })
                  .map((page, index, arr) => {
                    const isEllipsis = index > 0 && page - arr[index - 1] > 1;

                    return (
                      <div key={page} className="flex items-center">
                        {isEllipsis && (
                          <span className="px-2 text-gray-400">...</span>
                        )}
                        <button
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1 rounded-full ${
                            currentPage === page
                              ? "bg-blue-600 text-white"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {page}
                        </button>
                      </div>
                    );
                  })}

                {/* Next button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-full ${
                    currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  →
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
