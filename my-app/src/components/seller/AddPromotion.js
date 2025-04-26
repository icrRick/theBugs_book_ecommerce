"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

import axiosInstance from "../../utils/axiosInstance";
import {
  showErrorToast,
  showInfoToast,
  showSuccessToast,
} from "../../utils/Toast";
import { set } from "lodash";

const AddPromotion = () => {
  const navigate = useNavigate();
  const [discountedPrice, setDiscountedPrice] = useState();
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [formData, setFormData] = useState({
    promotionValue: "",
    startDate: "",
    endDate: "",
  });
  const [newProductId, setNewProductId] = useState();
  const [newProductQuantity, setNewProductQuantity] = useState(1);
  const [defaultQuantity, setDefaultQuantity] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const [isFetching, setIsFetching] = useState(false);

  // Fetch products when component mounts
  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = () => {
    console.log("Fetching products...");
    
    axiosInstance
      .get("/api/seller/promotion/products", {
        params: {
          pageNumber: currentPage,
          pageSize: itemsPerPage,
        },
      })
      .then((response) => {
        setProducts((prevProducts) => [
          ...prevProducts,
          ...response.data.data.content,
        ]);

        setTotalPages(response.data.data.totalPages || 1);
        console.log(response.data.data.content);
      })
      .catch((error) => {
        showErrorToast(error.response.data.message);
      }).finally(() => {
        setIsFetching(false);
      })
  };
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (
      scrollTop + clientHeight >= scrollHeight - 10 &&
      currentPage < totalPages &&
      !isFetching
    ) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const findProductPrice = (productId) => {
    const product = products.find((p) => p.id === Number(productId));
    return product ? product.price : null;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const calculateDiscountedPrice = (originalPrice) => {
    if (!originalPrice || !formData.promotionValue) {
      return originalPrice;
    }

    const discount = Number(formData.promotionValue);

    if (isNaN(discount) || discount < 0 || discount > 100) {
      return originalPrice;
    }

    const discountedPrice = Math.round(originalPrice * (1 - discount / 100));
    return discountedPrice;
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

  const handleAddProduct = () => {
    if (!newProductId) {
      showErrorToast("Vui lòng chọn sản phẩm");
      return;
    }
    console.log("newProductId");
    console.log(newProductId);

    const product = products.find((p) => p.id === Number(newProductId));
    console.log("product", product);

    if (!product) {
      showErrorToast("Không tìm thấy sản phẩm");
      return;
    }

    // Kiểm tra xem sản phẩm đã được chọn chưa
    if (selectedProducts.some((item) => item.id === newProductId)) {
      showErrorToast(`Sản phẩm "${product.name}" đã được chọn`);
      return;
    }

    // Kiểm tra xung đột khuyến mãi
    if (product.currentPromotionDTO && formData.startDate) {
      const currentEndDate = new Date(product.currentPromotionDTO.endDate);
      const newStartDate = new Date(formData.startDate);

      if (newStartDate < currentEndDate) {
        showErrorToast(
          <>
            Sản phẩm "{product.name}" đang có khuyến mãi từ ngày <br></br>
            {product.currentPromotionDTO.startDate} đến ngày{" "}
            {product.currentPromotionDTO.endDate}
          </>
        );
        return;
      }
    }

    // Thêm sản phẩm vào danh sách đã chọn
    setSelectedProducts((prev) => [
      ...prev,
      {
        id: newProductId,
        name: product.name,
        quantity: newProductQuantity,
        price: product.price,
        isPromotionActive: product.currentPromotionDTO?.isActive || false,
      },
    ]);

    // Reset form thêm sản phẩm
    setNewProductId("");
    setNewProductQuantity(defaultQuantity);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedProducts.length === 0) {
      showErrorToast("Vui lòng chọn ít nhất một sản phẩm");
      return;
    }

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

  const handleRemoveSelected = (productId) => {
    const removed = selectedProducts.find((item) => item.id === productId);
    if (removed) {
      showInfoToast(`Đã xóa sản phẩm "${removed.name}" khỏi danh sách.`);
    }
    setSelectedProducts((prev) => prev.filter((item) => item.id !== productId));
  };

  const handleQuantityChange = (id, value) => {
    setSelectedProducts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Number(value) } : item
      )
    );
  };

  const handleDefaultQuantityChange = (e) => {
    const value = Number(e.target.value);
    if (value > 0) {
      setDefaultQuantity(value);
      setNewProductQuantity(value);
    }
  };

  const availableProducts = products
    .filter(
      (product, index, self) =>
        index === self.findIndex((p) => p.id === product.id)
    )
    .filter(
      (product) => !selectedProducts.some((item) => item.id === product.id)
    );
  const productOptions = availableProducts.map((product) => ({
    value: product.id,
    label: product.name,
  }));

  // Lấy thông tin chi tiết của sản phẩm đã chọn
  const selectedProductsInfo = selectedProducts.map((selected) => {
    const product = products.find((p) => p.id === selected.id) || {};
    return {
      ...selected,
      price: product.price || selected.price,
      currentPromotionDTO: product.currentPromotionDTO,
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
                        (Number.parseInt(value) >= 0 &&
                          Number.parseInt(value) <= 100)
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
            </div>

            {/* Bảng sản phẩm đã chọn */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Sản Phẩm Áp Dụng Khuyến Mãi ({selectedProducts.length})
              </h3>

              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-center font-medium text-gray-500 w-12 border-r border-gray-200">
                        STT
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500 border-r border-gray-200">
                        Tên sản phẩm
                      </th>
                      <th className="px-4 py-3 text-center font-medium text-gray-500 border-r border-gray-200">
                        Giá gốc
                      </th>
                      <th className="px-4 py-3 text-center font-medium text-gray-500 border-r border-gray-200">
                        Giá sau khi giảm
                      </th>
                      <th className="px-4 py-3 text-center font-medium text-gray-500 w-32 border-r border-gray-200">
                        Số lượng
                      </th>
                      <th className="px-4 py-3 text-center font-medium text-gray-500 w-24">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedProductsInfo.map((product, index) => (
                      <tr
                        key={product.id}
                        className="hover:bg-gray-50 border-b border-gray-200"
                      >
                        <td className="px-4 py-3 text-center text-gray-500 border-r border-gray-200">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3 text-left font-medium text-gray-900 border-r border-gray-200">
                          {product.name}
                        </td>

                        <td className="px-4 py-3 text-center text-green-600 font-medium border-r border-gray-200">
                          {product.price
                            ? product.price.toLocaleString("vi-VN")
                            : "0"}
                          đ
                        </td>
                        <td className="px-4 py-3 text-center text-red-600 font-medium border-r border-gray-200">
                          {product.price
                            ? calculateDiscountedPrice(
                                product.price
                              ).toLocaleString("vi-VN")
                            : "0"}
                          đ
                        </td>
                        <td className="px-4 py-3 text-center border-r border-gray-200">
                          <input
                            type="number"
                            min="1"
                            value={product.quantity}
                            onChange={(e) =>
                              handleQuantityChange(product.id, e.target.value)
                            }
                            className="w-20 border border-gray-300 rounded px-2 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveSelected(product.id)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}

                    {/* Hàng thêm sản phẩm mới */}
                    <tr className="bg-gray-50">
                      <td className="px-4 py-3 text-center border-r border-gray-200">
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-600">
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
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </span>
                      </td>
                      <td className="px-4 py-3 border-r border-gray-200">
                        <Select
                          name="product"
                          options={productOptions}
                          value={
                            productOptions.find(
                              (option) => option.value === newProductId
                            ) || null
                          }
                          onChange={(selected) => {
                            setNewProductId(selected ? selected.value : "");
                          }}
                          onMenuScrollToBottom={handleScroll}
                          className="basic-single-select w-full"
                          classNamePrefix="select"
                          placeholder="-- Chọn sản phẩm --"
                          isSearchable
                          menuPortalTarget={document.body} // <-- thêm dòng này
                          menuPosition="fixed" // <-- và dòng này
                          styles={{
                            control: (base) => ({
                              ...base,
                              minHeight: "45px",
                              width: "100%",
                              borderRadius: "0.5rem",
                              border: "1px solid #ccc",
                              boxShadow: "none",
                              backgroundColor: "#fff",
                              "&:hover": {
                                borderColor: "#2563eb",
                              },
                              zIndex: 100, // <-- nếu muốn chắc chắn nó nằm trên bảng
                            }),
                            menuPortal: (base) => ({
                              ...base,
                              zIndex: 9999, // <-- bắt buộc: đảm bảo menu nằm trên tất cả
                            }),
                            menu: (base) => ({
                              ...base,
                              borderRadius: "0.5rem",
                              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                              backgroundColor: "#fff",
                            }),
                            option: (
                              base,
                              { isFocused, isSelected, isActive }
                            ) => ({
                              ...base,
                              backgroundColor: isActive
                                ? "#ff4d4d"
                                : isFocused
                                ? "#cfe4ff"
                                : "#fff",
                              "&:active": {
                                backgroundColor: "#B2D4FF",
                              },
                              color: "black",
                            }),
                          }}
                        />

                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <svg
                            className="h-4 w-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center  text-green-600 border-r font-medium border-gray-200">
                        {findProductPrice(newProductId)?.toLocaleString(
                          "vi-VN"
                        )}{" "}
                        đ
                      </td>
                      <td className="px-4 py-3 text-center  text-red-600 border-r font-medium border-gray-200">
                        {calculateDiscountedPrice(
                          findProductPrice(newProductId)
                        )?.toLocaleString("vi-VN")}{" "}
                        đ{/* Cột giá để trống */}
                      </td>
                      <td className="px-4 py-3 text-center border-r border-gray-200">
                        <input
                          type="number"
                          min="1"
                          value={newProductQuantity}
                          onChange={(e) =>
                            setNewProductQuantity(Number(e.target.value))
                          }
                          className="w-20 border border-gray-300 rounded px-2 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={handleAddProduct}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Thêm
                        </button>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-gray-100">
                    <tr>
                      <td
                        colSpan="4"
                        className="px-4 py-3 text-right text-sm font-medium text-gray-700 border-r border-gray-200"
                      >
                        Số lượng mặc định:
                      </td>

                      <td className="px-4 py-3 text-center border-r border-gray-200">
                        <input
                          type="number"
                          min="1"
                          value={defaultQuantity}
                          onChange={handleDefaultQuantityChange}
                          className="w-20 border border-gray-300 rounded px-2 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </td>

                      <td className="px-4 py-3 text-center text-xs text-gray-500">
                        Áp dụng cho sản phẩm mới
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Form buttons */}
            <div className="flex justify-end gap-4">
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPromotion;
