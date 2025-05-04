"use client";

import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs, Zoom } from "swiper/modules";
import { useNavigate, useParams, Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/zoom";
import axiosInstance from "../../utils/axiosInstance";
import { showErrorToast, showSuccessToast } from "../../utils/Toast";
import {
  getQuantityByNow,
  setListProductIds,
  setListVoucherIds,
  setQuantityByNow,
} from "../../utils/cookie";

const ProductDetail = () => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAddToCartNotification, setShowAddToCartNotification] =
    useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const descriptionRef = useRef(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const mainSwiperKey = useRef(`main-${Date.now()}`).current;
  const thumbsSwiperKey = useRef(`thumbs-${Date.now()}`).current;

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        // Fetch product details
        const productResponse = await fetch(
          `http://localhost:8080/product-detail/${id}`
        );
        if (!productResponse.ok) {
          throw new Error(`HTTP error! Status: ${productResponse.status}`);
        }
        const productData = await productResponse.json();

        if (!productData.status || !productData.data) {
          throw new Error(productData.message || "Không tìm thấy sản phẩm");
        }

        const apiProduct = productData.data;

        // Fetch reviews
        const reviewsResponse = await fetch(
          `http://localhost:8080/product-detail/${id}/reviews`
        );
        if (!reviewsResponse.ok) {
          throw new Error(`HTTP error! Status: ${reviewsResponse.status}`);
        }
        const reviewsData = await reviewsResponse.json();

        let reviews = [];
        if (reviewsData.status && reviewsData.data) {
          reviews = reviewsData.data.map((review) => ({
            id: review.id,
            user: {
              name: review.user.name,
              avatar: review.user.avatar || null,
            },
            date: review.date,
            rating: review.rating,
            content: review.content,
            reply: review.reply || null,
            reply_at: review.replyAt || null,
            shop: {
              name: review.shop.name,
              logo: review.shop.logo || null,
              verify: review.shop.verify,
            },
          }));
        }

        // Map API data to frontend product structure
        const mappedProduct = {
          id: apiProduct.productId,
          product_code: apiProduct.productCode,
          name: apiProduct.productName,
          description: apiProduct.description || "Không có mô tả",
          fullDescription: apiProduct.description || "Không có mô tả",
          price: apiProduct.price,
          discountPrice: apiProduct.discountedPrice || apiProduct.price,
          images: apiProduct.images
            ? apiProduct.images.map((image, index) => ({
                id: index + 1,
                image: `${image}`,
              }))
            : [],
          brand: apiProduct.publisher,
          rating: apiProduct.rate || 0,
          reviewCount: apiProduct.reviewCount || 0,
          soldCount: apiProduct.soldQuantity || 0,
          inStock: apiProduct.stockQuantity || 0,
          author:
            apiProduct.authorNames && apiProduct.authorNames.length > 0
              ? apiProduct.authorNames[0]
              : "Không rõ",
          authors: apiProduct.authorNames || [],
          publisher: apiProduct.publisher || "Không rõ",
          publishYear: apiProduct.createdAt
            ? new Date(apiProduct.createdAt).getFullYear()
            : null,
          language: "Tiếng Việt",
          pages: 0,
          weight: apiProduct.weight ? `${apiProduct.weight}kg` : "Không rõ",
          dimensions: "Không rõ",
          coverType: "Không rõ",
          isbn: "Không rõ",
          categories: apiProduct.genres || [],
          tags: [],
          hasFlashSale: apiProduct.hasFlashSale || false,
          flashSaleQuantity: apiProduct.flashSaleQuantity || 0,
          flashSaleSold: apiProduct.flashSaleSold || 0,
          variants: [
            {
              id: 1,
              name: "Phiên bản mặc định",
              price: apiProduct.price,
              discountPrice: apiProduct.discountedPrice || apiProduct.price,
              inStock: apiProduct.stockQuantity || 0,
            },
          ],
          shop: {
            id: apiProduct.shop.id || 1,
            name: apiProduct.shop.name || "Nhà sách Phương Nam",
            logo:
              apiProduct.shop.logo ||
              "https://placehold.co/100x100/2ecc71/ffffff?text=Logo",
            rate: apiProduct.shop.rate || 4.9,
            responseRate: apiProduct.shop.responseRate || 98,
            responseTime: apiProduct.shop.responseTime || "trong vòng 5 phút",
            followers: apiProduct.shop.followers || 15243,
            verify:
              apiProduct.shop.verify !== undefined
                ? apiProduct.shop.verify
                : true,
            shopRating: apiProduct.shop?.shopRating || 0,
            shopRatingCount: apiProduct.shop?.shopRatingCount || 0,
            productsCount: apiProduct.shop.productsCount || 0,
            shop_slug: apiProduct.shop.shop_slug || apiProduct.shop.id,
          },
          warranty: "Đổi trả trong vòng 7 ngày nếu sản phẩm lỗi",
          shipping: {
            free: true,
            methods: ["Giao hàng tiêu chuẩn", "Giao hàng nhanh"],
            time: "1-3 ngày làm việc",
          },
          reviews: reviews,
          priceHistory: [],
        };

        setProduct(mappedProduct);
        setSelectedVariant(mappedProduct.variants[0]);

        // Fetch related products
        const similarResponse = await fetch(
          `http://localhost:8080/product-detail/${id}/related`
        );
        if (!similarResponse.ok) {
          throw new Error(`HTTP error! Status: ${similarResponse.status}`);
        }
        const similarData = await similarResponse.json();

        if (similarData.status && similarData.data) {
          const mappedSimilarProducts = similarData.data.map((item) => ({
            id: item.id,
            product_code: item.product_code,
            name: item.productName || item.name || "Không rõ",
            image:
              item.images && item.images.length > 0
                ? item.images[0]
                : "/placeholder.svg",
            author:
              item.authorNames && item.authorNames.length > 0
                ? item.authorNames[0]
                : "Không rõ",
            price: item.price || 0,
            discountPrice: item.discountPrice || item.price || 0,
            rating: item.avgRating || 0,
            soldCount: 0,
          }));
          setSimilarProducts(mappedSimilarProducts);
        } else {
          setSimilarProducts([]);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  const handleQuantityChange = (value) => {
    const newQuantity = quantity + value;
    if (
      newQuantity >= 1 &&
      newQuantity <= (selectedVariant?.inStock || product?.inStock || 999)
    ) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    try {
      const response = await axiosInstance.post(
        `/user/cart/saveCartItemProductCode?productCode=${product.product_code}&quantity=${quantity}`
      );
      if (response.status === 200 && response.data.status === true) {
        setShowAddToCartNotification(true);
        setTimeout(() => setShowAddToCartNotification(false), 3000);
        showSuccessToast(response.data.message);
      } else {
        showErrorToast(response.data.message);
      }
    } catch (error) {
      console.log(error);
      showErrorToast("Có lỗi khi thêm vào giỏ hàng");
    }
  };

  const handleBuyNow = () => {
    try {
      if (!product?.id) {
        showErrorToast("Không tìm thấy thông tin sản phẩm");
        return;
      }

      if (!quantity || quantity <= 0 || quantity > product.inStock) {
        showErrorToast("Số lượng sản phẩm không hợp lệ");
        return;
      }

      setListProductIds(JSON.stringify([product.id]));
      setListVoucherIds(JSON.stringify([]));
      setQuantity(quantity);
      setQuantityByNow(quantity);

      navigate("/payment");
    } catch (error) {
      console.error("Error in handleBuyNow:", error);
      showErrorToast("Có lỗi xảy ra, vui lòng thử lại sau");
    }
  };

  const handleReportProduct = () => {
    navigate(`/report-product/${product.id}`);
  };

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setShowImageModal(true);
  };

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
    setQuantity(1);
  };
  const handleToggleFavorite = async () => {
    if (!product || !product.id) {
      showErrorToast("Không thể thêm vào yêu thích: Sản phẩm không hợp lệ");
      return;
    }
    try {
      const response = await axiosInstance.post(
        `/user/favorite/add-and-remove?productId=${product.id}`
      );
      if (response.status === 200 && response.data.status === true) {
        setIsFavorite(!isFavorite);
        showSuccessToast(response.data.message);
      } else {
        showErrorToast(response.data.message || "Không thể thay đổi yêu thích");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        showErrorToast("Vui lòng đăng nhập để sử dụng tính năng này");
        navigate("/login");
      } else {
        showErrorToast(
          error.response?.data?.message || "Lỗi khi thay đổi yêu thích"
        );
      }
    }
  };
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  const calculateDiscountPercentage = (original, discounted) => {
    if (!original || !discounted || original <= discounted) return 0;
    return Math.round(((original - discounted) / original) * 100);
  };

  const handleSubmitReview = () => {
    console.log("Submitting review:", newReview);
    setShowReviewModal(false);
    setNewReview("");
  };
  const fetchFavoriteStatus = () => {
    axiosInstance
      .get(`/user/favorite/check?productId=${product.id}`)
      .then((response) => {
        setIsFavorite(response.data.isFavorite);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    if (product) {
      fetchFavoriteStatus();
    }
  }, [product]);
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800">
            Không tìm thấy sản phẩm
          </h2>
          <p className="text-gray-600 mt-2">
            Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Link
            to="/"
            className="mt-4 inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const flashSalePercentage =
    product.hasFlashSale && product.flashSaleQuantity > 0
      ? (product.flashSaleSold / product.flashSaleQuantity) * 100
      : 0;

  const renderProductImages = () => {
    if (!product || !product.images || product.images.length === 0) {
      return (
        <div className="rounded-xl overflow-hidden bg-gray-50 mb-4 aspect-[3/4] flex items-center justify-center">
          <img
            src="/placeholder.svg"
            alt="No image available"
            className="w-full h-full object-contain"
          />
        </div>
      );
    }

    return (
      <>
        <Swiper
          key={mainSwiperKey}
          style={{
            "--swiper-navigation-color": "#fff",
            "--swiper-pagination-color": "#fff",
          }}
          loop={product.images.length > 1}
          spaceBetween={10}
          navigation={true}
          thumbs={{
            swiper:
              thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
          }}
          modules={[FreeMode, Navigation, Thumbs, Zoom]}
          zoom={true}
          className="product-main-swiper rounded-xl overflow-hidden bg-gray-50 mb-4 aspect-[3/4]"
        >
          {product.images.map((img, index) => (
            <SwiperSlide
              key={`main-${img.id}`}
              onClick={() => handleImageClick(index)}
            >
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

        {product.images.length > 1 && (
          <Swiper
            key={thumbsSwiperKey}
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
              <SwiperSlide key={`thumb-${img.id}`}>
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
        )}
      </>
    );
  };

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
              to={`/search?category=${encodeURIComponent(
                product.categories[0]
              )}`}
              className="hover:text-indigo-600"
            >
              {product.categories[0]}
            </Link>
            <span className="mx-2">/</span>
          </>
        )}
        <span className="text-gray-900 font-medium truncate max-w-xs">
          {product.name}
        </span>
      </nav>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6">
          {/* Hình ảnh sản phẩm */}
          <div className="md:col-span-5">
            <div className="relative">
              {renderProductImages()}

              {/* Discount badge */}
              {product.hasFlashSale &&
                product.price > product.discountPrice && (
                  <div className="absolute top-4 right-4 z-10 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -
                    {calculateDiscountPercentage(
                      product.price,
                      product.discountPrice
                    )}
                    %
                  </div>
                )}

              {/* Share buttons */}
              <div className="flex items-center justify-center mt-6 space-x-4">
                <button
                  onClick={handleToggleFavorite}
                  className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
                >
                  <i
                    className={`bi ${
                      isFavorite ? "bi-heart-fill text-red-500" : "bi-heart"
                    } mr-2`}
                  ></i>
                  <span>{isFavorite ? "Đã yêu thích" : "Yêu thích"}</span>
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
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  {product.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, index) => (
                        <i
                          key={index}
                          className={`bi ${
                            index < Math.floor(product.rating)
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
                    <span className="font-medium">{product.soldCount}</span> đã
                    bán
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
                  <div className="flex flex-wrap gap-2">
                    {product.authors && product.authors.length > 0 ? (
                      product.authors.map((author, index) => (
                        <span key={index} className="flex items-center">
                          <Link
                            to={`/search?author=${encodeURIComponent(author)}`}
                            className="text-indigo-600 hover:underline"
                          >
                            {author}
                          </Link>
                          {index < product.authors.length - 1 && (
                            <span className="text-gray-600 mx-1">,</span>
                          )}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-600">Không rõ</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-gray-600">Nhà xuất bản:</span>
                  <Link
                    to={`/search?publisher=${encodeURIComponent(
                      product.publisher
                    )}`}
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
                    đ
                    {(
                      selectedVariant?.discountPrice || product.discountPrice
                    ).toLocaleString()}
                  </span>
                  {(selectedVariant?.price || product.price) >
                    (selectedVariant?.discountPrice ||
                      product.discountPrice) && (
                    <span className="text-xl text-gray-500 line-through">
                      đ
                      {(
                        selectedVariant?.price || product.price
                      ).toLocaleString()}
                    </span>
                  )}
                </div>
                {product.hasFlashSale && (
                  <>
                    <div className="flex items-center">
                      <span className="bg-red-600 text-white px-2 py-1 text-sm font-bold mr-2">
                        FLASH SALE
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-red-600 text-sm font-medium">
                          Đã bán {product.flashSaleSold}
                        </span>
                        <span className="text-gray-600 text-sm">
                          Còn lại:{" "}
                          {product.flashSaleQuantity - product.flashSaleSold}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-red-600 h-2.5 rounded-full"
                          style={{ width: `${flashSalePercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Số lượng */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Số lượng
                </h3>
                <div className="flex items-center">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className={`w-10 h-10 flex items-center justify-center border border-gray-300 rounded-l-lg ${
                      quantity <= 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <i className="bi bi-dash"></i>
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={selectedVariant?.inStock || product.inStock || 999}
                    value={quantity}
                    onChange={(e) => {
                      const val = Number.parseInt(e.target.value);
                      if (
                        !isNaN(val) &&
                        val >= 1 &&
                        val <=
                          (selectedVariant?.inStock || product.inStock || 999)
                      ) {
                        setQuantity(val);
                      }
                    }}
                    className="w-16 h-10 border-t border-b border-gray-300 text-center focus:outline-none"
                  />
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={
                      quantity >=
                      (selectedVariant?.inStock || product.inStock || 999)
                    }
                    className={`w-10 h-10 flex items-center justify-center border border-gray-300 rounded-r-lg ${
                      quantity >=
                      (selectedVariant?.inStock || product.inStock || 999)
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <i className="bi bi-plus"></i>
                  </button>
                </div>
              </div>

              {/* Nút mua hàng */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={handleAddToCart}
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
                <h3 className="font-semibold text-lg text-gray-800 mr-2">
                  {product.shop.name}
                </h3>
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
                <div className="flex flex-wrap gap-3 mb-4 text-sm text-gray-600">
                  <div className="flex items-center bg-gray-50 rounded-full px-3 py-1">
                    <i className="bi bi-star-fill text-yellow-400 mr-2"></i>
                    <span>
                      {product.shop.shopRating} ({product.shop.shopRatingCount}{" "}
                      đánh giá)
                    </span>
                  </div>
                  <div className="flex items-center bg-gray-50 rounded-full px-3 py-1">
                    <i className="bi bi-box text-gray-500 mr-2"></i>
                    <span>{product.shop.productsCount} sản phẩm</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <Link
              to={`/shop/${product.shop.shop_slug}`}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Xem shop
            </Link>
            {/* <ChatButton shop={product.shop} /> */}
          </div>
        </div>
      </div>

      {/* Tabs: Mô tả, Thông số, Đánh giá */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab("description")}
              className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "description"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Mô tả sản phẩm
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "reviews"
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
                className={`prose max-w-none ${
                  !showFullDescription && "max-h-96 overflow-hidden relative"
                }`}
                dangerouslySetInnerHTML={{
                  __html: showFullDescription
                    ? product.fullDescription
                    : product.description,
                }}
              ></div>

              <div className="text-center mt-4">
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center"
                >
                  {showFullDescription ? "Thu gọn" : "Xem thêm"}
                  <i
                    className={`bi ${
                      showFullDescription ? "bi-chevron-up" : "bi-chevron-down"
                    } ml-2`}
                  ></i>
                </button>
              </div>
            </div>
          )}

          {/* Đánh giá */}
          {activeTab === "reviews" && (
            <div>
              <div className="flex flex-col md:flex-row gap-8 mb-8">
                {/* Tổng quan đánh giá */}
                <div className="md:w-1/3 bg-gray-50 p-6 rounded-lg">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-gray-800 mb-2">
                      {product.rating}
                    </div>
                    <div className="flex justify-center text-yellow-400 mb-2">
                      {[...Array(5)].map((_, index) => (
                        <i
                          key={index}
                          className={`bi ${
                            index < Math.floor(product.rating)
                              ? "bi-star-fill"
                              : index < Math.ceil(product.rating)
                              ? "bi-star-half"
                              : "bi-star"
                          }`}
                        ></i>
                      ))}
                    </div>
                    <div className="text-gray-600">
                      {product.reviews.length} đánh giá
                    </div>
                  </div>
                </div>

                {/* Danh sách đánh giá */}
                <div className="md:w-2/3">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Đánh giá từ khách hàng
                    </h3>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-2">
                        Phản hồi bởi:
                      </span>
                      <div className="flex items-center">
                        {product.shop && product.shop.logo && (
                          <img
                            src={product.shop.logo || "/placeholder.svg"}
                            alt={`${product.shop.name} logo`}
                            className="w-8 h-8 rounded-full object-cover mr-2"
                          />
                        )}
                        <span className="font-medium text-gray-800">
                          {product.shop.name}
                        </span>
                      </div>
                    </div>
                  </div>
                  {product.reviews.length === 0 ? (
                    <p className="text-gray-600">
                      Chưa có đánh giá nào cho sản phẩm này.
                    </p>
                  ) : (
                    <div className="space-y-6">
                      {product.reviews.map((review) => (
                        <div
                          key={review.id}
                          className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0"
                        >
                          <div className="flex items-start">
                            <div className="w-12 h-12 mr-4">
                              {review.user.avatar ? (
                                <img
                                  src={review.user.avatar || "/placeholder.svg"}
                                  alt={`${review.user.name}'s avatar`}
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                                  {review.user.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <h4 className="font-medium text-gray-800">
                                  {review.user.name}
                                </h4>
                                <span className="text-gray-500 text-sm">
                                  • {formatDate(review.date)}
                                </span>
                              </div>
                              <div className="flex text-yellow-400 mb-2">
                                {[...Array(5)].map((_, index) => (
                                  <i
                                    key={index}
                                    className={`bi ${
                                      index < Math.floor(review.rating)
                                        ? "bi-star-fill"
                                        : "bi-star"
                                    }`}
                                  ></i>
                                ))}
                              </div>
                              <p className="text-gray-700 mb-3">
                                {review.content}
                              </p>
                              {review.reply && (
                                <div className="ml-4 mt-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                  <div className="flex items-start">
                                    <div className="flex-shrink-0 mr-3">
                                      {review.shop && review.shop.logo && (
                                        <img
                                          src={
                                            review.shop.logo ||
                                            "/placeholder.svg"
                                          }
                                          alt={`${review.shop.name} logo`}
                                          className="w-8 h-8 rounded-full object-cover border border-gray-200"
                                        />
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center mb-1">
                                        <span className="font-medium text-gray-800">
                                          {review.shop.name}
                                        </span>
                                        {review.shop.verify && (
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 text-indigo-500 ml-1"
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
                                        <span className="text-gray-500 text-xs ml-2">
                                          • {formatDate(review.reply_at)}
                                        </span>
                                      </div>
                                      <p className="text-gray-700">
                                        {review.reply}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sản phẩm tương tự */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Sản phẩm tương tự
        </h2>
        {similarProducts.length === 0 ? (
          <p className="text-gray-600">Không có sản phẩm tương tự nào.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {similarProducts.map((product) => (
              <Link
                to={`/product-detail/${product.product_code}`}
                key={product.id}
                className="group"
              >
                <div className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
                  <div className="relative">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.price > product.discountPrice && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs">
                        -
                        {calculateDiscountPercentage(
                          product.price,
                          product.discountPrice
                        )}
                        %
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-medium text-gray-800 mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {product.author}
                    </p>
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400 text-sm">
                        {[...Array(5)].map((_, index) => (
                          <i
                            key={index}
                            className={`bi ${
                              index < Math.floor(product.rating)
                                ? "bi-star-fill"
                                : index < Math.ceil(product.rating)
                                ? "bi-star-half"
                                : "bi-star"
                            }`}
                          ></i>
                        ))}
                      </div>
                      <span className="text-gray-500 text-xs ml-1">
                        ({product.rating})
                      </span>
                    </div>
                    <div className="mt-auto">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-indigo-600 font-bold">
                            {product.discountPrice.toLocaleString()}đ
                          </span>
                          {product.price > product.discountPrice && (
                            <span className="text-gray-500 text-sm line-through ml-1">
                              {product.price.toLocaleString()}đ
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative w-full max-w-4xl">
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
              onClick={() => setShowImageModal(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
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

      {/* Add to Cart Notification */}
      {showAddToCartNotification && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Đã thêm vào giỏ hàng!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
