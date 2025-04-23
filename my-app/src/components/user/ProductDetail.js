"use client"

import { useState, useEffect, useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { FreeMode, Navigation, Thumbs, Zoom } from "swiper/modules"
import { useNavigate, useParams, Link } from "react-router-dom"
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/navigation"
import "swiper/css/thumbs"
import "swiper/css/zoom"
import ChatButton from "./ChatButton"
import axiosInstance from "../../utils/axiosInstance"
import { showErrorToast, showSuccessToast } from "../../utils/Toast"

const ProductDetail = () => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("description")
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showAddToCartNotification, setShowAddToCartNotification] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [similarProducts, setSimilarProducts] = useState([])
  const { id } = useParams()
  const navigate = useNavigate()
  const descriptionRef = useRef(null)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [newReview, setNewReview] = useState("")
  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true)
      try {
        // Giả lập API call
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Dữ liệu mẫu cho sản phẩm
        const productData = {
          id: Number.parseInt(id) || 1,
          name: "Đắc Nhân Tâm (Khổ Lớn) - Cuốn Sách Hay Nhất Của Mọi Thời Đại Giúp Bạn Đạt Được Thành Công Trong Cuộc Sống",
          description: `<p><strong>Đắc Nhân Tâm</strong> - Được xuất bản lần đầu vào năm 1936 và là một trong những quyển sách bán chạy nhất mọi thời đại, với hơn 30 triệu bản được tiêu thụ trên toàn thế giới. Đây là cuốn sách đầu tiên và hay nhất, nổi tiếng nhất, bán chạy nhất của Dale Carnegie. Đây cũng là cuốn sách duy nhất về thể loại self-help liên tục đứng đầu danh mục sách bán chạy nhất (best-selling Books) do báo The New York Times bình chọn suốt 10 năm liền.</p>
          <p>Đắc Nhân Tâm là cuốn sách "đầu tiên và hay nhất mọi thời đại" về nghệ thuật giao tiếp và ứng xử, về nghệ thuật làm người. Đắc Nhân Tâm là cuốn sách gối đầu giường của nhiều thế hệ luôn muốn hoàn thiện chính mình để vươn tới một cuộc sống tốt đẹp và thành công.</p>
          <p>Đắc Nhân Tâm không chỉ là nghệ thuật thu phục lòng người, Đắc Nhân Tâm còn đem lại cho độc giả góc nhìn mới về cuộc sống, giúp thay đổi tư duy, cách suy nghĩ, cách ứng xử trong mối quan hệ với những người xung quanh. Đắc Nhân Tâm đã, đang và sẽ còn là cuốn sách đầu giường của nhiều người trên khắp thế giới.</p>
          <p>Đắc Nhân Tâm, tên tiếng Anh là How to Win Friends and Influence People là một quyển sách nhằm tự giúp bản thân (self-help) bán chạy nhất từ trước đến nay. Quyển sách này do Dale Carnegie viết và đã được xuất bản lần đầu vào năm 1936, nó đã được bán 15 triệu bản trên khắp thế giới. Nó cũng là quyển sách bán chạy nhất của New York Times trong 10 năm. Tác phẩm được đánh giá là cuốn sách đầu tiên và hay nhất, có ảnh hưởng làm thay đổi cuộc đời của hàng triệu người trên thế giới.</p>
          <p>Những nguyên tắc trong Đắc Nhân Tâm là những nguyên tắc bất biến trong giao tiếp, trong đối nhân xử thế. Những nguyên tắc ấy đã và đang được hàng triệu người thực hành và đúc kết thành những bài học quý báu.</p>`,
          fullDescription: `<p><strong>Đắc Nhân Tâm</strong> - Được xuất bản lần đầu vào năm 1936 và là một trong những quyển sách bán chạy nhất mọi thời đại, với hơn 30 triệu bản được tiêu thụ trên toàn thế giới. Đây là cuốn sách đầu tiên và hay nhất, nổi tiếng nhất, bán chạy nhất của Dale Carnegie. Đây cũng là cuốn sách duy nhất về thể loại self-help liên tục đứng đầu danh mục sách bán chạy nhất (best-selling Books) do báo The New York Times bình chọn suốt 10 năm liền.</p>
          <p>Đắc Nhân Tâm là cuốn sách "đầu tiên và hay nhất mọi thời đại" về nghệ thuật giao tiếp và ứng xử, về nghệ thuật làm người. Đắc Nhân Tâm là cuốn sách gối đầu giường của nhiều thế hệ luôn muốn hoàn thiện chính mình để vươn tới một cuộc sống tốt đẹp và thành công.</p>
          <p>Đắc Nhân Tâm không chỉ là nghệ thuật thu phục lòng người, Đắc Nhân Tâm còn đem lại cho độc giả góc nhìn mới về cuộc sống, giúp thay đổi tư duy, cách suy nghĩ, cách ứng xử trong mối quan hệ với những người xung quanh. Đắc Nhân Tâm đã, đang và sẽ còn là cuốn sách đầu giường của nhiều người trên khắp thế giới.</p>
          <p>Đắc Nhân Tâm, tên tiếng Anh là How to Win Friends and Influence People là một quyển sách nhằm tự giúp bản thân (self-help) bán chạy nhất từ trước đến nay. Quyển sách này do Dale Carnegie viết và đã được xuất bản lần đầu vào năm 1936, nó đã được bán 15 triệu bản trên khắp thế giới. Nó cũng là quyển sách bán chạy nhất của New York Times trong 10 năm. Tác phẩm được đánh giá là cuốn sách đầu tiên và hay nhất, có ảnh hưởng làm thay đổi cuộc đời của hàng triệu người trên thế giới.</p>
          <p>Những nguyên tắc trong Đắc Nhân Tâm là những nguyên tắc bất biến trong giao tiếp, trong đối nhân xử thế. Những nguyên tắc ấy đã và đang được hàng triệu người thực hành và đúc kết thành những bài học quý báu.</p>
          <h3>Nội dung chính</h3>
          <p>Đắc Nhân Tâm được chia thành 4 phần chính:</p>
          <ul>
            <li>Phần 1: Những nguyên tắc cơ bản trong cách đối xử với người</li>
            <li>Phần 2: Sáu cách tạo thiện cảm</li>
            <li>Phần 3: Mười hai cách để thuyết phục người khác đồng ý với mình</li>
            <li>Phần 4: Chín cách thay đổi người khác mà không làm họ phật lòng</li>
          </ul>
          <p>Cuốn sách đưa ra những lời khuyên về cách thức cư xử, ứng xử và giao tiếp với mọi người để đạt được thành công trong cuộc sống. Dale Carnegie đã đúc kết những nguyên tắc, những cách ứng xử thông qua việc quan sát và nghiên cứu những mẫu chuyện có thật trong cuộc sống.</p>
          <p>Những nguyên tắc trong sách có thể áp dụng trong cuộc sống hàng ngày cũng như trong công việc kinh doanh, quản lý. Đây là cuốn sách rất hữu ích cho những ai muốn cải thiện các mối quan hệ cá nhân và nghề nghiệp.</p>`,
          price: 150000,
          discountPrice: 120000,
          images: [
            {
              id: 1,
              image: "https://placehold.co/600x800/2ecc71/ffffff?text=Đắc+Nhân+Tâm+1",
            },
            {
              id: 2,
              image: "https://placehold.co/600x800/3498db/ffffff?text=Đắc+Nhân+Tâm+2",
            },
            {
              id: 3,
              image: "https://placehold.co/600x800/9b59b6/ffffff?text=Đắc+Nhân+Tâm+3",
            },
            {
              id: 4,
              image: "https://placehold.co/600x800/e74c3c/ffffff?text=Đắc+Nhân+Tâm+4",
            },
            {
              id: 5,
              image: "https://placehold.co/600x800/f1c40f/ffffff?text=Đắc+Nhân+Tâm+5",
            },
          ],
          brand: "NXB Tổng hợp TP.HCM",
          rating: 4.8,
          reviewCount: 1254,
          soldCount: 5280,
          inStock: 158,
          author: "Dale Carnegie",
          publisher: "NXB Tổng hợp TP.HCM",
          publishYear: 2022,
          language: "Tiếng Việt",
          pages: 320,
          weight: "350g",
          dimensions: "14.5 x 20.5 cm",
          coverType: "Bìa mềm",
          isbn: "8935086854753",
          categories: ["Sách kỹ năng sống", "Sách tâm lý", "Sách self-help"],
          tags: ["kỹ năng giao tiếp", "phát triển bản thân", "đắc nhân tâm", "dale carnegie"],
          variants: [
            {
              id: 1,
              name: "Bìa mềm - Khổ lớn",
              price: 150000,
              discountPrice: 120000,
              inStock: 158,
            },
            {
              id: 2,
              name: "Bìa cứng - Khổ lớn",
              price: 220000,
              discountPrice: 180000,
              inStock: 75,
            },
            {
              id: 3,
              name: "Bìa mềm - Khổ nhỏ",
              price: 120000,
              discountPrice: 95000,
              inStock: 200,
            },
          ],
          shop: {
            id: 1,
            name: "Nhà sách Phương Nam",
            logo: "https://placehold.co/100x100/2ecc71/ffffff?text=Logo",
            rate: 4.9,
            responseRate: 98,
            responseTime: "trong vòng 5 phút",
            followers: 15243,
            verify: true,
          },
          warranty: "Đổi trả trong vòng 7 ngày nếu sản phẩm lỗi",
          shipping: {
            free: true,
            methods: ["Giao hàng tiêu chuẩn", "Giao hàng nhanh"],
            time: "1-3 ngày làm việc",
          },
          reviews: [
            {
              id: 1,
              user: {
                name: "Nguyễn Văn A",
                avatar: "https://placehold.co/100x100/2ecc71/ffffff?text=A",
              },
              rating: 5,
              date: "2024-03-15",
              content: "Sách rất hay, nội dung súc tích và dễ hiểu. Đóng gói cẩn thận, giao hàng nhanh.",
              images: ["https://placehold.co/300x300/3498db/ffffff?text=Review+1"],
              likes: 24,
            },
            {
              id: 2,
              user: {
                name: "Trần Thị B",
                avatar: "https://placehold.co/100x100/3498db/ffffff?text=B",
              },
              rating: 4,
              date: "2024-03-10",
              content: "Sách hay, giá cả hợp lý. Tuy nhiên bìa sách hơi bị cong một chút.",
              images: [],
              likes: 12,
            },
            {
              id: 3,
              user: {
                name: "Lê Văn C",
                avatar: "https://placehold.co/100x100/9b59b6/ffffff?text=C",
              },
              rating: 5,
              date: "2024-03-05",
              content:
                "Một cuốn sách kinh điển mà ai cũng nên đọc ít nhất một lần trong đời. Nội dung sâu sắc và đầy ý nghĩa.",
              images: [
                "https://placehold.co/300x300/e74c3c/ffffff?text=Review+2",
                "https://placehold.co/300x300/f1c40f/ffffff?text=Review+3",
              ],
              likes: 36,
            },
          ],
          priceHistory: [
            { date: "2024-01-01", price: 150000 },
            { date: "2024-02-01", price: 135000 },
            { date: "2024-03-01", price: 120000 },
          ],
        }

        setProduct(productData)
        setSelectedVariant(productData.variants[0])

        // Dữ liệu mẫu cho sản phẩm tương tự
        const similarProductsData = [
          {
            id: 101,
            name: "Nhà Giả Kim",
            image: "https://placehold.co/300x400/3498db/ffffff?text=Nhà+Giả+Kim",
            author: "Paulo Coelho",
            price: 120000,
            discountPrice: 95000,
            rating: 4.7,
            soldCount: 4800,
          },
          {
            id: 102,
            name: "Tuổi Trẻ Đáng Giá Bao Nhiêu",
            image: "https://placehold.co/300x400/9b59b6/ffffff?text=Tuổi+Trẻ",
            author: "Rosie Nguyễn",
            price: 90000,
            discountPrice: 75000,
            rating: 4.5,
            soldCount: 3500,
          },
          {
            id: 103,
            name: "Tôi Tài Giỏi, Bạn Cũng Thế",
            image: "https://placehold.co/300x400/e74c3c/ffffff?text=Tôi+Tài+Giỏi",
            author: "Adam Khoo",
            price: 130000,
            discountPrice: 110000,
            rating: 4.6,
            soldCount: 4200,
          },
          {
            id: 104,
            name: "Đời Ngắn Đừng Ngủ Dài",
            image: "https://placehold.co/300x400/f1c40f/ffffff?text=Đời+Ngắn",
            author: "Robin Sharma",
            price: 110000,
            discountPrice: 90000,
            rating: 4.4,
            soldCount: 3800,
          },
          {
            id: 105,
            name: "Người Giàu Có Nhất Thành Babylon",
            image: "https://placehold.co/300x400/1abc9c/ffffff?text=Người+Giàu+Có",
            author: "George S. Clason",
            price: 100000,
            discountPrice: 85000,
            rating: 4.8,
            soldCount: 5100,
          },
        ]

        setSimilarProducts(similarProductsData)
      } catch (error) {
        console.error("Error fetching product data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProductData()
  }, [id])

  const handleQuantityChange = (value) => {
    const newQuantity = quantity + value;
    setQuantity(newQuantity)
  }

  const handleQuantityInput = (e) => {
    const value = parseInt(e.target.value)
    setQuantity(value)
  }


  const saveCartItem = async (id, quantity) => {
    try {
      console.log(id, quantity);
      const response = await axiosInstance.post(`/user/cart/saveCartItemProductCode?productCode=${id}&quantity=${quantity}`);
      if (response.status === 200 && response.data.status === true) {
        showSuccessToast(response.data.message);
      } else {
        showErrorToast(response.data.message);
      }
      console.log(id, quantity);
    } catch (error) {
      console.log(error);
    }
  }


  const handleBuyNow = () => {
    // Giả lập mua ngay
    console.log("Mua ngay:", {
      productId: product.id,
      variantId: selectedVariant?.id,
      quantity: quantity,
    })

    // Chuyển hướng đến trang thanh toán
    navigate("/payment")
  }

  const handleReportProduct = () => {
    navigate(`/report-product/${product.id}`)
  }

  const handleImageClick = (index) => {
    setCurrentImageIndex(index)
    setShowImageModal(true)
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("vi-VN", options)
  }

  const calculateDiscountPercentage = (original, discounted) => {
    return Math.round(((original - discounted) / original) * 100)
  }
  const handleSubmitReview = () => {
    // In a real application, you would send the review data to your backend
    console.log("Submitting review:", newReview)
    // After submitting, you might want to close the modal and clear the input
    setShowReviewModal(false)
    setNewReview("")
  }
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800">Không tìm thấy sản phẩm</h2>
          <p className="text-gray-600 mt-2">Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <Link to="/" className="mt-4 inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex mb-6 text-sm text-gray-600">
        <Link to="/" className="hover:text-indigo-600">
          Trang chủ
        </Link>
        <span className="mx-2">/</span>
        {product.categories && product.categories.length > 0 && (
          <>
            <Link
              to={`/search?category=${encodeURIComponent(product.categories[0])}`}
              className="hover:text-indigo-600"
            >
              {product.categories[0]}
            </Link>
            <span className="mx-2">/</span>
          </>
        )}
        <span className="text-gray-900 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6">
          {/* Hình ảnh sản phẩm */}
          <div className="md:col-span-5">
            <div className="relative">
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
                className="product-main-swiper rounded-xl overflow-hidden bg-gray-50 mb-4 aspect-[3/4]"
              >
                {product.images.map((img, index) => (
                  <SwiperSlide key={img.id} onClick={() => handleImageClick(index)}>
                    <div className="swiper-zoom-container w-full h-full cursor-zoom-in">
                      <img
                        src={img.image || "/placeholder.svg"}
                        alt={`${product.name} - Hình ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Discount badge */}
              {product.price > product.discountPrice && (
                <div className="absolute top-4 right-4 z-10 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  -{calculateDiscountPercentage(product.price, product.discountPrice)}%
                </div>
              )}

              <Swiper
                onSwiper={setThumbsSwiper}
                loop={false}
                spaceBetween={10}
                slidesPerView={5}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="product-thumbs-swiper"
              >
                {product.images.map((img, index) => (
                  <SwiperSlide key={img.id}>
                    <div className="cursor-pointer rounded-md overflow-hidden border-2 hover:border-indigo-500 transition-all duration-200">
                      <img
                        src={img.image || "/placeholder.svg"}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover aspect-square"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Share buttons */}
              <div className="flex items-center justify-center mt-6 space-x-4">
                <button className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors">
                  <i className="bi bi-share text-lg mr-2"></i>
                  <span className="text-sm">Chia sẻ</span>
                </button>
                <button className="flex items-center text-gray-600 hover:text-red-600 transition-colors">
                  <i className="bi bi-heart text-lg mr-2"></i>
                  <span className="text-sm">Yêu thích</span>
                </button>
                <button
                  onClick={handleReportProduct}
                  className="flex items-center text-gray-600 hover:text-yellow-600 transition-colors"
                >
                  <i className="bi bi-flag text-lg mr-2"></i>
                  <span className="text-sm">Báo cáo</span>
                </button>
              </div>
            </div>
          </div>

          {/* Thông tin sản phẩm */}
          <div className="md:col-span-7">
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, index) => (
                        <i
                          key={index}
                          className={`bi ${index < Math.floor(product.rating)
                            ? "bi-star-fill"
                            : index < Math.ceil(product.rating)
                              ? "bi-star-half"
                              : "bi-star"
                            }`}
                        ></i>
                      ))}
                    </div>
                    <span className="text-gray-600 ml-2">
                      {product.rating} ({product.reviewCount} đánh giá)
                    </span>
                  </div>
                  <div className="text-gray-600">
                    <span className="font-medium">{product.soldCount}</span> đã bán
                  </div>
                  {product.inStock > 0 ? (
                    <div className="text-green-600">
                      <i className="bi bi-check-circle mr-1"></i>
                      <span>Còn hàng ({product.inStock})</span>
                    </div>
                  ) : (
                    <div className="text-red-600">
                      <i className="bi bi-x-circle mr-1"></i>
                      <span>Hết hàng</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-gray-600">Tác giả:</span>
                  <Link
                    to={`/search?author=${encodeURIComponent(product.author)}`}
                    className="text-indigo-600 hover:underline"
                  >
                    {product.author}
                  </Link>
                </div>

                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-gray-600">Nhà xuất bản:</span>
                  <Link
                    to={`/search?publisher=${encodeURIComponent(product.publisher)}`}
                    className="text-indigo-600 hover:underline"
                  >
                    {product.publisher}
                  </Link>
                </div>

                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-gray-600">Danh mục:</span>
                  <div className="flex flex-wrap gap-2">
                    {product.categories.map((category, index) => (
                      <Link
                        key={index}
                        to={`/search?category=${encodeURIComponent(category)}`}
                        className="text-indigo-600 hover:underline"
                      >
                        {category}
                        {index < product.categories.length - 1 && ","}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Giá */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-baseline mb-2">
                  <span className="text-3xl font-bold text-red-600 mr-3">
                    {selectedVariant?.discountPrice.toLocaleString() || product.discountPrice.toLocaleString()}đ
                  </span>
                  {(selectedVariant?.price || product.price) >
                    (selectedVariant?.discountPrice || product.discountPrice) && (
                      <span className="text-xl text-gray-500 line-through">
                        {selectedVariant?.price.toLocaleString() || product.price.toLocaleString()}đ
                      </span>
                    )}
                </div>
                <div className="text-sm text-gray-600">
                  <i className="bi bi-graph-down-arrow mr-1"></i>
                  Giá thấp nhất trong 30 ngày qua
                </div>
              </div>
              {/* Số lượng */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Số lượng</h3>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(-1)}
                    className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-l-lg hover:bg-gray-100"
                  >
                    <i className="bi bi-dash"></i>
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}

                    onChange={handleQuantityInput}
                    className="w-16 h-10 border-t border-b border-gray-300 text-center focus:outline-none "
                  />
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(1)}
                    className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-r-lg hover:bg-gray-100"
                  >
                    <i className="bi bi-plus"></i>
                  </button>

                </div>
              </div>


              {/* Nút mua hàng */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => saveCartItem(id, quantity)}
                  className="flex-1 px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-medium flex items-center justify-center"
                >
                  <i className="bi bi-cart-plus text-xl mr-2"></i>
                  Thêm vào giỏ hàng
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center"
                >
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Thông tin shop */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8 p-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <img
              src={product.shop.logo || "/placeholder.svg"}
              alt={product.shop.name}
              className="w-16 h-16 rounded-full border-2 border-gray-200 mr-4"
            />
            <div>
              <div className="flex items-center">
                <h3 className="font-semibold text-lg text-gray-800 mr-2">{product.shop.name}</h3>
                {product.shop.verify && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-indigo-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <div className="flex items-center space-x-4 mt-1">
                <div className="flex items-center">
                  <div className="flex text-yellow-400 mr-1">
                    <i className="bi bi-star-fill"></i>
                  </div>
                  <span className="text-gray-600">{product.shop.rate}</span>
                </div>
                <div className="flex items-center">
                  <i className="bi bi-people text-gray-600 mr-1"></i>
                  <span className="text-gray-600">{product.shop.followers.toLocaleString()} người theo dõi</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex space-x-4">
            <Link
              to={`/shop/${product.shop.id}`}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Xem shop
            </Link>
            <ChatButton shop={product.shop} />
          </div>
        </div>
      </div>

      {/* Tabs: Mô tả, Thông số, Đánh giá */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab("description")}
              className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${activeTab === "description"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              Mô tả sản phẩm
            </button>
            <button
              onClick={() => setActiveTab("specifications")}
              className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${activeTab === "specifications"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              Thông số kỹ thuật
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${activeTab === "reviews"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              Đánh giá ({product.reviews.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Mô tả sản phẩm */}
          {activeTab === "description" && (
            <div ref={descriptionRef}>
              <div
                className={`prose max-w-none ${!showFullDescription && "max-h-96 overflow-hidden relative"}`}
                dangerouslySetInnerHTML={{
                  __html: showFullDescription ? product.fullDescription : product.description,
                }}
              ></div>

              <div className="text-center mt-4">
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center"
                >
                  {showFullDescription ? "Thu gọn" : "Xem thêm"}
                  <i className={`bi ${showFullDescription ? "bi-chevron-up" : "bi-chevron-down"} ml-2`}></i>
                </button>
              </div>
            </div>
          )}

          {/* Thông số kỹ thuật */}
          {activeTab === "specifications" && (
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-500 w-1/3">
                      Tác giả
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.author}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-500 w-1/3">
                      Nhà xuất bản
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.publisher}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-500 w-1/3">
                      Năm xuất bản
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.publishYear}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-500 w-1/3">
                      Ngôn ngữ
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.language}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-500 w-1/3">
                      Số trang
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.pages}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-500 w-1/3">
                      Trọng lượng
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.weight}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-500 w-1/3">
                      Kích thước
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.dimensions}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-500 w-1/3">
                      Loại bìa
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.coverType}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-500 w-1/3">
                      ISBN
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.isbn}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Đánh giá */}
          {activeTab === "reviews" && (
            <div>
              <div className="flex flex-col md:flex-row gap-8 mb-8">
                {/* Tổng quan đánh giá */}
                <div className="md:w-1/3 bg-gray-50 p-6 rounded-lg">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-gray-800 mb-2">{product.rating}</div>
                    <div className="flex justify-center text-yellow-400 mb-2">
                      {[...Array(5)].map((_, index) => (
                        <i
                          key={index}
                          className={`bi ${index < Math.floor(product.rating)
                            ? "bi-star-fill"
                            : index < Math.ceil(product.rating)
                              ? "bi-star-half"
                              : "bi-star"
                            }`}
                        ></i>
                      ))}
                    </div>
                    <div className="text-gray-600">{product.reviewCount} đánh giá</div>
                  </div>

                  <div className="mt-6 space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className="flex items-center">
                        <div className="w-12 text-sm text-gray-600">{star} sao</div>
                        <div className="flex-1 mx-3">
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-yellow-400"
                              style={{
                                width: `${(product.reviews.filter((review) => Math.floor(review.rating) === star).length /
                                  product.reviews.length) *
                                  100
                                  }%`,
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="w-10 text-sm text-gray-600 text-right">
                          {product.reviews.filter((review) => Math.floor(review.rating) === star).length}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={() => setShowReviewModal(true)}
                      className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Viết đánh giá
                    </button>
                  </div>
                </div>

                {/* Danh sách đánh giá */}
                <div className="md:w-2/3">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Đánh giá từ khách hàng</h3>
                  <div className="space-y-6">
                    {product.reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                        <div className="flex items-start">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h4 className="font-medium text-gray-800">{review.user.name}</h4>
                              <span className="text-gray-500 text-sm">• {formatDate(review.date)}</span>
                            </div>
                            <div className="flex text-yellow-400 mb-2">
                              {[...Array(5)].map((_, index) => (
                                <i
                                  key={index}
                                  className={`bi ${index < review.rating ? "bi-star-fill" : "bi-star"}`}
                                ></i>
                              ))}
                            </div>
                            <p className="text-gray-700 mb-3">{review.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sản phẩm tương tự */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Sản phẩm tương tự</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {similarProducts.map((product) => (
            <Link to={`/product-detail/${product.id}`} key={product.id} className="group">
              <div className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
                <div className="relative">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.price > product.discountPrice && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs">
                      -{calculateDiscountPercentage(product.price, product.discountPrice)}%
                    </div>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-medium text-gray-800 mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">{product.author}</p>
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400 text-sm">
                      {[...Array(5)].map((_, index) => (
                        <i
                          key={index}
                          className={`bi ${index < Math.floor(product.rating)
                            ? "bi-star-fill"
                            : index < Math.ceil(product.rating)
                              ? "bi-star-half"
                              : "bi-star"
                            }`}
                        ></i>
                      ))}
                    </div>
                    <span className="text-gray-500 text-xs ml-1">({product.rating})</span>
                  </div>
                  <div className="mt-auto">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-indigo-600 font-bold">{product.discountPrice.toLocaleString()}đ</span>
                        {product.price > product.discountPrice && (
                          <span className="text-gray-500 text-sm line-through ml-1">
                            {product.price.toLocaleString()}đ
                          </span>
                        )}
                      </div>
                      <span className="text-gray-500 text-xs">Đã bán {product.soldCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
          onClick={() => setShowImageModal(true)}
        >
          <div className="relative w-full max-w-4xl">
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
              onClick={() => setShowImageModal(true)}
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
            <Swiper
              initialSlide={currentImageIndex}
              navigation={true}
              modules={[Navigation, Zoom]}
              zoom={true}
              className="w-full"
            >
              {product.images.map((img) => (
                <SwiperSlide key={img.id}>
                  <div className="swiper-zoom-container">
                    <img
                      src={img.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-contain max-h-[80vh]"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}


    </div>
  )
}

export default ProductDetail
