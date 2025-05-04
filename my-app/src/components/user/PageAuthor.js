import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const PageAuthor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [author, setAuthor] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("default");

  // Format functions
  const formatCurrency = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatSumCountReview = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count;
  };

  const formatSold = (sold) => {
    if (sold >= 1000) {
      return `${(sold / 1000).toFixed(1)}k`;
    }
    return sold;
  };

  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/author/detail?id=${id}`
        );
        const data = response.data.data;
        setAuthor(data.author);
        setProducts(data.products);
        setLoading(false);
      } catch (err) {
        setError("Không thể tải dữ liệu tác giả");
        setLoading(false);
      }
    };

    fetchAuthorData();
  }, [id]);

  const handleProductClick = (productCode) => {
    navigate(`/product-detail/${productCode}`);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    let sortedProducts = [...products];

    switch (e.target.value) {
      case "price_asc":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case "review_desc":
        sortedProducts.sort((a, b) => b.totalReview - a.totalReview);
        break;
      default:
        sortedProducts = [...products];
    }

    setProducts(sortedProducts);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  if (!author) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">
              Thông tin tác giả
            </h1>
            <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
              <i className="fas fa-share-alt"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Author Profile Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/3 flex flex-col items-center">
              <div className="relative">
                <img
                  src={author.urlImage || "https://via.placeholder.com/200"}
                  alt={author.name}
                  className="rounded-full w-48 h-48 object-cover border-4 border-white shadow-lg"
                />
              </div>
            </div>
            <div className="md:w-2/3">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {author.name}
              </h1>

              <div className=" p-6 rounded-lg inline-block">
                <div className="text-3xl font-bold text-gray-800">
                  {products.length}
                </div>
                <div className="text-gray-600 text-lg">Tác phẩm</div>
              </div>
            </div>
          </div>
        </div>

        {/* Books Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Sách của tác giả
            </h2>
            <div className="flex items-center space-x-4">
              <select
                value={sortOption}
                onChange={handleSortChange}
                className="border rounded-lg px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="default">Sắp xếp theo</option>
                <option value="price_asc">Giá tăng dần</option>
                <option value="price_desc">Giá giảm dần</option>
                <option value="review_desc">Đánh giá cao</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product?.productId}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <Link
                  to={`/product-detail/${product?.productCode}`}
                  className="block"
                >
                  <div className="relative">
                    <img
                      src={product?.productImage || "/placeholder.svg"}
                      alt={product?.productName}
                      className="w-full aspect-[3/4] object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-800 mb-2 line-clamp-2 h-12">
                      {product?.productName}
                    </h3>

                    <div className="flex items-center gap-1 mb-2">
                      {product?.totalReview > 0 && (
                        <span className="text-gray-500 text-sm">
                          ({formatSumCountReview(product?.totalReview)} đánh
                          giá)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-red-600 font-bold text-lg">
                          {formatCurrency(product?.price)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        {product?.productCategory}
                      </div>
                      <div className="text-sm text-gray-500">
                        {product?.productGenres}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageAuthor;
