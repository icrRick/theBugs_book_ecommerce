"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs, Zoom } from "swiper/modules";
import { useNavigate, useParams, Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/zoom";
import axios from "axios";

const ProductDetail = () => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAddToCartNotification, setShowAddToCartNotification] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const source = axios.CancelToken.source();

    const fetchProductData = async () => {
      setLoading(true);
      try {
        const [productResponse, shopResponse, similarResponse] = await Promise.all([
          axios.get(`http://localhost:8080/productdetail?productId=${id}`, { cancelToken: source.token }),
          axios.get(`http://localhost:8080/shopdetail?productId=${id}`, { cancelToken: source.token }),
          axios.get(`http://localhost:8080/similar-products?productId=${id}`, { cancelToken: source.token }),
        ]);

        if (isMounted) {
          // Xử lý dữ liệu sản phẩm chính
          if (!productResponse.data.status) {
            throw new Error(productResponse.data.message || "Không thể tải thông tin sản phẩm");
          }

          console.log("API Product Response:", productResponse.data.data);

          const rawPrice = Number(productResponse.data.data.price) || 0;
          const promotionValue = Number(productResponse.data.data.promotionValue) || 0;
          const discountAmount = (rawPrice * promotionValue) / 100; // Tính số tiền giảm
          const calculatedDiscountPrice = rawPrice - discountAmount; // Giá sau khi giảm

          const productData = {
            id: productResponse.data.data.productId || Number.parseInt(id) || 0,
            name: productResponse.data.data.productName || "Sản phẩm không xác định",
            weight: productResponse.data.data.weight ? `${productResponse.data.data.weight}g` : "Không xác định",
            rating: productResponse.data.data.rating || 0,
            price: Math.max(0, rawPrice),
            discountPrice: promotionValue > 0 && promotionValue <= 100 ? Math.max(0, calculatedDiscountPrice) : Math.max(0, rawPrice),
            reviewCount: productResponse.data.data.reviewCount || 0,
            soldCount: productResponse.data.data.soldCount || 0,
            description: productResponse.data.data.description || "Không có mô tả",
            fullDescription: productResponse.data.data.description || "Không có mô tả",
            categories: productResponse.data.data.toGenres?.map(genre => genre.name) || [],
            author: productResponse.data.data.toAuDtos?.[0]?.name || "Unknown",
            publisher: productResponse.data.data.toPublishers?.[0]?.name || "Unknown",
            inStock: productResponse.data.data.quantity || 100,
            images: Array.isArray(productResponse.data.data.images) && productResponse.data.data.images.length > 0
              ? productResponse.data.data.images.map((img, index) => ({
                  id: index + 1,
                  image: img.imageName || "https://placehold.co/600x800?text=Product+Image",
                }))
              : [{ id: 1, image: "https://placehold.co/600x800?text=Product+Image" }],
            variants: [],
            reviews: productResponse.data.data.content || [], // Thêm reviews từ content
            publishYear: 2023,
            language: "Tiếng Việt",
            pages: 300,
            dimensions: "14 x 20 cm",
            coverType: "Bìa mềm",
            isbn: "1234567890",
          };

          console.log("Processed Product Data:", productData);

          // Xử lý dữ liệu shop
          if (!shopResponse.data.status) {
            throw new Error(shopResponse.data.message || "Không thể tải thông tin cửa hàng");
          }
          const shopData = {
            id: shopResponse.data.data.shopId || 0,
            name: shopResponse.data.data.shopName || "Shop không xác định",
            logo: shopResponse.data.data.image || "https://placehold.co/100x100?text=Shop+Logo",
            verify: shopResponse.data.data.verify || false,
            rate: 4.5,
            responseRate: 95,
            responseTime: "trong vòng 5 phút",
            followers: 1000,
          };

          // Xử lý sản phẩm tương tự
          if (!similarResponse.data.status) {
            throw new Error(similarResponse.data.message || "Không thể tải sản phẩm tương tự");
          }
          const similarProductsData = Array.isArray(similarResponse.data.data) ? similarResponse.data.data.map(product => {
            const rawPriceSimilar = Number(product.price) || 0;
            const promotionValueSimilar = Number(product.promotionValue) || 0;
            const discountAmountSimilar = (rawPriceSimilar * promotionValueSimilar) / 100; // Tính số tiền giảm
            const calculatedDiscountPriceSimilar = rawPriceSimilar - discountAmountSimilar; // Giá sau khi giảm

            return {
              id: product.id || 0,
              name: product.name || "Sản phẩm không xác định",
              image: product.image || "https://placehold.co/300x400?text=Similar+Product",
              author: product.author || "Unknown",
              price: Math.max(0, rawPriceSimilar),
              discountPrice: promotionValueSimilar > 0 && promotionValueSimilar <= 100 
                ? Math.max(0, calculatedDiscountPriceSimilar) 
                : Math.max(0, rawPriceSimilar),
              rating: product.rating || 0,
              soldCount: product.soldCount || 0,
            };
          }) : [];

          console.log("Processed Similar Products:", similarProductsData);

          setProduct({ ...productData, shop: shopData });
          setShop(shopData);
          setSimilarProducts(similarProductsData);
          setSelectedVariant(null);
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request canceled:", error.message);
        } else if (isMounted) {
          console.error("Error fetching product data:", error);
          setProduct(null);
          setShop(null);
          setSimilarProducts([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProductData();

    return () => {
      isMounted = false;
      source.cancel("Component unmounted");
    };
  }, [id]);

  const updateSoldCount = async (additionalQuantity) => {
    if (!product) return;

    const previousSoldCount = product.soldCount;
    const newSoldCount = previousSoldCount + additionalQuantity;

    try {
      setProduct(prev => ({ ...prev, soldCount: newSoldCount }));
      const response = await axios.put(`http://localhost:8080/update-sold-count`, {
        productId: product.id,
        soldCount: newSoldCount,
      });

      if (!response.data.status) {
        throw new Error(response.data.message || "Không thể cập nhật số lượng đã bán");
      }
    } catch (error) {
      console.error("Error updating sold count:", error);
      setProduct(prev => ({ ...prev, soldCount: previousSoldCount }));
      throw error;
    }
  };

  const handleQuantityChange = (value) => {
    const maxStock = selectedVariant?.inStock ?? product?.inStock ?? 999;
    const newQuantity = quantity + value;
    if (newQuantity >= 1 && newQuantity <= maxStock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    console.log("Thêm vào giỏ hàng:", {
      productId: product.id,
      variantId: selectedVariant?.id,
      quantity: quantity,
    });
    setShowAddToCartNotification(true);
    setTimeout(() => setShowAddToCartNotification(false), 3000);
  };

  const handleBuyNow = async () => {
    console.log("Mua ngay:", {
      productId: product.id,
      variantId: selectedVariant?.id,
      quantity: quantity,
    });
    try {
      await updateSoldCount(quantity);
      navigate("/payment");
    } catch (error) {
      console.error("Navigation or sold count update failed:", error);
      alert("Có lỗi xảy ra khi chuyển hướng đến trang thanh toán.");
    }
  };

  const handleReportProduct = () => {
    try {
      navigate(`/report-product/${product.id}`);
    } catch (error) {
      console.error("Navigation failed:", error);
      alert("Không thể chuyển hướng đến trang báo cáo.");
    }
  };

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setShowImageModal(true);
  };

  const handleVariantChange = (variant) => {
    if (!product.variants || product.variants.length === 0) {
      console.warn("Variants chưa được hỗ trợ bởi API");
      alert("Hiện tại sản phẩm này chưa hỗ trợ các biến thể.");
      return;
    }
    setSelectedVariant(variant);
    setQuantity(1);
  };

  const calculateDiscountPercentage = (price, discounted) => {
    if (!price || !discounted || price <= 0 || discounted >= price || discounted === price) return 0;
    const percentage = ((price - discounted) / price) * 100;
    return Math.min(100, Math.max(0, Math.round(percentage)));
  };

  if (loading || !product || !shop) {
    return (
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-800">Không tìm thấy sản phẩm</h2>
            <p className="text-gray-600 mt-2">Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
            <Link to="/" className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Quay lại trang chủ
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex mb-6 text-sm text-gray-600">
        <Link to="/" className="hover:text-blue-600">
          Trang chủ
        </Link>
        <span className="mx-2">/</span>
        {product.categories && product.categories.length > 0 && (
          <>
            <Link to={`/search?category=${encodeURIComponent(product.categories[0])}`} className="hover:text-blue-600">
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
                navigation={{
                  nextEl: ".swiper-button-next-main",
                  prevEl: ".swiper-button-prev-main",
                }}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                modules={[FreeMode, Navigation, Thumbs, Zoom]}
                zoom={true}
                className="product-main-swiper rounded-xl overflow-hidden bg-gray-50 mb-4 aspect-[3/4]"
              >
                {product.images && product.images.length > 0 ? (
                  product.images.map((img, index) => (
                    <SwiperSlide key={img.id} onClick={() => handleImageClick(index)}>
                      <div className="swiper-zoom-container w-full h-full cursor-zoom-in">
                        <img
                          src={img.image || "/placeholder.svg"}
                          alt={`${product.name} - Hình ${index + 1}`}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>
                    </SwiperSlide>
                  ))
                ) : (
                  <SwiperSlide>
                    <div className="swiper-zoom-container w-full h-full cursor-zoom-in">
                      <img
                        src="https://placehold.co/600x800?text=Product+Image"
                        alt="Hình ảnh mặc định"
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    </div>
                  </SwiperSlide>
                )}
                <div className="swiper-button-next swiper-button-next-main"></div>
                <div className="swiper-button-prev swiper-button-prev-main"></div>
              </Swiper>

              {product.discountPrice < product.price && (
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
                {product.images && product.images.length > 0 ? (
                  product.images.map((img, index) => (
                    <SwiperSlide key={img.id}>
                      <div className="cursor-pointer rounded-md overflow-hidden border-2 hover:border-blue-500 transition-all duration-200">
                        <img
                          src={img.image || "/placeholder.svg"}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover aspect-square"
                          loading="lazy"
                        />
                      </div>
                    </SwiperSlide>
                  ))
                ) : (
                  <SwiperSlide>
                    <div className="cursor-pointer rounded-md overflow-hidden border-2 hover:border-blue-500 transition-all duration-200">
                      <img
                        src="https://placehold.co/600x800?text=Product+Image"
                        alt="Thumbnail mặc định"
                        className="w-full h-full object-cover aspect-square"
                        loading="lazy"
                      />
                    </div>
                  </SwiperSlide>
                )}
              </Swiper>

              <div className="flex items-center justify-center mt-6 space-x-4">
                <button className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
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
                    className="text-blue-600 hover:underline"
                  >
                    {product.author}
                  </Link>
                </div>

                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-gray-600">Nhà xuất bản:</span>
                  <Link
                    to={`/search?publisher=${encodeURIComponent(product.publisher)}`}
                    className="text-blue-600 hover:underline"
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
                        className="text-blue-600 hover:underline"
                      >
                        {category}
                        {index < product.categories.length - 1 && ","}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-baseline mb-2">
                  <span className="text-3xl font-bold text-red-600 mr-3">
                    {product.discountPrice.toLocaleString('vi-VN')}đ
                  </span>
                  {product.discountPrice < product.price && (
                    <span className="text-xl text-gray-500 line-through">
                      {product.price.toLocaleString('vi-VN')}đ
                    </span>
                  )}
                </div>
                {product.discountPrice < product.price && (
                  <div className="text-sm text-gray-600">
                    <i className="bi bi-graph-down-arrow mr-1"></i>
                    Giảm {calculateDiscountPercentage(product.price, product.discountPrice)}%
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Số lượng</h3>
                <div className="flex items-center">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className={`w-10 h-10 flex items-center justify-center border border-gray-300 rounded-l-lg ${quantity <= 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "hover:bg-gray-100"}`}
                  >
                    <i className="bi bi-dash"></i>
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={selectedVariant?.inStock ?? product.inStock}
                    value={quantity}
                    onChange={(e) => {
                      const val = Number.parseInt(e.target.value) || 1;
                      const maxStock = selectedVariant?.inStock ?? product.inStock ?? 999;
                      if (val >= 1 && val <= maxStock) {
                        setQuantity(val);
                      } else if (val < 1) {
                        setQuantity(1);
                      } else {
                        setQuantity(maxStock);
                      }
                    }}
                    className="w-16 h-10 border-t border-b border-gray-300 text-center focus:outline-none"
                  />
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= (selectedVariant?.inStock ?? product.inStock)}
                    className={`w-10 h-10 flex items-center justify-center border border-gray-300 rounded-r-lg ${quantity >= (selectedVariant?.inStock ?? product.inStock) ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "hover:bg-gray-100"}`}
                  >
                    <i className="bi bi-plus"></i>
                  </button>
                  <span className="ml-4 text-sm text-gray-600">
                    Có sẵn: {(selectedVariant?.inStock ?? product.inStock)} sản phẩm
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 px-6 py-3 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium flex items-center justify-center"
                >
                  <i className="bi bi-cart-plus text-xl mr-2"></i>
                  Thêm vào giỏ hàng
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center"
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
              src={shop.logo}
              alt={shop.name}
              className="w-16 h-16 rounded-full border-2 border-gray-200 mr-4"
              loading="lazy"
            />
            <div>
              <div className="flex items-center">
                <h3 className="font-semibold text-lg text-gray-800 mr-2">{shop.name}</h3>
                {shop.verify && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-500"
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
                  <span className="text-gray-600">{shop.rate}</span>
                </div>
                <div className="flex items-center">
                  <i className="bi bi-people text-gray-600 mr-1"></i>
                  <span className="text-gray-600">{shop.followers.toLocaleString()} người theo dõi</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex space-x-4">
            <Link
              to={`/shop/${shop.id}`}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Xem shop
            </Link>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <i className="bi bi-chat-dots mr-2"></i>
              Chat ngay
            </button>
          </div>
        </div>
      </div>

      {/* Tabs: Mô tả, Thông số, Đánh giá */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab("description")}
              className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${activeTab === "description" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
            >
              Mô tả sản phẩm
            </button>
            <button
              onClick={() => setActiveTab("specifications")}
              className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${activeTab === "specifications" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
            >
              Thông số kỹ thuật
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${activeTab === "reviews" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
            >
              Đánh giá ({product.reviews.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "description" && (
            <div>
              <div
                className={`prose max-w-none ${!showFullDescription && "max-h-96 overflow-hidden relative"}`}
                dangerouslySetInnerHTML={{
                  __html: showFullDescription ? product.fullDescription : product.description,
                }}
              ></div>
              {!showFullDescription && (
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
              )}
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

          {activeTab === "specifications" && (
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-500 w-1/3">Tác giả</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.author}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-500 w-1/3">Nhà xuất bản</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.publisher}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-500 w-1/3">Năm xuất bản</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.publishYear}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-500 w-1/3">Ngôn ngữ</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.language}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-500 w-1/3">Số trang</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.pages}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-500 w-1/3">Trọng lượng</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.weight}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-500 w-1/3">Kích thước</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.dimensions}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-500 w-1/3">Loại bìa</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.coverType}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-500 w-1/3">ISBN</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.isbn}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="md:w-1/3 bg-gray-50 p-6 rounded-lg">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-gray-800 mb-2">{product.rating}</div>
                    <div className="flex justify-center text-yellow-400 mb-2">
                      {[...Array(5)].map((_, index) => (
                        <i
                          key={index}
                          className={`bi ${index < Math.floor(product.rating) ? "bi-star-fill" : index < Math.ceil(product.rating) ? "bi-star-half" : "bi-star"}`}
                        ></i>
                      ))}
                    </div>
                    <div className="text-gray-600">{product.reviewCount} đánh giá</div>
                  </div>
                  <div className="mt-6 text-center text-gray-500">Chưa có dữ liệu đánh giá chi tiết</div>
                </div>

                <div className="md:w-2/3">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Đánh giá từ khách hàng</h3>
                  {product.reviews.length > 0 ? (
                    product.reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 py-4">
                        <div className="flex items-center mb-2">
                          <span className="font-medium text-gray-800 mr-2">{review.reviewerName}</span>
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, index) => (
                              <i
                                key={index}
                                className={`bi ${index < review.rate ? "bi-star-fill" : "bi-star"}`}
                              ></i>
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{review.content}</p>
                        <p className="text-gray-500 text-xs">
                          Ngày đánh giá: {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500">Chưa có đánh giá nào</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sản phẩm tương tự */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Sản phẩm tương tự</h2>
        {similarProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {similarProducts.map((product) => (
              <Link to={`/product-detail/${product.id}`} key={product.id} className="group">
                <div className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    {product.discountPrice < product.price && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs">
                        -{calculateDiscountPercentage(product.price, product.discountPrice)}%
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-medium text-gray-800 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">{product.author}</p>
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400 text-sm">
                        {[...Array(5)].map((_, index) => (
                          <i
                            key={index}
                            className={`bi ${index < Math.floor(product.rating) ? "bi-star-fill" : index < Math.ceil(product.rating) ? "bi-star-half" : "bi-star"}`}
                          ></i>
                        ))}
                      </div>
                      <span className="text-gray-500 text-xs ml-1">({product.rating})</span>
                    </div>
                    <div className="mt-auto">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-red-600 font-bold">{product.discountPrice.toLocaleString('vi-VN')}đ</span>
                          {product.discountPrice < product.price && (
                            <span className="text-gray-500 text-sm line-through ml-1">
                              {product.price.toLocaleString('vi-VN')}đ
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
        ) : (
          <p className="text-gray-500">Không có sản phẩm tương tự</p>
        )}
      </div>

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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <Swiper
              initialSlide={currentImageIndex}
              navigation={{
                nextEl: ".swiper-button-next-modal",
                prevEl: ".swiper-button-prev-modal",
              }}
              modules={[Navigation, Zoom]}
              zoom={true}
              className="w-full"
            >
              {product.images.map((img) => (
                <SwiperSlide key={img.id}>
                  <div className="swiper-zoom-container">
                    <img
                      src={img.image}
                      alt={product.name}
                      className="w-full h-full object-contain max-h-[80vh]"
                      loading="lazy"
                    />
                  </div>
                </SwiperSlide>
              ))}
              <div className="swiper-button-next swiper-button-next-modal"></div>
              <div className="swiper-button-prev swiper-button-prev-modal"></div>
            </Swiper>
          </div>
        </div>
      )}

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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Đã thêm vào giỏ hàng!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;