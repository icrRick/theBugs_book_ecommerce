import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { formatCurrency } from "../../utils/Format";
import { showSuccessToast, showErrorToast } from "../../utils/Toast";
import Loading from "../../utils/Loading";
import { useForm } from "react-hook-form";

const OrderDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [hasShowToast, setHasShowToast] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      rating: 5,
      content: "",
      orderItemId: "",
      id: null,
    },
  });

  const handleNavigate = () => {
    navigate("/account/ordered");
  };

  const fetchOrderDetails = async (orderId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/user/order/${orderId}`);
      if (!response.data.status) {
        showErrorToast(response.data.message || "Không thể tải chi tiết đơn hàng");
      }
      setItem(response.data.data);
    } catch (error) {
      showErrorToast(error.response?.data?.message || "Đã xảy ra lỗi khi tải chi tiết đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (item && item.orderStatusName === "Đã duyệt" && item.noted && !hasShowToast) {
      showSuccessToast(item.noted);
      setHasShowToast(true);
    }
  }, [item, hasShowToast]);

  useEffect(() => {
    if (id) {
      fetchOrderDetails(id);
    }
  }, [id]);

  const handleOpenRatingModal = (product) => {
    setSelectedProduct(product);
    setIsRatingModalOpen(true);
    console.log("Opening modal for product:", product);
    setValue("orderItemId", product.orderItemId);
    if (product.isReviewed) {
      setValue("id", product.reviewId);
      setValue("rating", product.reviewRating);
      setValue("content", product.reviewContent);
    } else {
      reset({ rating: 5, content: "", orderItemId: product.orderItemId, id: null });
    }
  };

  const onSubmitRating = async (data) => {
    if (!data.orderItemId) {
      showErrorToast("OrderItemId không được để trống");
      return;
    }
    if (!confirmSubmit) {
      setConfirmSubmit(true);
      return;
    }
    console.log("Submitting rating:", data);
    setLoading(true);
    try {
      const endpoint = data.id ? "/user/review/update" : "/user/review/create";
      const response = await axiosInstance.post(endpoint, data);

      if (response.data.status) {
        showSuccessToast(data.id ? "Cập nhật đánh giá thành công" : "Đánh giá sản phẩm thành công");
        setIsRatingModalOpen(false);
        fetchOrderDetails(id);
      } else {
        showErrorToast(response.data.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      showErrorToast(error.response?.data?.message || "Có lỗi khi gửi đánh giá");
    } finally {
      setLoading(false);
      setConfirmSubmit(false);
    }
  };

  if (!loading && item === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-gray-500 mx-auto"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
              clipRule="evenodd"
            />
          </svg>
          <p className="mt-4 text-lg text-gray-700">Không tìm thấy đơn hàng</p>
          <button
            onClick={handleNavigate}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Quay lại danh sách đơn hàng
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = {
    "Chờ duyệt": {
      color: "bg-amber-100 text-amber-800 border-amber-200",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    "Đã hủy": {
      color: "bg-red-100 text-red-800 border-red-200",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    "Đã duyệt": {
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    "Đang giao": {
      color: "bg-purple-100 text-purple-800 border-purple-200",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
        </svg>
      ),
    },
    "Đã nhận": {
      color: "bg-green-100 text-green-800 border-green-200",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path
            fillRule="evenodd"
            d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  };

  return (
    <>
      {loading && <Loading />}
      <div className="max-w-full">
        <div className="flex items-center justify-between mb-8 bg-white rounded-lg border border-gray-100 p-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Chi tiết đơn hàng #{item?.orderId}
          </h2>
          <div className="flex flex-col items-end space-y-2">
            <div
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-sm border ${
                statusConfig[item?.orderStatusName]?.color || "bg-gray-100 text-gray-800 border-gray-200"
              }`}
            >
              {statusConfig[item?.orderStatusName]?.icon || (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <span className="font-medium">{item?.orderStatusName || "Không xác định"}</span>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="border-r border-gray-100 pr-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 text-blue-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Thông tin khách hàng
                </h3>
                <div className="space-y-3">
                  <p className="text-sm text-gray-700">{item?.fullName}</p>
                  <p className="text-sm text-gray-700">{item?.phone}</p>
                  <p className="text-sm text-gray-700">{item?.address}</p>
                </div>
              </div>

              <div className="border-r border-gray-100 pr-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 text-green-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                  </svg>
                  Thông tin giao hàng
                </h3>
                <div className="space-y-3">
                  <p className="text-sm text-gray-700">Phương thức: Giao hàng nhanh</p>
                  <p className="text-sm text-gray-700">Phí vận chuyển: {formatCurrency(item?.shippingFee)}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 text-purple-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Thông tin thanh toán
                </h3>
                <div className="space-y-3">
                  <p className="text-sm text-gray-700">Phương thức: {item?.paymentMethod}</p>
                  <p className="text-sm text-gray-700">Trạng thái: {item?.paymentStatus}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold mb-6 flex items-center text-gray-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2 text-orange-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              Danh sách sản phẩm
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Sản phẩm
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Số lượng
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-right text-sm font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Đơn giá
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-right text-sm font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Tổng tiền
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-right text-sm font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {item?.orderItems &&
                    item.orderItems.length > 0 &&
                    item.orderItems.map((product) => (
                      <tr key={product.productId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-16 w-16">
                              <img
                                className="h-16 w-16 rounded-lg object-cover"
                                src={product.productImage}
                                alt={product.productName}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.productName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-sm text-gray-900">{product.quantityProduct}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm text-gray-900">{formatCurrency(product.priceProduct)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm text-gray-900">{formatCurrency(product.totalPriceProduct)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {item.orderStatusName === "Đã nhận" ? (
                            product.isReviewed ? (
                              <span className="text-sm text-gray-600">
                                Đã đánh giá
                                {product.isReviewEditable && (
                                  <button
                                    onClick={() => handleOpenRatingModal(product)}
                                    className="ml-2 text-sm text-blue-600 hover:text-blue-900"
                                  >
                                    Chỉnh sửa
                                  </button>
                                )}
                              </span>
                            ) : (
                              <button
                                onClick={() => handleOpenRatingModal(product)}
                                className="text-sm text-blue-600 hover:text-blue-900"
                              >
                                Đánh giá
                              </button>
                            )
                          ) : null}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center text-base text-gray-700 mb-2">
                <span>Tạm tính:</span>
                <span>{formatCurrency(item?.totalPrice)}</span>
              </div>
              <div className="flex justify-between items-center text-base text-green-600 mb-2">
                <span>Giảm giá:</span>
                <span>-{formatCurrency(item?.totalDiscount)}</span>
              </div>
              <div className="flex justify-between items-center text-base text-gray-700 mb-2">
                <span>Phí vận chuyển:</span>
                <span>{formatCurrency(item?.shippingFee)}</span>
              </div>
              <div className="flex justify-between items-center text-xl font-bold text-blue-600 mt-4 pt-4 border-t border-gray-200">
                <span>Tổng cộng:</span>
                <span>{formatCurrency(item?.total)}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <button
            onClick={handleNavigate}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Quay lại
          </button>
        </div>

        {isRatingModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div className="fixed inset-0 bg-black opacity-40"></div>
              <div className="relative bg-white rounded-xl w-full max-w-lg p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedProduct?.isReviewed ? "Chỉnh sửa đánh giá" : "Đánh giá sản phẩm"}
                  </h3>
                  <button
                    onClick={() => {
                      setIsRatingModalOpen(false);
                      setConfirmSubmit(false);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg
                      className="h-6 w-6"
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
                </div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <img
                      src={selectedProduct?.productImage}
                      alt={selectedProduct?.productName}
                      className="w-24 h-24 rounded-lg object-cover border border-gray-200"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{selectedProduct?.productName}</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {selectedProduct?.isReviewed ? "Bạn đã đánh giá sản phẩm này" : "Hãy chia sẻ trải nghiệm của bạn"}
                      </p>
                    </div>
                  </div>

                  {selectedProduct?.isReviewed && (
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Đánh giá hiện tại</h4>
                      <div className="flex items-center mb-3">
                        {[...Array(5)].map((_, index) => (
                          <svg
                            key={index}
                            className={`w-5 h-5 ${
                              index < (selectedProduct.reviewRating || 0) ? "text-yellow-400" : "text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">
                        {selectedProduct.reviewContent || "Không có nhận xét"}
                      </p>
                      {!selectedProduct.isReviewEditable && (
                        <p className="mt-3 text-sm text-gray-500 italic">
                          Đánh giá không thể chỉnh sửa sau 7 ngày kể từ khi gửi.
                        </p>
                      )}
                    </div>
                  )}

                  <form onSubmit={handleSubmit(onSubmitRating)} className="space-y-6">
                    <input type="hidden" {...register("orderItemId")} />
                    <input type="hidden" {...register("id")} />

                    <div className="flex flex-col items-center">
                      <div className="flex items-center space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => selectedProduct?.isReviewEditable && setValue("rating", star)}
                            className={`p-1 transition-all duration-150 hover:scale-110 ${
                              selectedProduct?.isReviewEditable ? "" : "cursor-not-allowed opacity-50"
                            }`}
                            disabled={!selectedProduct?.isReviewEditable}
                          >
                            <svg
                              className={`w-8 h-8 ${
                                star <= watch("rating") ? "text-yellow-400" : "text-gray-300"
                              } transition-colors duration-150`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </button>
                        ))}
                      </div>
                      <p className="mt-2 text-base font-medium text-gray-700">
                        {watch("rating") === 5 && "Tuyệt vời!"}
                        {watch("rating") === 4 && "Hài lòng"}
                        {watch("rating") === 3 && "Bình thường"}
                        {watch("rating") === 2 && "Không hài lòng"}
                        {watch("rating") === 1 && "Rất tệ"}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="content"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Nhận xét của bạn
                      </label>
                      <textarea
                        id="content"
                        {...register("content", {
                          required: "Vui lòng nhập nhận xét của bạn",
                          minLength: {
                            value: 10,
                            message: "Nhận xét phải có ít nhất 10 ký tự",
                          },
                        })}
                        className={`w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[100px] ${
                          errors.content ? "border-red-500" : "border-gray-200"
                        } ${!selectedProduct?.isReviewEditable ? "bg-gray-100 cursor-not-allowed" : ""}`}
                        placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                        rows="4"
                        disabled={!selectedProduct?.isReviewEditable}
                      ></textarea>
                      {errors.content && (
                        <p className="text-sm text-red-600">{errors.content.message}</p>
                      )}
                    </div>

                    {confirmSubmit && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-sm text-yellow-800">
                          Bạn có chắc muốn {selectedProduct?.isReviewed ? "cập nhật" : "gửi"} đánh giá này?
                        </p>
                        <div className="mt-3 flex justify-end space-x-3">
                          <button
                            type="button"
                            onClick={() => setConfirmSubmit(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                          >
                            Hủy
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                          >
                            Xác nhận
                          </button>
                        </div>
                      </div>
                    )}

                    {!confirmSubmit && (
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => {
                            setIsRatingModalOpen(false);
                            setConfirmSubmit(false);
                          }}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Đóng
                        </button>
                        {selectedProduct?.isReviewEditable && (
                          <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            {selectedProduct?.isReviewed ? "Cập nhật đánh giá" : "Gửi đánh giá"}
                          </button>
                        )}
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default OrderDetail;