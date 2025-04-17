"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Autoplay, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import ChatButton from "./ChatButton"

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

  const [countdown, setCountdown] = useState({
    hours: 5,
    minutes: 30,
    seconds: 0,
  })

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

  // Effect for countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

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
      <div className="flex justify-center items-center h-screen">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-t-transparent border-b-transparent border-r-transparent border-l-indigo-500 animate-spin"></div>
          <div className="absolute top-2 left-2 right-2 bottom-2 rounded-full border-4 border-t-transparent border-b-transparent border-r-transparent border-l-indigo-400 animate-spin animation-delay-150"></div>
        </div>
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
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Banner và thông tin cửa hàng */}
      <div className="relative">
        {/* Banner */}
        <div className="h-40 md:h-60 overflow-hidden">
          <img src={shop.banner || "/placeholder.svg"} alt={shop.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
        </div>

        {/* Shop Info */}
        <div className="container mx-auto px-4">
          <div className="relative -mt-16 md:-mt-20">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex flex-col md:flex-row items-start gap-6">
                {/* Logo */}
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white bg-white shadow-sm overflow-hidden flex-shrink-0 mx-auto md:mx-0">
                  <img
                    src={shop.logo || "/placeholder.svg"}
                    alt={`${shop.name} logo`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Shop Info */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 mb-3">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800">{shop.name}</h1>
                    {shop.isVerified && (
                      <span className="inline-flex items-center bg-indigo-50 text-indigo-700 text-xs font-medium px-2 py-0.5 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3.5 w-3.5 mr-1"
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

                  <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <div className="flex text-yellow-400 mr-1">
                        <i className="bi bi-star-fill"></i>
                      </div>
                      <span>{shop.rating}</span>
                    </div>
                    <div className="flex items-center">
                      <i className="bi bi-people text-gray-500 mr-1"></i>
                      <span>{formatNumber(shop.followers)} người theo dõi</span>
                    </div>
                    <div className="flex items-center">
                      <i className="bi bi-box text-gray-500 mr-1"></i>
                      <span>{shop.productsCount} sản phẩm</span>
                    </div>
                    <div className="flex items-center">
                      <i className="bi bi-geo-alt text-gray-500 mr-1"></i>
                      <span>{shop.location}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 max-w-3xl">{shop.description}</p>

                  <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <button
                      onClick={handleFollowShop}
                      className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                        isFollowing
                          ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          : "bg-indigo-600 text-white hover:bg-indigo-700"
                      }`}
                    >
                      <i className={`bi ${isFollowing ? "bi-check-lg" : "bi-plus-lg"}`}></i>
                      {isFollowing ? "Đang theo dõi" : "Theo dõi"}
                    </button>
                    <ChatButton shop={shop} />
                  </div>
                </div>

                {/* Shop Stats */}
                <div className="mt-6 md:mt-0 w-full md:w-auto">
                  <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 w-full">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Tỷ lệ phản hồi</p>
                        <p className="font-medium text-indigo-600">{shop.responseRate}%</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Thời gian phản hồi</p>
                        <p className="font-medium">{shop.responseTime}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Tham gia</p>
                        <p className="font-medium">{new Date(shop.joinDate).getFullYear()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Giờ hoạt động</p>
                        <p className="font-medium">{shop.operatingHours}</p>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-indigo-100">
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <a
                            href={shop.socialLinks.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                          >
                            <i className="bi bi-facebook"></i>
                          </a>
                          <a
                            href={shop.socialLinks.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-pink-100 text-pink-600 hover:bg-pink-600 hover:text-white transition-colors"
                          >
                            <i className="bi bi-instagram"></i>
                          </a>
                          <a
                            href={shop.socialLinks.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                          >
                            <i className="bi bi-youtube"></i>
                          </a>
                        </div>
                        <a
                          href={`tel:${shop.contact.phone}`}
                          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                        >
                          <i className="bi bi-telephone-fill mr-1"></i>
                          {shop.contact.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-6">
        {/* Flash Sale Section */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-5 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-yellow-300"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Flash Sale</h2>
                  <p className="text-white text-opacity-80 text-sm">Ưu đãi đặc biệt từ Nhà Sách Phương Nam</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-white text-sm">Kết thúc sau:</div>
                <div className="flex space-x-2">
                  <div className="bg-white rounded-md px-2 py-1 shadow-sm">
                    <div className="text-center">
                      <div className="text-lg font-medium text-indigo-600">
                        {countdown.hours.toString().padStart(2, "0")}
                      </div>
                      <div className="text-xs text-gray-500">Giờ</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-md px-2 py-1 shadow-sm">
                    <div className="text-center">
                      <div className="text-lg font-medium text-indigo-600">
                        {countdown.minutes.toString().padStart(2, "0")}
                      </div>
                      <div className="text-xs text-gray-500">Phút</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-md px-2 py-1 shadow-sm">
                    <div className="text-center">
                      <div className="text-lg font-medium text-indigo-600">
                        {countdown.seconds.toString().padStart(2, "0")}
                      </div>
                      <div className="text-xs text-gray-500">Giây</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <Swiper
                modules={[Navigation, Autoplay, Pagination]}
                spaceBetween={16}
                slidesPerView={1}
                breakpoints={{
                  640: {
                    slidesPerView: 2,
                  },
                  768: {
                    slidesPerView: 3,
                  },
                  1024: {
                    slidesPerView: 4,
                  },
                }}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000 }}
                className="flash-sale-swiper pb-8"
              >
                {products
                  .filter((product) => product.discountPrice < product.price)
                  .slice(0, 8)
                  .map((product) => (
                    <SwiperSlide key={product.id}>
                      <div className="bg-white rounded-lg overflow-hidden shadow-sm transform transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                        <div className="relative">
                          <Link to={`/product-detail/${product.id}`}>
                            <img
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              className="w-full h-40 object-cover"
                            />
                            <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs">
                              -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                            </div>
                          </Link>
                        </div>
                        <Link to={`/product-detail/${product.id}`}>
                          <div className="p-3">
                            <h3 className="font-medium text-gray-800 mb-1 line-clamp-1 text-sm">{product.name}</h3>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <span className="text-red-600 font-bold text-sm">
                                  {product.discountPrice.toLocaleString()}đ
                                </span>
                                <span className="text-gray-400 line-through text-xs ml-2">
                                  {product.price.toLocaleString()}đ
                                </span>
                              </div>
                            </div>
                            <div className="mt-2">
                              <div className="relative w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
                                  style={{ width: `${Math.min(100, (product.sold / (product.sold + 50)) * 100)}%` }}
                                ></div>
                              </div>
                              <div className="flex justify-between text-xs mt-1">
                                <span className="text-gray-600">Đã bán {product.sold}</span>
                                <span className="text-gray-500">Còn lại {50}</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </SwiperSlide>
                  ))}
              </Swiper>
            </div>
          </div>
        </section>

        {/* Danh mục và sản phẩm */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Danh mục */}
          <div className="w-full lg:w-56 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-4 sticky top-4">
              <h3 className="font-medium text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center">
                <i className="bi bi-grid-3x3-gap-fill mr-2 text-indigo-600"></i>
                Danh mục sản phẩm
              </h3>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => {
                      setActiveTab("all")
                      setCurrentPage(1)
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                      activeTab === "all"
                        ? "bg-indigo-50 text-indigo-600 font-medium"
                        : "hover:bg-gray-50 text-gray-600"
                    }`}
                  >
                    <i className="bi bi-collection mr-2"></i>
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
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex justify-between items-center text-sm ${
                        activeTab === category.name
                          ? "bg-indigo-50 text-indigo-600 font-medium"
                          : "hover:bg-gray-50 text-gray-600"
                      }`}
                    >
                      <span className="flex items-center">
                        <i className="bi bi-bookmark mr-2"></i>
                        {category.name}
                      </span>
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
                        {category.count}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              {shop.categories.length > 5 && (
                <button
                  onClick={() => setShowAllCategories(!showAllCategories)}
                  className="mt-3 text-indigo-600 hover:text-indigo-800 text-sm flex items-center w-full justify-center py-2"
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
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-lg font-medium text-gray-800 flex items-center">
                  {activeTab === "all" ? (
                    <>
                      <i className="bi bi-grid-3x3-gap mr-2 text-indigo-600"></i>
                      Tất cả sản phẩm
                    </>
                  ) : (
                    <>
                      <i className="bi bi-bookmark mr-2 text-indigo-600"></i>
                      {activeTab}
                    </>
                  )}
                </h2>
                <div className="flex items-center">
                  <span className="text-gray-600 text-sm mr-2">Sắp xếp theo:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {paginatedProducts().map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 group"
                >
                  <Link to={`/product-detail/${product.id}`} className="block">
                    <div className="relative">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full aspect-[3/4] object-cover transform group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-1.5 py-0.5 rounded text-xs">
                        -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                      </div>
                      {product.isNew && (
                        <div className="absolute top-2 left-2 bg-indigo-500 text-white px-1.5 py-0.5 rounded text-xs">
                          Mới
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-gray-800 mb-1 line-clamp-2 text-sm h-10 group-hover:text-indigo-600 transition-colors">
                        {product.name}
                      </h3>

                      <div className="flex items-center gap-1 mb-1">
                        <div className="flex text-yellow-400 text-xs">
                          {[...Array(Math.floor(product.rating))].map((_, index) => (
                            <i key={index} className="bi bi-star-fill"></i>
                          ))}
                          {product.rating % 1 !== 0 && <i className="bi bi-star-half"></i>}
                          {[...Array(5 - Math.ceil(product.rating))].map((_, index) => (
                            <i key={index} className="bi bi-star"></i>
                          ))}
                        </div>
                        <span className="text-gray-500 text-xs">({product.rating})</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-indigo-600 font-bold text-sm">
                            {product.discountPrice.toLocaleString()}đ
                          </span>
                          <span className="text-gray-400 line-through ml-1 text-xs">
                            {product.price.toLocaleString()}đ
                          </span>
                        </div>
                        <span className="text-gray-500 text-xs">Đã bán {product.sold}</span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-2 py-1 rounded-lg ${
                      currentPage === 1
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
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
                      className={`w-8 h-8 rounded-lg ${
                        currentPage === index + 1
                          ? "bg-indigo-600 text-white"
                          : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-2 py-1 rounded-lg ${
                      currentPage === totalPages
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
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

      {/* Chat Popup */}
    </div>
  )
}

export default ShopDetail
