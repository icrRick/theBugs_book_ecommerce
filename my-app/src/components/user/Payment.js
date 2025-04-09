"use client"

import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"

const Payment = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [selectedProducts, setSelectedProducts] = useState([])
  const [totalAmount, setTotalAmount] = useState(0)
  const [shippingAddress, setShippingAddress] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [selectedVouchers, setSelectedVouchers] = useState([])
  const [showVoucherModal, setShowVoucherModal] = useState(false)
  const [selectedShopId, setSelectedShopId] = useState(null)

  // Dữ liệu mẫu cho voucher
  const vouchers = [
    { id: 1, code: "VOUCHER1", discount: "10%", minSpend: "100.000đ", maxDiscount: "50.000đ" },
    { id: 2, code: "VOUCHER2", discount: "20%", minSpend: "200.000đ", maxDiscount: "100.000đ" },
    { id: 3, code: "VOUCHER3", discount: "30%", minSpend: "300.000đ", maxDiscount: "150.000đ" },
  ]

  useEffect(() => {
    if (location.state?.selectedProducts) {
      setSelectedProducts(location.state.selectedProducts)
      calculateTotal(location.state.selectedProducts)
    }
    if (location.state?.selectedVouchers) {
      setSelectedVouchers(location.state.selectedVouchers)
    }
  }, [location.state])

  const calculateTotal = (products) => {
    const total = products.reduce((sum, product) => {
      const price = Number.parseInt(product.discountPrice.replace(/[^\d]/g, ""))
      return sum + price * product.quantity
    }, 0)
    setTotalAmount(total)
  }

  // Nhóm sản phẩm theo shop
  const groupedProducts = selectedProducts.reduce((acc, product) => {
    const shopId = product.shopId
    if (!acc[shopId]) {
      acc[shopId] = {
        shopId: shopId,
        shopName: product.shopName,
        products: [],
        voucher: null,
        shipFree: false,
        paymentMethod: paymentMethod,
      }
    }
    acc[shopId].products.push(product)
    return acc
  }, {})

  // Thêm voucher vào dữ liệu đã nhóm
  selectedVouchers.forEach((voucher) => {
    if (groupedProducts[voucher.shopId]) {
      groupedProducts[voucher.shopId].voucher = voucher.voucher
    }
  })

  const paymentData = Object.values(groupedProducts).map((shop) => ({
    shopid: shop.shopId,
    shopname: shop.shopName,
    vouchers: shop.voucher ? [shop.voucher] : [],
    products: shop.products,
    shipfree: shop.shipFree,
    paymentmethod: shop.paymentMethod,
  }))

  const handlePayment = () => {
    console.log(paymentData)
  }

  const handleRemoveVoucher = (shopId) => {
    setSelectedVouchers((prevVouchers) => prevVouchers.filter((voucher) => voucher.shopId !== shopId))
  }

  const handleSelectVoucher = (shopId, voucher) => {
    const shop = Object.values(groupedProducts).find((s) => s.shopId === shopId)
    setSelectedVouchers((prevVouchers) => {
      const newVouchers = prevVouchers.filter((v) => v.shopId !== shopId)
      return [
        ...newVouchers,
        {
          shopId,
          shopName: shop.shopName,
          voucher,
        },
      ]
    })
    setShowVoucherModal(false)
  }

  // Save checked product IDs when returning to Cart
  const handleBack = () => {
    try {
      // Save checked products
      const checkedProducts = selectedProducts.map((product) => ({
        id: product.id,
        checked: true,
      }))

      localStorage.setItem("checkedProducts", JSON.stringify(checkedProducts))

      // Save vouchers
      const vouchersToSave = selectedVouchers.map((voucher) => ({
        shopId: voucher.shopId,
        voucher: voucher.voucher,
      }))

      localStorage.setItem("selectedVouchers", JSON.stringify(vouchersToSave))

      // Set flag to indicate returning from Payment
      localStorage.setItem("returningFromPayment", "true")
    } catch (error) {
      console.error("Error saving state to localStorage:", error)
    }

    // Navigate back
    navigate(-1)
  }

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-6">Thanh toán</h2>

      <div className="grid grid-cols-12 gap-6">
        {/* Cột trái - Danh sách sản phẩm theo shop */}
        <div className="col-span-8 space-y-6">
          {Object.values(groupedProducts).map((shop) => (
            <div key={shop.shopId} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-700">{shop.shopName}</h3>
                  </div>
                  <div className="flex items-center space-x-4 bg-white px-3 py-1 rounded-full border border-gray-200">
                    <span className="text-sm text-gray-600">Giao hàng nhanh</span>
                    <span className="text-sm font-medium text-red-600">30.000đ</span>
                  </div>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {shop.products.map((product) => (
                  <div key={product.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-20 h-20 object-cover rounded-lg shadow-sm"
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">{product.name}</h4>
                          <div className="flex items-center space-x-4 mt-1">
                            <p className="text-sm text-gray-600">Số lượng: {product.quantity}</p>
                            <p className="text-sm text-gray-500 line-through">{product.price}</p>
                          </div>
                          <p className="text-red-600 font-semibold mt-1">{product.discountPrice}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-red-600">
                          {(
                            Number.parseInt(product.discountPrice.replace(/[^\d]/g, "")) * product.quantity
                          ).toLocaleString()}
                          đ
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Voucher của shop */}
              {selectedVouchers.find((v) => v.shopId === shop.shopId) ? (
                <div className="p-4 border-t border-gray-200 bg-green-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-green-700 font-medium">
                        {selectedVouchers.find((v) => v.shopId === shop.shopId).voucher.code}
                      </span>
                      <span className="text-sm text-green-600">
                        - Giảm {selectedVouchers.find((v) => v.shopId === shop.shopId).voucher.discount}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedShopId(shop.shopId)
                          setShowVoucherModal(true)
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleRemoveVoucher(shop.shopId)}
                        className="text-green-700 hover:text-green-900"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <button
                    onClick={() => {
                      setSelectedShopId(shop.shopId)
                      setShowVoucherModal(true)
                    }}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                      <path
                        fillRule="evenodd"
                        d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Chọn mã giảm giá</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Cột phải - Thông tin đặt hàng và thanh toán */}
        <div className="col-span-4 space-y-6">
          {/* Thông tin giao hàng */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-semibold">Thông tin giao hàng</div>
              <button className="text-blue-600 hover:text-blue-800">Thay đổi</button>
            </div>
            <div className="space-y-4">
              <div className="text-sm font-medium text-gray-700 mb-1">Họ và tên</div>
              <div className="text-sm font-medium text-gray-700 mb-1">Số điện thoại</div>
              <div className="text-sm font-medium text-gray-700 mb-1">Địa chỉ</div>
            </div>
          </div>

          {/* Phương thức thanh toán */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Phương thức thanh toán</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="cash"
                  name="paymentMethod"
                  value="cash"
                  checked={paymentMethod === "cash"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-4 w-4 text-red-600"
                />
                <label htmlFor="cash" className="ml-2">
                  Thanh toán tiền mặt khi nhận hàng
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="bank"
                  name="paymentMethod"
                  value="bank"
                  checked={paymentMethod === "bank"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-4 w-4 text-red-600"
                />
                <label htmlFor="bank" className="ml-2">
                  Chuyển khoản ngân hàng
                </label>
              </div>
            </div>
          </div>

          {/* Voucher */}
          {selectedVouchers.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Khuyến mãi</h3>
              <div className="space-y-4">
                {selectedVouchers.map((shopVoucher) => (
                  <div
                    key={shopVoucher.shopId}
                    className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-600">{shopVoucher.shopName}</span>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-green-700 font-medium">{shopVoucher.voucher.code}</span>
                        <span className="text-sm text-green-600">- Giảm {shopVoucher.voucher.discount}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Tối thiểu {shopVoucher.voucher.minSpend}</p>
                        <p className="text-sm text-gray-500">Tối đa {shopVoucher.voucher.maxDiscount}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveVoucher(shopVoucher.shopId)}
                        className="text-green-700 hover:text-green-900"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
                {selectedVouchers.length === 0 && (
                  <div className="text-center text-gray-500 py-4">Không có mã giảm giá nào được chọn</div>
                )}
              </div>
            </div>
          )}

          {/* Tổng tiền và nút thanh toán */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tạm tính:</span>
                <span className="text-gray-900">{(totalAmount + 30000).toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Giảm giá:</span>
                <span className="text-green-600">-50.000đ</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Khuyến mãi:</span>
                <span className="text-green-600">-50.000đ</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Phí vận chuyển:</span>
                <span className="text-gray-900">30.000đ</span>
              </div>
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Tổng tiền:</span>
                  <span className="text-2xl font-bold text-red-600">{totalAmount.toLocaleString()}đ</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-4 mt-6">
              <button
                onClick={handleBack}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Trở về
              </button>
              <button
                onClick={handlePayment}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors"
              >
                Xác nhận đặt hàng
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Voucher Modal */}
      {showVoucherModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Chọn mã giảm giá</h3>
              <button onClick={() => setShowVoucherModal(false)} className="text-gray-500 hover:text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              {vouchers.map((voucher) => (
                <div
                  key={voucher.id}
                  className="border rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors duration-200 hover:bg-blue-50"
                  onClick={() => handleSelectVoucher(selectedShopId, voucher)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-blue-600 text-lg">{voucher.code}</h4>
                      <p className="text-sm text-gray-600 mt-1">Giảm {voucher.discount}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Tối thiểu {voucher.minSpend}</p>
                      <p className="text-sm text-gray-500">Tối đa {voucher.maxDiscount}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Payment

