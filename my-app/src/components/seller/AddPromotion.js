import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import {
  showErrorToast,
  showInfoToast,
  showSuccessToast,
} from "../../utils/Toast";

const AddPromotion = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [defaultQuantity, setDefaultQuantity] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [formData, setFormData] = useState({
    promotionValue: "",
    startDate: "",
    endDate: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

  // Fetch products when page changes
  useEffect(() => {
    axiosInstance
      .get("/api/seller/promotion/products", {
        params: {
          pageNumber: currentPage,
        },
      })
      .then((response) => {
        setProducts(response.data.data.content || response.data.data);
        setTotalPages(response.data.data.totalPages || 1);
      })
      .catch((error) => {
        showErrorToast(error.response.data.message);
      });
  }, [currentPage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckPromotionConflict = (e) => {
    const newStartDate = new Date(e.target.value);

    const validSelected = selectedProducts.filter((item) => {
      const product = products.find((p) => p.id === item.id);

      if (product?.currentPromotionDTO?.endDate) {
        const currentEndDate = new Date(product.currentPromotionDTO.endDate);
        const isConflict = newStartDate < currentEndDate;

        if (isConflict) {
          showErrorToast(
            `Sản phẩm "${product.name}" đang có khuyến mãi đến ngày ${product.currentPromotionDTO.endDate}. Đã bỏ chọn sản phẩm này.`
          );
          return false;
        }
      }

      return true;
    });

    setSelectedProducts(validSelected);
  };

  const handleProductSelect = (productId) => {
    const product = products.find((p) => p.id === productId);

    if (product.currentPromotionDTO) {
      const currentEndDate = new Date(product.currentPromotionDTO.endDate);
      const newStartDate = new Date(formData.startDate);

      if (newStartDate < currentEndDate) {
        showErrorToast(
          `Sản phẩm "${product.name}" đang có khuyến mãi đến ngày ${product.currentPromotionDTO.endDate}`
        );
        return;
      }
    }

    setSelectedProducts((prev) => {
      const exists = prev.find((item) => item.id === productId);
      if (exists) {
        return prev.filter((item) => item.id !== productId);
      }
      return [
        ...prev,
        {
          id: productId,
          name: product.name,
          quantity: defaultQuantity,
          isPromotionActive: product.currentPromotionDTO?.isActive || false,
        },
      ];
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = {
      promotionValue: Number(formData.promotionValue),
      startDate: formData.startDate,
      expireDate: formData.endDate,
      products: selectedProducts.map((product) => ({
        id: product.id,
        quantity: product.quantity,
      })),
    };

    axiosInstance
      .post("/api/seller/promotion/create", dataToSend)
      .then(() => {
        showSuccessToast("Khuyến mãi đã được thêm thành công");
        navigate("/seller/promotions");
      })
      .catch((error) => {
        showErrorToast(error.response.data.message);
      });
  };

  const calculateDiscountedPrice = (product) => {
    const currentPromotionDTO = product.currentPromotionDTO;
    const newPromotionValue = parseFloat(formData.promotionValue);

    if (!currentPromotionDTO && !newPromotionValue) return product.price;
    if (currentPromotionDTO && !newPromotionValue)
      return product.price * (1 - currentPromotionDTO.value / 100);
    if (!currentPromotionDTO && newPromotionValue)
      return product.price * (1 - newPromotionValue / 100);

    const currentDiscount = currentPromotionDTO.value / 100;
    const newDiscount = newPromotionValue / 100;
    const maxDiscount = Math.max(currentDiscount, newDiscount);

    return product.price * (1 - maxDiscount);
  };

  const handleRemoveSelected = (productId) => {
    const removed = selectedProducts.find((item) => item.id === productId);
    if (removed) {
      showInfoToast(`Đã xóa sản phẩm "${removed.name}" khỏi danh sách.`);
    }
    setSelectedProducts((prev) => prev.filter((item) => item.id !== productId));
  };

  const handleDefaultQuantityChange = (e) => {
    const quantity = e.target.value;
    setDefaultQuantity(quantity);
    setSelectedProducts((prev) =>
      prev.map((item) => ({ ...item, quantity: Number(quantity) }))
    );
  };

  const handleQuantityChange = (id, value) => {
    setSelectedProducts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Number(value) } : item
      )
    );
  };

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  // Get selected products info with updated data
  const selectedProductsInfo = selectedProducts.map((selected) => {
    const product = products.find((p) => p.id === selected.id);
    return {
      ...selected,
      ...product,
      quantity: selected.quantity,
      isPromotionActive: product?.currentPromotionDTO?.isActive || false,
    };
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Thêm Khuyến Mãi Mới
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Điền thông tin khuyến mãi và chọn sản phẩm áp dụng
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Form fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Promotion value */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá Trị Khuyến Mãi (%) <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="number"
                    name="promotionValue"
                    max={100}
                    min={0}
                    value={formData.promotionValue}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (
                        value === "" ||
                        (parseInt(value) >= 0 && parseInt(value) <= 100)
                      ) {
                        handleInputChange(e);
                      }
                    }}
                    placeholder="Nhập phần trăm giảm giá"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">%</span>
                  </div>
                </div>
              </div>

              {/* Start date */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày Bắt Đầu <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={(e) => {
                    handleInputChange(e);
                    handleCheckPromotionConflict(e);
                  }}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* End date */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày Kết Thúc <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Form buttons */}
              <div className="col-span-1 md:col-span-3 flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => navigate("/seller/promotions")}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={selectedProducts.length === 0}
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                    ${
                      selectedProducts.length === 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    }`}
                >
                  Thêm Khuyến Mãi
                </button>
              </div>
            </div>

            {/* Selected products */}
            {selectedProductsInfo.length > 0 && (
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-800 mb-3">
                  Sản Phẩm Đã Chọn ({selectedProductsInfo.length})
                </h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số Lượng Mặc Định
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={defaultQuantity}
                    onChange={handleDefaultQuantityChange}
                    className="block w-16 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedProductsInfo.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center bg-white rounded-md shadow-sm px-3 py-2 text-sm"
                    >
                      <span className="text-gray-700">{product.name}</span>
                      <span className="mx-2 text-gray-400">|</span>
                      <span className="text-green-600 font-medium">
                        <span className="text-green-600 font-medium">
                          {product.price
                            ? product.price.toLocaleString("vi-VN")
                            : "0"}
                          đ
                        </span>
                      </span>
                      <span className="mx-2 text-gray-400">|</span>
                      <span className="ml-3 text-gray-500 text-xs">SL:</span>
                      <input
                        type="number"
                        min="1"
                        value={product.quantity}
                        onChange={(e) =>
                          handleQuantityChange(product.id, e.target.value)
                        }
                        className="ml-3 w-16 border border-gray-300 rounded px-2 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSelected(product.id)}
                        className="ml-2 text-gray-400 hover:text-red-500 focus:outline-none"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Product list */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  Danh Sách Sản Phẩm
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Đã chọn {selectedProductsInfo.length} sản phẩm
                </p>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Chọn
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tên Sản Phẩm
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Giá Gốc
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Khuyến Mãi Hiện Tại
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Giá Sau Giảm
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedProducts.some(
                              (item) => item.id === product.id
                            )}
                            onChange={() => handleProductSelect(product.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <span className="text-green-600 font-medium">
                              {product.price
                                ? product.price.toLocaleString("vi-VN")
                                : "0"}
                              đ
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {product.currentPromotionDTO?.value ? (
                            <div className="text-sm">
                              <p className="text-blue-600">
                                {product.currentPromotionDTO.value}%
                              </p>
                              <p className="text-gray-500 text-xs">
                                Ngày bắt đầu:{" "}
                                {product.currentPromotionDTO.startDate}
                              </p>
                              <p className="text-gray-500 text-xs">
                                Ngày kết thúc:{" "}
                                {product.currentPromotionDTO.endDate}
                              </p>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500">
                              Không có
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-green-600 font-medium">
                            {calculateDiscountedPrice(product).toLocaleString(
                              "vi-VN"
                            )}
                            đ
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </form>

          {/* Pagination - Đặt bên ngoài form để tránh submit */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 space-x-2">
              <button
                type="button"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                }`}
              >
                Trước
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => paginate(page)}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                type="button"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                }`}
              >
                Sau
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddPromotion;
