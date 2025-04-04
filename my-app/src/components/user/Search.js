"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sortBy, setSortBy] = useState("relevance")
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedRatings, setSelectedRatings] = useState([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Dữ liệu mẫu
  const categories = [
    { id: 1, name: "Văn học Việt Nam" },
    { id: 2, name: "Kinh tế - Quản lý" },
    { id: 3, name: "Kỹ năng sống" },
    { id: 4, name: "Sách thiếu nhi" },
    { id: 5, name: "Sách giáo khoa - Tham khảo" },
    { id: 6, name: "Sách ngoại ngữ" },
  ]

  const ratings = [5, 4, 3, 2, 1]

  // Dữ liệu mẫu cho sản phẩm
  const sampleProducts = [
    {
      id: 1,
      name: "Đắc Nhân Tâm",
      image: "https://placehold.co/300x400/2ecc71/ffffff?text=Đắc+Nhân+Tâm",
      shop: "Shop A",
      rate: 4.5,
      price: 150000,
      discountPrice: 120000,
      stock: 50,
      sold: 100,
      category: "Kỹ năng sống",
    },
    {
      id: 2,
      name: "Nhà Giả Kim",
      image: "https://placehold.co/300x400/3498db/ffffff?text=Nhà+Giả+Kim",
      shop: "Shop B",
      rate: 5.0,
      price: 120000,
      discountPrice: 100000,
      stock: 30,
      sold: 200,
      category: "Văn học Việt Nam",
    },
    {
      id: 3,
      name: "Tuổi Trẻ Đáng Giá Bao Nhiêu",
      image: "https://placehold.co/300x400/9b59b6/ffffff?text=Tuổi+Trẻ",
      shop: "Shop C",
      rate: 4.0,
      price: 90000,
      discountPrice: 75000,
      stock: 20,
      sold: 150,
      category: "Kỹ năng sống",
    },
    {
      id: 4,
      name: "Tôi Thấy Hoa Vàng Trên Cỏ Xanh",
      image: "https://placehold.co/300x400/e74c3c/ffffff?text=Hoa+Vàng",
      shop: "Shop D",
      rate: 4.8,
      price: 110000,
      discountPrice: 95000,
      stock: 40,
      sold: 180,
      category: "Văn học Việt Nam",
    },
    {
      id: 5,
      name: "Tiếng Anh Giao Tiếp Cơ Bản",
      image: "https://placehold.co/300x400/f39c12/ffffff?text=Tiếng+Anh",
      shop: "Shop E",
      rate: 4.2,
      price: 200000,
      discountPrice: 180000,
      stock: 25,
      sold: 120,
      category: "Sách ngoại ngữ",
    },
    {
      id: 6,
      name: "Toán Học Lớp 12",
      image: "https://placehold.co/300x400/1abc9c/ffffff?text=Toán+12",
      shop: "Shop F",
      rate: 4.0,
      price: 80000,
      discountPrice: 70000,
      stock: 60,
      sold: 90,
      category: "Sách giáo khoa - Tham khảo",
    },
    {
      id: 7,
      name: "Doraemon - Tập 1",
      image: "https://placehold.co/300x400/3498db/ffffff?text=Doraemon",
      shop: "Shop G",
      rate: 5.0,
      price: 30000,
      discountPrice: 25000,
      stock: 100,
      sold: 300,
      category: "Sách thiếu nhi",
    },
    {
      id: 8,
      name: "Kinh Tế Học Vĩ Mô",
      image: "https://placehold.co/300x400/e67e22/ffffff?text=Kinh+Tế",
      shop: "Shop H",
      rate: 4.3,
      price: 180000,
      discountPrice: 160000,
      stock: 35,
      sold: 110,
      category: "Kinh tế - Quản lý",
    },
    
    {
      id: 9,
      name: "Kinh Tế Học Vĩ Mô",
      image: "https://placehold.co/300x400/e67e22/ffffff?text=Kinh+Tế",
      shop: "Shop H",
      rate: 4.3,
      price: 180000,
      discountPrice: 160000,
      stock: 35,
      sold: 110,
      category: "Kinh tế - Quản lý",
    },
    
    {
      id: 10,
      name: "Kinh Tế Học Vĩ Mô",
      image: "https://placehold.co/300x400/e67e22/ffffff?text=Kinh+Tế",
      shop: "Shop H",
      rate: 4.3,
      price: 180000,
      discountPrice: 160000,
      stock: 35,
      sold: 110,
      category: "Kinh tế - Quản lý",
    },
    
    {
      id: 11,
      name: "Kinh Tế Học Vĩ Mô",
      image: "https://placehold.co/300x400/e67e22/ffffff?text=Kinh+Tế",
      shop: "Shop H",
      rate: 4.3,
      price: 180000,
      discountPrice: 160000,
      stock: 35,
      sold: 110,
      category: "Kinh tế - Quản lý",
    },
    {
        id: 12,
        name: "Kinh Tế Học Vĩ Mô",
        image: "https://placehold.co/300x400/e67e22/ffffff?text=Kinh+Tế",
        shop: "Shop H",
        rate: 4.3,
        price: 180000,
        discountPrice: 160000,
        stock: 35,
        sold: 110,
        category: "Kinh tế - Quản lý",
      },
      {
        id: 13,
        name: "Kinh Tế Học Vĩ Mô",
        image: "https://placehold.co/300x400/e67e22/ffffff?text=Kinh+Tế",
        shop: "Shop H",
        rate: 4.3,
        price: 180000,
        discountPrice: 160000,
        stock: 35,
        sold: 110,
        category: "Kinh tế - Quản lý",
      },
      {
        id: 14,
        name: "Kinh Tế Học Vĩ Mô",
        image: "https://placehold.co/300x400/e67e22/ffffff?text=Kinh+Tế",
        shop: "Shop H",
        rate: 4.3,
        price: 180000,
        discountPrice: 160000,
        stock: 35,
        sold: 110,
        category: "Kinh tế - Quản lý",
      },
      {
        id: 15,
        name: "Kinh Tế Học Vĩ Mô",
        image: "https://placehold.co/300x400/e67e22/ffffff?text=Kinh+Tế",
        shop: "Shop H",
        rate: 4.3,
        price: 180000,
        discountPrice: 160000,
        stock: 35,
        sold: 110,
        category: "Kinh tế - Quản lý",
      },
      {
        id: 16,
        name: "Kinh Tế Học Vĩ Mô",
        image: "https://placehold.co/300x400/e67e22/ffffff?text=Kinh+Tế",
        shop: "Shop H",
        rate: 4.3,
        price: 180000,
        discountPrice: 160000,
        stock: 35,
        sold: 110,
        category: "Kinh tế - Quản lý",
      },
      {
        id: 17,
        name: "Kinh Tế Học Vĩ Mô",
        image: "https://placehold.co/300x400/e67e22/ffffff?text=Kinh+Tế",
        shop: "Shop H",
        rate: 4.3,
        price: 180000,
        discountPrice: 160000,
        stock: 35,
        sold: 110,
        category: "Kinh tế - Quản lý",
      },
      {
        id: 18,
        name: "Kinh Tế Học Vĩ Mô",
        image: "https://placehold.co/300x400/e67e22/ffffff?text=Kinh+Tế",
        shop: "Shop H",
        rate: 4.3,
        price: 180000,
        discountPrice: 160000,
        stock: 35,
        sold: 110,
        category: "Kinh tế - Quản lý",
      },
      {
        id: 19,
        name: "Kinh Tế Học Vĩ Mô",
        image: "https://placehold.co/300x400/e67e22/ffffff?text=Kinh+Tế",
        shop: "Shop H",
        rate: 4.3,
        price: 180000,
        discountPrice: 160000,
        stock: 35,
        sold: 110,
        category: "Kinh tế - Quản lý",
      },
      {
        id: 20,
        name: "Kinh Tế Học Vĩ Mô",
        image: "https://placehold.co/300x400/e67e22/ffffff?text=Kinh+Tế",
        shop: "Shop H",
        rate: 4.3,
        price: 180000,
        discountPrice: 160000,
        stock: 35,
        sold: 110,
        category: "Kinh tế - Quản lý",
      },
      {
        id: 21,
        name: "Kinh Tế Học Vĩ Mô",
        image: "https://placehold.co/300x400/e67e22/ffffff?text=Kinh+Tế",
        shop: "Shop H",
        rate: 4.3,
        price: 180000,
        discountPrice: 160000,
        stock: 35,
        sold: 110,
        category: "Kinh tế - Quản lý",
      },
      {
        id: 22,
        name: "Kinh Tế Học Vĩ Mô",
        image: "https://placehold.co/300x400/e67e22/ffffff?text=Kinh+Tế",
        shop: "Shop H",
        rate: 4.3,
        price: 180000,
        discountPrice: 160000,
        stock: 35,
        sold: 110,
        category: "Kinh tế - Quản lý",
      },
      {
        id: 23,
        name: "Kinh Tế Học Vĩ Mô",
        image: "https://placehold.co/300x400/e67e22/ffffff?text=Kinh+Tế",
        shop: "Shop H",
        rate: 4.3,
        price: 180000,
        discountPrice: 160000,
        stock: 35,
        sold: 110,
        category: "Kinh tế - Quản lý",
      },
      {
        id: 24,
        name: "Kinh Tế Học Vĩ Mô",
        image: "https://placehold.co/300x400/e67e22/ffffff?text=Kinh+Tế",
        shop: "Shop H",
        rate: 4.3,
        price: 180000,
        discountPrice: 160000,
        stock: 35,
        sold: 110,
        category: "Kinh tế - Quản lý",
      },
  ]

  useEffect(() => {
    // Mô phỏng việc tải dữ liệu từ API
    setLoading(true)
    const keyword = searchParams.get("keyword") || ""
    const category = searchParams.get("category") || ""

    // Lọc sản phẩm theo từ khóa và danh mục
    let filteredProducts = [...sampleProducts]

    if (keyword) {
      filteredProducts = filteredProducts.filter((product) =>
        product.name.toLowerCase().includes(keyword.toLowerCase()),
      )
    }

    if (selectedCategories.length > 0) {
      filteredProducts = filteredProducts.filter((product) => selectedCategories.includes(product.category))
    }

    if (selectedRatings.length > 0) {
      filteredProducts = filteredProducts.filter((product) => selectedRatings.includes(Math.floor(product.rate)))
    }

    if (priceRange.min !== "") {
      filteredProducts = filteredProducts.filter((product) => product.discountPrice >= Number.parseInt(priceRange.min))
    }

    if (priceRange.max !== "") {
      filteredProducts = filteredProducts.filter((product) => product.discountPrice <= Number.parseInt(priceRange.max))
    }

    // Sắp xếp sản phẩm
    switch (sortBy) {
      case "price-asc":
        filteredProducts.sort((a, b) => a.discountPrice - b.discountPrice)
        break
      case "price-desc":
        filteredProducts.sort((a, b) => b.discountPrice - a.discountPrice)
        break
      case "rating":
        filteredProducts.sort((a, b) => b.rate - a.rate)
        break
      case "bestseller":
        filteredProducts.sort((a, b) => b.sold - a.sold)
        break
      default:
        // Mặc định sắp xếp theo độ phù hợp (giữ nguyên thứ tự)
        break
    }

    setProducts(filteredProducts)
    setTotalPages(Math.ceil(filteredProducts.length / 12))

    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [searchParams, sortBy, selectedCategories, selectedRatings, priceRange])

  const handleSortChange = (e) => {
    setSortBy(e.target.value)
  }

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((cat) => cat !== category)
      } else {
        return [...prev, category]
      }
    })
  }

  const handleRatingChange = (rating) => {
    setSelectedRatings((prev) => {
      if (prev.includes(rating)) {
        return prev.filter((r) => r !== rating)
      } else {
        return [...prev, rating]
      }
    })
  }

  const handlePriceRangeChange = (e) => {
    const { name, value } = e.target
    setPriceRange((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo(0, 0)
  }

  const handleApplyFilter = () => {
    // Đóng filter trên mobile sau khi áp dụng
    setIsFilterOpen(false)
  }

  const handleResetFilter = () => {
    setSelectedCategories([])
    setSelectedRatings([])
    setPriceRange({ min: "", max: "" })
  }

  const keyword = searchParams.get("keyword") || ""

  return (
    <div className="container mx-auto px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {keyword ? `Kết quả tìm kiếm cho "${keyword}"` : "Tất cả sản phẩm"}
        </h1>
        <p className="text-gray-600 mt-1">Tìm thấy {products.length} sản phẩm</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter sidebar - Desktop */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3">Danh mục</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`category-${category.id}`}
                      checked={selectedCategories.includes(category.name)}
                      onChange={() => handleCategoryChange(category.name)}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor={`category-${category.id}`} className="ml-2 text-sm text-gray-700">
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3">Giá</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="min-price" className="text-sm text-gray-600 block mb-1">
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
                  <label htmlFor="max-price" className="text-sm text-gray-600 block mb-1">
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

            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3">Đánh giá</h3>
              <div className="space-y-2">
                {ratings.map((rating) => (
                  <div key={rating} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`rating-${rating}`}
                      checked={selectedRatings.includes(rating)}
                      onChange={() => handleRatingChange(rating)}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor={`rating-${rating}`} className="ml-2 flex items-center">
                      <div className="flex text-yellow-400">
                        {[...Array(rating)].map((_, i) => (
                          <i key={i} className="bi bi-star-fill"></i>
                        ))}
                        {[...Array(5 - rating)].map((_, i) => (
                          <i key={i} className="bi bi-star text-gray-300"></i>
                        ))}
                      </div>
                      <span className="text-sm text-gray-700 ml-1">trở lên</span>
                    </label>
                  </div>
                ))}
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
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
              <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsFilterOpen(false)}></div>
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-3">Danh mục</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`mobile-category-${category.id}`}
                          checked={selectedCategories.includes(category.name)}
                          onChange={() => handleCategoryChange(category.name)}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <label htmlFor={`mobile-category-${category.id}`} className="ml-2 text-sm text-gray-700">
                          {category.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-3">Giá</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="mobile-min-price" className="text-sm text-gray-600 block mb-1">
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
                      <label htmlFor="mobile-max-price" className="text-sm text-gray-600 block mb-1">
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

                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-3">Đánh giá</h3>
                  <div className="space-y-2">
                    {ratings.map((rating) => (
                      <div key={rating} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`mobile-rating-${rating}`}
                          checked={selectedRatings.includes(rating)}
                          onChange={() => handleRatingChange(rating)}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <label htmlFor={`mobile-rating-${rating}`} className="ml-2 flex items-center">
                          <div className="flex text-yellow-400">
                            {[...Array(rating)].map((_, i) => (
                              <i key={i} className="bi bi-star-fill"></i>
                            ))}
                            {[...Array(5 - rating)].map((_, i) => (
                              <i key={i} className="bi bi-star text-gray-300"></i>
                            ))}
                          </div>
                          <span className="text-sm text-gray-700 ml-1">trở lên</span>
                        </label>
                      </div>
                    ))}
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
                  key={product.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <a href={`/product-detail/${product.id}`} className="block">
                    <div className="relative">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full aspect-[3/4] object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm">
                        -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 mb-2 line-clamp-2 h-12">{product.name}</h3>

                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex text-yellow-400">
                          {[...Array(Math.floor(product.rate))].map((_, index) => (
                            <i key={index} className="bi bi-star-fill"></i>
                          ))}
                          {product.rate % 1 !== 0 && <i className="bi bi-star-half"></i>}
                          {[...Array(5 - Math.ceil(product.rate))].map((_, index) => (
                            <i key={index} className="bi bi-star"></i>
                          ))}
                        </div>
                        <span className="text-gray-600 text-sm">({product.rate})</span>
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="text-red-600 font-bold text-lg">
                            {product.discountPrice.toLocaleString()}đ
                          </span>
                          <span className="text-gray-500 line-through ml-2 text-sm">
                            {product.price.toLocaleString()}đ
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">
                          {product.shop}
                        </a>
                        <span className="text-gray-500 text-sm">Đã bán {product.sold}</span>
                      </div>
                    </div>
                  </a>
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
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Không tìm thấy sản phẩm nào</h3>
              <p className="text-gray-600">Vui lòng thử lại với từ khóa khác hoặc điều chỉnh bộ lọc của bạn.</p>
            </div>
          )}

          {/* Pagination */}
          {products.length > 0 && (
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === index + 1 ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Search

