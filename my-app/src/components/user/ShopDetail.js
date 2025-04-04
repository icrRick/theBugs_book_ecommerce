"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Navigation, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"

const ShopDetail = () => {
  const { id } = useParams()
  const [shop, setShop] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isFollowing, setIsFollowing] = useState(false)
  const [showAllCategories, setShowAllCategories] = useState(false)

  // Giả lập dữ liệu cửa hàng
  useEffect(() => {
    const fetchShopData = async () => {
      setLoading(true)
      try {
        // Giả lập API call
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Dữ liệu mẫu cho cửa hàng
        const shopData = {
          id: id || "1",
          name: "Nhà Sách Phương Nam",
          logo: "https://placehold.co/200x200/2ecc71/ffffff?text=Logo",
          banner: "https://placehold.co/1200x300/3498db/ffffff?text=Banner+Nhà+Sách+Phương+Nam",
          description:
            "Nhà sách Phương Nam là hệ thống nhà sách uy tín hàng đầu Việt Nam, cung cấp đa dạng sách trong nước và quốc tế với chất lượng đảm bảo và dịch vụ chuyên nghiệp.",
          rating: 4.8,
          followers: 15243,
          productsCount: 1568,
          responseRate: 98,
          responseTime: "trong vòng 5 phút",
          joinDate: "2018-05-15",
          location: "TP. Hồ Chí Minh",
          isVerified: true,
          operatingHours: "08:00 - 22:00",
          contact: {
            phone: "1900 6656",
            email: "cskh@nhasachphuongnam.com",
            website: "https://nhasachphuongnam.com",
          },
          socialLinks: {
            facebook: "https://facebook.com/nhasachphuongnam",
            instagram: "https://instagram.com/nhasachphuongnam",
            youtube: "https://youtube.com/nhasachphuongnam",
          },
          categories: [
            { id: 1, name: "Văn học Việt Nam", count: 245 },
            { id: 2, name: "Văn học nước ngoài", count: 312 },
            { id: 3, name: "Sách thiếu nhi", count: 189 },
            { id: 4, name: "Sách giáo khoa", count: 156 },
            { id: 5, name: "Sách tham khảo", count: 178 },
            { id: 6, name: "Kinh tế", count: 134 },
            { id: 7, name: "Kỹ năng sống", count: 98 },
            { id: 8, name: "Ngoại ngữ", count: 87 },
            { id: 9, name: "Văn phòng phẩm", count: 169 },
          ],
          promotions: [
            {
              id: 1,
              title: "Giảm 20% cho đơn hàng từ 300K",
              image: "https://placehold.co/800x300/e74c3c/ffffff?text=Giảm+20%+cho+đơn+hàng+từ+300K",
              endDate: "2025-04-30",
            },
            {
              id: 2,
              title: "Freeship cho đơn từ 150K",
              image: "https://placehold.co/800x300/9b59b6/ffffff?text=Freeship+cho+đơn+từ+150K",
              endDate: "2025-05-15",
            },
            {
              id: 3,
              title: "Mua 2 tặng 1 sách thiếu nhi",
              image: "https://placehold.co/800x300/f1c40f/ffffff?text=Mua+2+tặng+1+sách+thiếu+nhi",
              endDate: "2025-04-20",
            },
          ],
          policies: [
            {
              id: 1,
              title: "Đổi trả miễn phí",
              description: "Đổi trả sản phẩm trong vòng 7 ngày",
              icon: "bi-arrow-repeat",
            },
            {
              id: 2,
              title: "Giao hàng toàn quốc",
              description: "Freeship cho đơn hàng từ 150.000đ",
              icon: "bi-truck",
            },
            {
              id: 3,
              title: "Thanh toán an toàn",
              description: "Nhiều phương thức thanh toán",
              icon: "bi-shield-check",
            },
            {
              id: 4,
              title: "Hỗ trợ 24/7",
              description: "Luôn sẵn sàng hỗ trợ khách hàng",
              icon: "bi-headset",
            },
          ],
        }

        setShop(shopData)

        // Dữ liệu mẫu cho sản phẩm
        const productData = Array(24)
          .fill(null)
          .map((_, index) => ({
            id: index + 1,
            name: `Sách ${index + 1} - ${
              ["Văn học", "Thiếu nhi", "Kinh tế", "Kỹ năng sống", "Ngoại ngữ"][Math.floor(Math.random() * 5)]
            }`,
            image: `https://placehold.co/300x400/${
              ["2ecc71", "3498db", "9b59b6", "e74c3c", "f1c40f", "1abc9c"][Math.floor(Math.random() * 6)]
            }/ffffff?text=Sách+${index + 1}`,
            category: ["Văn học Việt Nam", "Văn học nước ngoài", "Sách thiếu nhi", "Kinh tế", "Kỹ năng sống"][
              Math.floor(Math.random() * 5)
            ],
            price: Math.floor(Math.random() * 200000) + 50000,
            discountPrice: Math.floor(Math.random() * 150000) + 40000,
            rating: (Math.random() * 2 + 3).toFixed(1),
            sold: Math.floor(Math.random() * 500) + 10,
            isNew: Math.random() > 0.7,
            isBestseller: Math.random() > 0.8,
          }))

        setProducts(productData)
        setTotalPages(Math.ceil(productData.length / 12))
      } catch (error) {
        console.error("Error fetching shop data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchShopData()
  }, [id])

  // Xử lý lọc sản phẩm theo tab
  const filteredProducts = () => {
    let filtered = [...products]

    // Lọc theo danh mục
    if (activeTab !== "all") {
      filtered = filtered.filter((product) => product.category === activeTab)
    }

    // Sắp xếp
    switch (sortBy) {
      case "newest":
        // Giữ nguyên thứ tự (giả định là đã sắp xếp theo mới nhất)
        break
      case "price-asc":
        filtered.sort((a, b) => a.discountPrice - b.discountPrice)
        break
      case "price-desc":
        filtered.sort((a, b) => b.discountPrice - a.discountPrice)
        break
      case "bestseller":
        filtered.sort((a, b) => b.sold - a.sold)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      default:
        break
    }

    return filtered
  }

  // Xử lý phân trang
  const paginatedProducts = () => {
    const filtered = filteredProducts()
    const startIndex = (currentPage - 1) * 12
    const endIndex = startIndex + 12
    return filtered.slice(startIndex, endIndex)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleFollowShop = () => {
    setIsFollowing(!isFollowing)
  }

  // Format số lượng người theo dõi
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!shop) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">Không tìm thấy cửa hàng</h2>
        <p className="text-gray-600 mt-2">Cửa hàng bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4">
      {/* Banner và thông tin cửa hàng */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        {/* Banner */}
        <div className="relative h-48 md:h-64 bg-gray-200">
          <img src={shop.banner || "/placeholder.svg"} alt={shop.name} className="w-full h-full object-cover" />
        </div>

        {/* Thông tin cửa hàng */}
        <div className="p-6 relative">
          <div className="flex flex-col md:flex-row">
            {/* Logo và thông tin cơ bản */}
            <div className="flex flex-col md:flex-row items-center md:items-start">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white bg-white shadow-md overflow-hidden -mt-16 md:-mt-20 mb-4 md:mb-0 md:mr-6 flex-shrink-0">
                <img
                  src={shop.logo || "/placeholder.svg"}
                  alt={`${shop.name} logo`}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{shop.name}</h1>
                  {shop.isVerified && (
                    <span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full ml-0 md:ml-2 mt-1 md:mt-0">
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
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4">
                  <div className="flex items-center">
                    <div className="flex text-yellow-400 mr-1">
                      <i className="bi bi-star-fill"></i>
                    </div>
                    <span className="font-medium">{shop.rating}</span>
                  </div>
                  <div className="flex items-center">
                    <i className="bi bi-people text-gray-600 mr-1"></i>
                    <span>{formatNumber(shop.followers)} người theo dõi</span>
                  </div>
                  <div className="flex items-center">
                    <i className="bi bi-box text-gray-600 mr-1"></i>
                    <span>{shop.productsCount} sản phẩm</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 max-w-2xl">{shop.description}</p>

                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <button
                    onClick={handleFollowShop}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                      isFollowing
                        ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                  >
                    <i className={`bi ${isFollowing ? "bi-check-lg" : "bi-plus-lg"}`}></i>
                    {isFollowing ? "Đang theo dõi" : "Theo dõi"}
                  </button>
                  <a
                    href={`https://m.me/${shop.socialLinks.facebook.split("/").pop()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <i className="bi bi-chat-dots"></i>
                    Chat ngay
                  </a>
                </div>
              </div>
            </div>

            {/* Thông tin bổ sung */}
            <div className="mt-6 md:mt-0 md:ml-auto flex flex-col items-center md:items-end">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 w-full md:w-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm">Tỷ lệ phản hồi</p>
                    <p className="font-semibold text-green-600">{shop.responseRate}%</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Thời gian phản hồi</p>
                    <p className="font-semibold">{shop.responseTime}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Tham gia</p>
                    <p className="font-semibold">{new Date(shop.joinDate).getFullYear()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Khu vực</p>
                    <p className="font-semibold">{shop.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Khuyến mãi */}
      {shop.promotions && shop.promotions.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Khuyến mãi từ shop</h2>
          <Swiper
            modules={[Pagination, Navigation, Autoplay]}
            spaceBetween={16}
            slidesPerView={1}
            pagination={{ clickable: true }}
            navigation
            autoplay={{ delay: 5000 }}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="shop-promotions-swiper"
          >
            {shop.promotions.map((promo) => (
              <SwiperSlide key={promo.id}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
                  <img src={promo.image || "/placeholder.svg"} alt={promo.title} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800">{promo.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Hết hạn: {new Date(promo.endDate).toLocaleDateString("vi-VN")}
                    </p>
                    <button className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 w-full">
                      Sử dụng ngay
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* Chính sách cửa hàng */}
      {shop.policies && shop.policies.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {shop.policies.map((policy) => (
              <div key={policy.id} className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <i className={`bi ${policy.icon} text-blue-600 text-xl`}></i>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{policy.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{policy.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Danh mục và sản phẩm */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar - Danh mục */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
            <h3 className="font-semibold text-lg mb-3 pb-2 border-b border-gray-200">Danh mục sản phẩm</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => {
                    setActiveTab("all")
                    setCurrentPage(1)
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    activeTab === "all" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"
                  }`}
                >
                  Tất cả sản phẩm
                </button>
              </li>
              {shop.categories.slice(0, showAllCategories ? shop.categories.length : 5).map((category) => (
                <li key={category.id}>
                  <button
                    onClick={() => {
                      setActiveTab(category.name)
                      setCurrentPage(1)
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors flex justify-between items-center ${
                      activeTab === category.name ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"
                    }`}
                  >
                    <span>{category.name}</span>
                    <span className="text-xs text-gray-500">({category.count})</span>
                  </button>
                </li>
              ))}
            </ul>
            {shop.categories.length > 5 && (
              <button
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="mt-3 text-blue-600 hover:text-blue-800 text-sm flex items-center"
              >
                {showAllCategories ? "Thu gọn" : "Xem thêm"}
                <i className={`bi ${showAllCategories ? "bi-chevron-up" : "bi-chevron-down"} ml-1`}></i>
              </button>
            )}

            
        
          </div>
        </div>

        {/* Main content - Sản phẩm */}
        <div className="flex-1">
          {/* Sort bar */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-bold text-gray-800">{activeTab === "all" ? "Tất cả sản phẩm" : activeTab}</h2>
              <div className="flex items-center">
                <span className="text-gray-700 mr-2">Sắp xếp theo:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="bestseller">Bán chạy</option>
                  <option value="price-asc">Giá: Thấp đến cao</option>
                  <option value="price-desc">Giá: Cao đến thấp</option>
                  <option value="rating">Đánh giá cao</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {paginatedProducts().map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <Link to={`/product-detail/${product.id}`} className="block">
                  <div className="relative">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full aspect-[3/4] object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm">
                      -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                    </div>
                    {product.isNew && (
                      <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-md text-sm">
                        Mới
                      </div>
                    )}
                    {product.isBestseller && (
                      <div className="absolute bottom-2 left-2 bg-amber-500 text-white px-2 py-1 rounded-md text-sm">
                        Bán chạy
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-800 mb-2 line-clamp-2 h-12">{product.name}</h3>

                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(Math.floor(product.rating))].map((_, index) => (
                          <i key={index} className="bi bi-star-fill"></i>
                        ))}
                        {product.rating % 1 !== 0 && <i className="bi bi-star-half"></i>}
                        {[...Array(5 - Math.ceil(product.rating))].map((_, index) => (
                          <i key={index} className="bi bi-star"></i>
                        ))}
                      </div>
                      <span className="text-gray-600 text-sm">({product.rating})</span>
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
                      <span className="text-gray-500 text-sm">Đã bán {product.sold}</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
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

export default ShopDetail

