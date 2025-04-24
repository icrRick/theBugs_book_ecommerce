"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/autoplay"
import "swiper/css/effect-fade"
import "swiper/css/effect-coverflow"
import "../../assets/css/home.css"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

const Home = () => {
  const [activeTab, setActiveTab] = useState("popular")
  const [countdown, setCountdown] = useState({
    hours: 5,
    minutes: 30,
    seconds: 0,
  })
  const genreColors = [
    "from-blue-500/50 to-transparent",
    "from-green-500/50 to-transparent",
    "from-red-500/50 to-transparent",
    "from-purple-500/50 to-transparent",
    "from-yellow-500/50 to-transparent",
    "from-pink-500/50 to-transparent",
    "from-indigo-500/50 to-transparent",
    "from-teal-500/50 to-transparent",
    "from-orange-500/50 to-transparent",
    "from-cyan-500/50 to-transparent",
    "from-gray-500/50 to-transparent",
    "from-lime-500/50 to-transparent",
  ]
  const [isVisible, setIsVisible] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [featuredAuthors, setFeaturedAuthors] = useState([])
  const [genres, setGenres] = useState([])
  const [products, setProducts] = useState([])
  const [promotions, setPromotions] = useState([])
  const [flashSaleShops, setFlashSaleShops] = useState([])
  const [productLimit, setProductLimit] = useState(20)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)

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

  // Effect for fade-in animations
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(true)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Fetch products based on active tab
  const fetchProducts = async (filter = "", page = 1) => {
    setLoadingProducts(true)
    try {
      const response = await axios.get(`http://localhost:8080/home/products?page=${page}&filter=${filter}`)
      if (response.data.status) {
        const productsData = response.data.data || []
        setProducts(productsData)
        setTotalProducts(productsData.length)
      } else {
        console.error("Error fetching products:", response.data.message)
        setProducts([])
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      setProducts([])
    } finally {
      setLoadingProducts(false)
    }
  }

  // Effect to fetch products when tab changes
  useEffect(() => {
    fetchProducts(activeTab)
    setProductLimit(20) // Reset product limit when changing tabs
  }, [activeTab])

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true)
      try {
        // Fetch products based on active tab
        await fetchProducts(activeTab)

        // Fetch authors
        const authorsResponse = await axios.get("http://localhost:8080/home/authors?limit=6")
        const authorsData = authorsResponse.data.status ? authorsResponse.data.data || [] : []
        setFeaturedAuthors(authorsData)

        // Fetch genres
        const genresResponse = await axios.get("http://localhost:8080/home/genres")
        const genresData = genresResponse.data.status ? genresResponse.data.data || [] : []
        setGenres(genresData)

        // Fetch flash sale shops
        const shopsResponse = await axios.get("http://localhost:8080/home/shops/flash-sale")
        const shopsData = shopsResponse.data.status ? shopsResponse.data.data || [] : []
        setFlashSaleShops(shopsData)

        // Mock promotions (since endpoint is commented out)
        const mockPromotions = [
          {
            id: 1,
            title: "Giảm 20% cho đơn hàng đầu tiên",
            code: "WELCOME20",
            expiry: "30/04/2025",
            backgroundColor: "bg-gradient-to-r from-blue-500 to-purple-600",
          },
          {
            id: 2,
            title: "Miễn phí vận chuyển",
            code: "FREESHIP",
            expiry: "15/05/2025",
            backgroundColor: "bg-gradient-to-r from-emerald-500 to-teal-600",
          },
          {
            id: 3,
            title: "Giảm 50K cho đơn từ 300K",
            code: "SAVE50K",
            expiry: "10/05/2025",
            backgroundColor: "bg-gradient-to-r from-orange-500 to-red-600",
          },
        ]
        setPromotions(mockPromotions)
      } catch (error) {
        console.error("Error fetching initial data:", error)
        setFeaturedAuthors([])
        setGenres([])
        setFlashSaleShops([])
        setProducts([])
        setPromotions([])
      } finally {
        setLoading(false)
      }
    }

    fetchInitialData()
  }, [])

  const getProductImage = (product) => {
    return product.productImage || "/placeholder.svg"
  }

  const calculateDiscountedPrice = (product) => {
    const price = product.price || 0
    if (!product.promotionValue) {
      return price
    }
    return price - (price * product.promotionValue) / 100
  }

  // Helper function to get average rating
  const getAverageRating = (product) => {
    return product.rate || 0
  }

  const handleLoadMore = () => {
    setProductLimit((prevLimit) => prevLimit + 20)
  }

  // Mock data for banner
  const bannerSlides = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80",
      title: "Khám phá thế giới qua từng trang sách",
      subtitle: "Bộ sưu tập sách mới nhất đã có mặt tại E-Com Books",
      buttonText: "Khám phá ngay",
      buttonLink: "/search",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80",
      title: "Giảm giá lên đến 50%",
      subtitle: "Cho tất cả sách văn học và tiểu thuyết",
      buttonText: "Mua ngay",
      buttonLink: "/search?category=fiction",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80",
      title: "Sách thiếu nhi",
      subtitle: "Khơi dậy trí tưởng tượng cho trẻ em",
      buttonText: "Xem bộ sưu tập",
      buttonLink: "/search?category=children",
    },
  ]

  // Mock data for testimonials
  const testimonials = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      rating: 5,
      text: "Tôi rất hài lòng với dịch vụ của E-Com Books. Sách được đóng gói cẩn thận và giao hàng nhanh chóng.",
    },
    {
      id: 2,
      name: "Trần Thị B",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      rating: 4,
      text: "Đa dạng sách, giá cả hợp lý. Tuy nhiên, tôi mong muốn có thêm nhiều sách nước ngoài hơn.",
    },
    {
      id: 3,
      name: "Lê Văn C",
      avatar:
        "https://images.unsplash.com/photo-1566753323558-f4e0952af115?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      rating: 5,
      text: "Chất lượng sách rất tốt, đúng như mô tả. Tôi sẽ tiếp tục mua sắm tại đây trong tương lai.",
    },
  ]

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-[500px] bg-gray-200 rounded-2xl mb-12"></div>
          <div className="bg-gray-200 rounded-2xl p-6 mb-12 h-80"></div>
          <div className="mb-12">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="h-40 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
          <div className="mb-12">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="h-64 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-12">
      {/* Hero Banner */}
      <section className="relative mb-12">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          spaceBetween={0}
          slidesPerView={1}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          effect="fade"
          className="w-full h-[500px] md:h-[600px] rounded-2xl overflow-hidden shadow-2xl"
        >
          {bannerSlides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative w-full h-full">
                <img src={slide.image || "/placeholder.svg"} alt={slide.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent flex items-center">
                  <div className="container mx-auto px-6 md:px-12">
                    <div className="max-w-lg">
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-fade-in-up">
                        {slide.title}
                      </h1>
                      <p className="text-lg md:text-xl text-white/90 mb-8 animate-fade-in-up animation-delay-200">
                        {slide.subtitle}
                      </p>
                      <Link
                        to={slide.buttonLink}
                        className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-all duration-300 inline-flex items-center transform hover:translate-x-1 shadow-lg hover:shadow-emerald-500/30 animate-fade-in-up animation-delay-400"
                      >
                        {slide.buttonText}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 ml-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Flash Sale Section - Shop Specific */}
      <section className="mb-12 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-500 rounded-2xl p-6 md:p-8 shadow-xl">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <div className="flex items-center mb-4 md:mb-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-yellow-300 mr-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                    clipRule="evenodd"
                  />
                </svg>
                <h2 className="text-3xl md:text-4xl font-bold text-white">Flash Sale Shops</h2>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-white text-sm">Kết thúc sau:</div>
                <div className="flex space-x-2">
                  <div className="bg-white rounded-lg w-12 h-12 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-600">
                        {countdown.hours.toString().padStart(2, "0")}
                      </div>
                      <div className="text-xs text-gray-500">Giờ</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg w-12 h-12 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-600">
                        {countdown.minutes.toString().padStart(2, "0")}
                      </div>
                      <div className="text-xs text-gray-500">Phút</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg w-12 h-12 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-600">
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
                modules={[Navigation, Autoplay]}
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
                autoplay={{ delay: 3000 }}
                className="flash-sale-swiper"
              >
                {flashSaleShops.length > 0 ? (
                  flashSaleShops.map((shop) => (
                    <SwiperSlide key={shop.id}>
                      <Link to={`/shop-detail/${shop.id}`} className="block">
                        <div className="bg-white rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative group">
                          <div className="relative">
                            <img
                              src={shop.banner || "/placeholder.svg"}
                              alt={shop.name}
                              className="w-full h-32 object-cover"
                            />
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/70 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-4 w-full">
                              <div className="flex items-center">
                                <img
                                  src={shop.logo || "/placeholder.svg"}
                                  alt={`${shop.name} logo`}
                                  className="w-12 h-12 rounded-full border-2 border-white mr-3"
                                />
                                <div>
                                  <h3 className="font-bold text-white">{shop.name}</h3>
                                  <p className="text-white/90 text-sm">{shop.products || 0} sản phẩm</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="flex justify-between items-center">
                              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                Flash Sale
                              </span>
                              <span className="text-red-600 font-bold">{shop.maxDiscount || 0}%</span>
                            </div>
                            <button className="mt-3 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300 flex items-center justify-center">
                              Xem ngay
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 ml-1"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </Link>
                    </SwiperSlide>
                  ))
                ) : (
                  <SwiperSlide>
                    <div className="text-center text-gray-600 py-8">Không có cửa hàng flash sale hiện tại.</div>
                  </SwiperSlide>
                )}
              </Swiper>
            </div>
          </div>
        </div>
      </section>

      {/* Danh mục */}
      <section className={`mb-12 transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 relative">
              Danh mục sách
              <span className="absolute -bottom-2 left-0 w-20 h-1 bg-emerald-500 rounded-full"></span>
            </h2>
            <Link to="/search" className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center group">
              Xem tất cả
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-1 transform transition-transform duration-300 group-hover:translate-x-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {genres.length > 0 ? (
              genres.map((genre, index) => (
                <Link to={`/search?category=${genre.id}`} key={genre.id} className="group">
                  <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl h-full">
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={genre.urlImage || "/placeholder.svg"}
                        alt={genre.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-t ${genreColors[index % genreColors.length]
                          } opacity-70 group-hover:opacity-80 transition-opacity duration-300`}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center p-4">
                        <h3 className="font-bold text-white text-center text-lg drop-shadow-md">{genre.name}</h3>
                      </div>
                    </div>
                    <div className="p-3 text-center">
                      <span className="text-sm text-gray-600">{genre.count} sách</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center text-gray-600 py-8 col-span-full">Không có danh mục sách hiện tại.</div>
            )}
          </div>
        </div>
      </section>

      {/* Sản phẩm */}
      <section className="mb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0 relative">
              Sách nổi bật
              <span className="absolute -bottom-2 left-0 w-20 h-1 bg-emerald-500 rounded-full"></span>
            </h2>
            <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("popular")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "popular" ? "bg-emerald-500 text-white" : "text-gray-600 hover:bg-gray-200"
                  }`}
              >
                Phổ biến
              </button>
              <button
                onClick={() => setActiveTab("new")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "new" ? "bg-emerald-500 text-white" : "text-gray-600 hover:bg-gray-200"
                  }`}
              >
                Mới
              </button>
              <button
                onClick={() => setActiveTab("sale")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "sale" ? "bg-emerald-500 text-white" : "text-gray-600 hover:bg-gray-200"
                  }`}
              >
                Giảm giá
              </button>
            </div>
          </div>

          <div className="flex flex-col">
            {loadingProducts ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {[...Array(10)].map((_, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden h-64 animate-pulse">
                    <div className="h-40 bg-gray-200"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {products.slice(0, productLimit).map((product) => (
                  <div
                    key={product.productId}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
                  >
                    <div className="relative">
                      <Link to={`/product-detail/${product.productId}`} className="block">
                        <img
                          src={getProductImage(product) || "/placeholder.svg"}
                          alt={product.productName}
                          className="w-full aspect-[3/4] object-cover"
                        />
                        {product.isNew && (
                          <div className="absolute top-2 left-2 bg-emerald-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                            Mới
                          </div>
                        )}
                        {product.promotionValue > 0 && (
                          <div className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                            -{product.promotionValue}%
                          </div>
                        )}
                      </Link>

                      <div className="absolute bottom-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          className="p-2 rounded-full bg-white/80 hover:bg-white shadow-md text-gray-400 hover:text-rose-500 transition-all duration-300 transform hover:scale-110"
                          onClick={(e) => e.preventDefault()}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                        <button
                          className="p-2 rounded-full bg-white/80 hover:bg-emerald-500 shadow-md text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110"
                          onClick={(e) => e.preventDefault()}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <Link to={`/product-detail/${product.productId}`} className="block">
                      <div className="p-4 flex flex-col h-[140px]">
                        <h3 className="font-medium text-gray-800 mb-2 line-clamp-2 min-h-[3rem] flex items-start">
                          {product.productName}
                        </h3>
                        <div className="flex items-center mb-2">
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, index) => (
                              <svg
                                key={index}
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-4 w-4 ${index < Math.floor(getAverageRating(product))
                                  ? "fill-current"
                                  : "stroke-current fill-none"
                                  }`}
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                />
                              </svg>
                            ))}
                          </div>
                          <span className="text-xs text-gray-500 ml-1">({getAverageRating(product)})</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            {product.promotionValue > 0 ? (
                              <>
                                <span className="text-emerald-600 font-bold">
                                  {calculateDiscountedPrice(product)?.toLocaleString?.() || "0"}đ
                                </span>
                                <span className="text-gray-400 text-sm line-through ml-2">
                                  {product.price?.toLocaleString?.() || "0"}đ
                                </span>
                              </>
                            ) : (
                              <span className="text-emerald-600 font-bold">
                                {product.price?.toLocaleString?.() || "0"}đ
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {products.length > productLimit && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={handleLoadMore}
                  className="px-6 py-3 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-medium rounded-lg transition-colors duration-300 flex items-center shadow-sm hover:shadow"
                >
                  Xem thêm
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Banner quảng cáo */}
      <section className="mb-12">
        <div className="container mx-auto px-4">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1513001900722-370f803f498d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80"
              alt="Khuyến mãi đặc biệt"
              className="w-full h-64 md:h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 to-transparent flex items-center">
              <div className="p-8 md:p-12 max-w-lg">
                <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
                  Ưu đãi đặc biệt
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Giảm 30% cho tất cả sách văn học</h2>
                <p className="text-white/90 mb-6">Chỉ áp dụng đến hết ngày 30/04/2025. Nhanh tay mua ngay!</p>
                <Link
                  to="/search?category=literature&discount=true"
                  className="px-6 py-3 bg-white text-emerald-700 font-medium rounded-lg hover:bg-gray-100 transition-colors duration-300 inline-flex items-center shadow-lg"
                >
                  Mua ngay
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tác giả nổi bật */}
      <section className="mb-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 relative">
              Tác giả nổi bật
              <span className="absolute -bottom-2 left-0 w-20 h-1 bg-emerald-500 rounded-full"></span>
            </h2>
            <Link to="/authors" className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center group">
              Xem tất cả
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-1 transform transition-transform duration-300 group-hover:translate-x-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {featuredAuthors.length > 0 ? (
              featuredAuthors.map((author) => (
                <Link to={`/author/${author.id}`} key={author.id} className="group">
                  <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl text-center p-4 h-48">
                    <div className="relative mx-auto w-24 h-24 mb-4">
                      <img
                        src={author.urlImage || "/placeholder.svg"}
                        alt={author.name}
                        loading="lazy"
                        className="w-full h-full object-cover rounded-full border-2 border-emerald-100 transform group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-medium text-gray-800 mb-1 truncate max-w-full">{author.name}</h3>
                    <p className="text-sm text-gray-500">{author.bookCount} cuốn sách</p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center text-gray-600 py-8 col-span-full">Không có tác giả nổi bật hiện tại.</div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mb-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Khách hàng nói gì về chúng tôi</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Khám phá trải nghiệm mua sắm tuyệt vời từ những khách hàng đã tin tưởng và sử dụng dịch vụ của E-Com
              Books.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800">{testimonial.name}</h3>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-4 w-4 ${i < testimonial.rating ? "fill-current" : "stroke-current fill-none"}`}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                          />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Đăng ký nhận thông báo */}
      <section>
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 md:p-12 shadow-2xl">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Đăng ký nhận thông báo</h2>
              <p className="text-white/90 mb-8">Nhận thông tin về sách mới và khuyến mãi đặc biệt qua email</p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder="Nhập email của bạn"
                  className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white shadow-lg"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-white text-emerald-700 font-medium rounded-lg hover:bg-gray-100 transition-colors duration-300 shadow-lg transform hover:scale-105"
                >
                  Đăng ký
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
