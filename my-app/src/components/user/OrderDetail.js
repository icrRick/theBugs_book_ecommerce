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
  const navigate = useNavigate();
  const [hasShowToast, setHasShowToast] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
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
    },
  });

  const handleNavigate = () => {
    navigate(-1);
  };

  const fetchOrderDetails = async (orderId) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/user/order/${orderId}`);
      if (!response.data.status) {
        showErrorToast(
          response.data.message || "Không thể tải chi tiết đơn hàng"
        );
      }
      setItem(response.data.data);
    } catch (error) {
      showErrorToast(
        error.response?.data?.message ||
          "Đã xảy ra lỗi khi tải chi tiết đơn hàng"
      );
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  };

  useEffect(() => {
    if (
      item &&
      item.orderStatusName === "Đã duyệt" &&
      item.noted &&
      !hasShowToast
    ) {
      showSuccessToast(item.noted);
      setHasShowToast(true);
    }
  }, [item, hasShowToast]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) {
      fetchOrderDetails(id);
    }
  }, [id]);

  const handleOpenRatingModal = (product) => {
    setSelectedProduct(product);
    setIsRatingModalOpen(true);
    setValue("orderItemId", product.orderItemId);
    reset({
      rating: 5,
      content: "",
      orderItemId: product.orderItemId,
    });
  };

  const onSubmitRating = async (data) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/user/review/create", data);

      if (response.data.status) {
        showSuccessToast("Đánh giá sản phẩm thành công");
        setIsRatingModalOpen(false);
        fetchOrderDetails(id);
      } else {
        showErrorToast(response.data.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      showErrorToast(
        error.response?.data?.message || "Có lỗi khi gửi đánh giá"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!loading && item === null && <Loading />) {
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
                statusConfig[item?.orderStatusName]?.color ||
                "bg-gray-100 text-gray-800 border-gray-200"
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
              <span className="font-medium">
                {item?.orderStatusName || "Không xác định"}
              </span>
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
                  <p className="text-sm text-gray-700 break-words max-w-[200px]">
                    {item?.fullName}
                  </p>
                  <p className="text-sm text-gray-700 break-words max-w-[200px]">
                    {item?.phone}
                  </p>
                  <p className="text-sm text-gray-700 break-words max-w-[300px]">
                    {item?.address}
                  </p>
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
                  <p className="text-sm text-gray-700">
                    Phương thức: Giao hàng nhanh
                  </p>
                  <p className="text-sm text-gray-700">
                    Phí vận chuyển: {formatCurrency(item?.shippingFee)}
                  </p>
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
                  <p className="text-sm text-gray-700">
                    Phương thức: {item?.paymentMethod}
                  </p>
                  <p className="text-sm text-gray-700">
                    Trạng thái: {item?.paymentStatus}
                  </p>
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
                      <tr key={product?.productId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-16 w-16">
                              <img
                                className="h-16 w-16 rounded-lg object-cover"
                                src={product?.productImage}
                                alt={product?.productName}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {product?.productName}
                              </div>
                              <div className="text-xs text-gray-500">
                                Tác giả: {product?.productAuthor}
                              </div>
                              <div className="text-xs text-gray-500">
                                Thể loại: {product?.productGenres}
                              </div>
                              <div className="text-xs text-gray-500">
                                Nhà xuất bản: {product?.productPublisher}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-sm text-gray-900">
                            {product?.quantityProduct}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm text-gray-900">
                            {formatCurrency(product?.priceProduct)}
                          </div>
                          <div className="text-sm text-gray-900 line-through">
                            {formatCurrency(product?.oldPriceProduct)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm text-gray-900">
                            {formatCurrency(product?.totalPriceProduct)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {item?.orderStatusName === "Đã nhận" ? (
                            product?.reviewed === true ? (
                              <span className="inline-flex items-center text-sm font-medium text-green-600">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 mr-1"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                Đã đánh giá
                              </span>
                            ) : (
                              <button
                                onClick={() => handleOpenRatingModal(product)}
                                className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                              >
                                Đánh giá
                              </button>
                            )
                          ) : (
                            <span className="text-sm font-medium text-gray-500">
                              Chưa thể đánh giá
                            </span>
                          )}
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
                <span>Giảm giá khuyến mãi:</span>
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
          <div className="fixed inset-0 z-40 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div className="fixed inset-0 bg-black opacity-30"></div>
              <div className="relative bg-white rounded-lg w-full max-w-md p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Đánh giá sản phẩm
                  </h3>
                  <button
                    onClick={() => setIsRatingModalOpen(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
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
                  <div className="flex items-center space-x-3">
                    <img
                      src={selectedProduct?.productImage}
                      alt={selectedProduct?.productName}
                      className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {selectedProduct?.productName}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        Hãy chia sẻ đánh giá của bạn
                      </p>
                    </div>
                  </div>

                  <form
                    onSubmit={handleSubmit(onSubmitRating)}
                    className="space-y-6"
                  >
                    <input type="hidden" {...register("orderItemId")} />

                    <div className="flex flex-col items-center">
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setValue("rating", star)}
                            className="p-1 transition-all duration-150 hover:scale-110"
                          >
                            <svg
                              className={`w-10 h-10 ${
                                star <= watch("rating")
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              } transition-colors duration-150`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81 .588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </button>
                        ))}
                      </div>
                      <p className="mt-2 text-lg font-medium text-gray-700">
                        {watch("rating") === 5 && "Tuyệt vời!"}
                        {watch("rating") === 4 && "Hài lòng"}
                        {watch("rating") === 3 && "Bình thường"}
                        {watch("rating") === 2 && "Không hài lòng"}
                        {watch("rating") === 1 && "Rất tệ"}
                      </p>
                    </div>

                    <div className="space-y-3">
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
                            value: 3,
                            message: "Nhận xét phải có ít nhất 3 ký tự",
                          },
                        })}
                        className={`w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[120px] ${
                          errors.content ? "border-red-500" : "border-gray-200"
                        }`}
                        placeholder="Chia sẻ những điều bạn thích về sản phẩm này..."
                        rows="4"
                      ></textarea>
                      {errors.content && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.content.message}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setIsRatingModalOpen(false)}
                        className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      >
                        Gửi đánh giá
                      </button>
                    </div>
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
