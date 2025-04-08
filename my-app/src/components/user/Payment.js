"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import SelectedAddress from "./SelectedAddress"
import { cookie, getAddress } from '../../utils/cookie'
import { calculateShippingFree } from "../../utils/ShippingFree"
import CustomerInfo from "./CustomerInfo"
import axiosInstance from "../../utils/axiosInstance"

const Payment = () => {
    const navigate = useNavigate();
    const { getCartByUser, setCartByUser } = cookie();
    const [shops, setShops] = useState([]);
    const [selectedVouchers, setSelectedVouchers] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState("Thanh toán tiền mặt khi nhận hàng");
    const [showVoucherModal, setShowVoucherModal] = useState(false);
    const [selectedShopId, setSelectedShopId] = useState(null);
    const [shippingFees, setShippingFees] = useState({});
    const [customerAddress, setCustomerAddress] = useState("");

    useEffect(() => {
        try {
            const savedCartData = getCartByUser();
            if (savedCartData) {
                const cartData = JSON.parse(savedCartData);
                console.log('Cart Data loaded:', cartData);

                if (cartData.shops && Array.isArray(cartData.shops)) {
                    setShops(cartData.shops);

                    // Khởi tạo selectedVouchers từ selectedVoucher của mỗi shop
                    const initialSelectedVouchers = cartData.shops
                        .filter(shop => shop.selectedVoucher)
                        .map(shop => ({
                            shopId: shop.shopId,
                            voucher: shop.selectedVoucher
                        }));

                    setSelectedVouchers(initialSelectedVouchers);
                } else {
                    console.error('Invalid cart data format');
                    navigate('/cart');
                }
            } else {
                console.error('No cart data found');
                navigate('/cart');
            }
        } catch (error) {
            console.error('Error loading cart data:', error);
            navigate('/cart');
        }
    }, []);

    useEffect(() => {
        const loadShippingFees = async () => {
            const fees = {};
            for (const shop of shops) {
                const fee = await calculateShippingFree(shop);
                fees[shop.shopId] = fee;
            }
            setShippingFees(fees);
        };

        if (shops.length > 0) {
            loadShippingFees();
        }
    }, [shops]);

    const handleSelectVoucher = (shopId, voucher) => {
        console.log('Selecting voucher for shop:', shopId, voucher);

        // Cập nhật selectedVoucher trong shops
        const updatedShops = shops.map(shop => {
            if (shop.shopId === shopId) {
                return {
                    ...shop,
                    selectedVoucher: voucher
                };
            }
            return shop;
        });
        setShops(updatedShops);

        // Cập nhật selectedVouchers state
        const newVouchers = [...selectedVouchers];
        const existingIndex = newVouchers.findIndex(v => v.shopId === shopId);
        if (existingIndex !== -1) {
            newVouchers[existingIndex] = { shopId, voucher };
        } else {
            newVouchers.push({ shopId, voucher });
        }
        setSelectedVouchers(newVouchers);

        // Cập nhật cookie
        const savedCartData = getCartByUser();
        if (savedCartData) {
            const cartData = JSON.parse(savedCartData);
            const updatedCartData = {
                ...cartData,
                shops: updatedShops
            };
            setCartByUser(JSON.stringify(updatedCartData));
        }

        setShowVoucherModal(false);
    };

    const handleRemoveVoucher = (shopId) => {
        console.log('Removing voucher for shop:', shopId);

        // Cập nhật selectedVoucher trong shops
        const updatedShops = shops.map(shop => {
            if (shop.shopId === shopId) {
                return {
                    ...shop,
                    selectedVoucher: null
                };
            }
            return shop;
        });
        setShops(updatedShops);

        // Cập nhật selectedVouchers state
        const newVouchers = selectedVouchers.filter(v => v.shopId !== shopId);
        setSelectedVouchers(newVouchers);

        // Cập nhật cookie
        const savedCartData = getCartByUser();
        if (savedCartData) {
            const cartData = JSON.parse(savedCartData);
            const updatedCartData = {
                ...cartData,
                shops: updatedShops
            };
            setCartByUser(JSON.stringify(updatedCartData));
        }
    };

    const calculateShopTotal = (shop) => {
        return shop.products.reduce((total, product) =>
            total + (product.productPrice * product.productQuantity), 0);
    };

    const calculateVoucherDiscount = (shopTotal, voucher) => {
        if (!voucher || !voucher.discountPercentage || shopTotal < (voucher.minTotalOrder || 0)) return 0;
        const discountAmount = Math.floor((shopTotal * voucher.discountPercentage) / 100);
        return Math.min(discountAmount, voucher.maxDiscount || 0);
    };

    const formatCurrency = (amount) => {
        return amount.toLocaleString('vi-VN');
    };

    const calculateTotalDiscount = () => {
        return shops.reduce((total, shop) => {
            const shopTotal = calculateShopTotal(shop);
            const voucher = selectedVouchers.find(v => v.shopId === shop.shopId)?.voucher;
            return total + calculateVoucherDiscount(shopTotal, voucher);
        }, 0);
    }

    const calculateTotalShipping = () => {
        return shops.reduce((total, shop) => total + (shippingFees[shop.shopId] || 0), 0);
    };

    const calculateFinalTotal = () => {
        return shops.reduce((total, shop) =>
            total + calculateShopTotal(shop) + (shippingFees[shop.shopId] || 0), 0) - calculateTotalDiscount();
    };

    const handlePayment = async () => {
      const responseData = shops.map(shop => {
        return {
          shopId: shop.shopId,
          voucherId: shop.selectedVoucher?.id || null,
          shippingFee: shippingFees[shop.shopId] || 0,
          paymentMethod: paymentMethod,
          customerInfo: customerAddress,
          cartItems: shop.products.map(product => ({
            productId: product.productId,
            price: product.productPromotionValue > 0 ? (product.productPrice *(1-product.productPromotionValue/100)): product.productPrice,
            quantity: product.productQuantity,
          })),
        };
      });

      if(responseData.length > 0){
        const response = await axiosInstance.post("/user/payment/payment-ordered", responseData);
        if(response.status === 200){
         
          navigate('/home');
        }else{
          console.log("lỗi");
        }
      }

      console.log(JSON.stringify(responseData, null, 2));
    }

    const handleBack = () => {
        navigate('/cart');
    }

    // Sửa lại hàm getSelectedVoucherForShop
    const getSelectedVoucherForShop = (shopId) => {
        const shop = shops.find(s => s.shopId === shopId);
        return shop?.selectedVoucher || null;
    };

    return (
        <div className="container mx-auto">
            <h2 className="text-2xl font-bold mb-6">Thanh toán</h2>

            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-8 space-y-6">
                    {shops.map((shop) => (
                        <div key={shop.shopId} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="p-4 border-b border-gray-200 bg-gray-50">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-gray-700">{shop.shopName}</h3>
                                    <div className="flex items-center space-x-4 bg-white px-3 py-1 rounded-full border border-gray-200">
                                        <span className="text-sm text-gray-600">Phí vận chuyển</span>
                                        <span className="text-sm font-medium text-red-600">
                                            {shippingFees[shop.shopId]?.toLocaleString() || '0'}đ
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="divide-y divide-gray-200">
                                {shop.products.map((product) => (
                                    <div key={product.productId} className="p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <img
                                                    src={product.productImage || "/placeholder.svg"}
                                                    alt={product.productName}
                                                    className="w-20 h-20 object-cover rounded-lg shadow-sm"
                                                />
                                                <div className="space-y-2">
                                                    <h4 className="font-medium text-gray-900">
                                                        {product.productName}
                                                        <p className="text-sm text-gray-600">
                                                            {product.productQuantity} x {product.productPrice.toLocaleString()}đ
                                                        </p>
                                                    </h4>
                                                   
                                                    <div className="flex flex-col space-y-1">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-xs font-medium text-gray-500">Thể loại:</span>
                                                            {product?.genres?.length > 0 ? (
                                                                <span className="text-xs text-gray-600">
                                                                    {product.genres.map(genre => genre.name).join(', ')}
                                                                </span>
                                                            ) : (
                                                                <span className="text-xs text-gray-400 italic">Chưa có thể loại</span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-xs font-medium text-gray-500">Tác giả:</span>
                                                            {product?.authors?.length > 0 ? (
                                                                <span className="text-xs text-gray-600">
                                                                    {product.authors.map(author => author.name).join(', ')}
                                                                </span>
                                                            ) : (
                                                                <span className="text-xs text-gray-400 italic">Chưa có tác giả</span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-xs font-medium text-gray-500">Nhà xuất bản:</span>
                                                            <span className="text-xs text-gray-600">
                                                                {product?.publisher?.name || "Chưa có nhà xuất bản"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="font-semibold text-red-600">
                                                {(product.productPrice * product.productQuantity).toLocaleString()}đ
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                                <div className="flex flex-col space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => {
                                                setSelectedShopId(shop.shopId);
                                                setShowVoucherModal(true);
                                            }}
                                            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors duration-200 text-sm text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                                                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                                            </svg>
                                            <span>{getSelectedVoucherForShop(shop.shopId) ? 'Đổi mã khác' : 'Chọn mã giảm giá'}</span>
                                        </button>
                                        {getSelectedVoucherForShop(shop.shopId) && (
                                            <div className="flex items-center space-x-2 text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg">
                                                <span className="text-sm font-medium">
                                                    Mã: {getSelectedVoucherForShop(shop.shopId).codeVoucher}
                                                    <span className="text-red-600 font-medium">
                                                        (-{formatCurrency(calculateVoucherDiscount(
                                                            calculateShopTotal(shop),
                                                            getSelectedVoucherForShop(shop.shopId)
                                                        ))}đ)
                                                    </span>
                                                </span>
                                                <button
                                                    onClick={() => handleRemoveVoucher(shop.shopId)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="col-span-4 space-y-6">
                    <SelectedAddress />
                    <CustomerInfo onAddressChange={setCustomerAddress} />

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold mb-4">Phương thức thanh toán</h3>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="cash"
                                    name="paymentMethod"
                                    value="Thanh toán tiền mặt khi nhận hàng"
                                    checked={paymentMethod === "Thanh toán tiền mặt khi nhận hàng"}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="h-4 w-4 text-red-600"
                                />
                                <label htmlFor="cash" className="ml-2">Thanh toán tiền mặt khi nhận hàng</label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="bank"
                                    name="paymentMethod"
                                    value="Thanh toán chuyển khoản ngân hàng"
                                    checked={paymentMethod === "Thanh toán chuyển khoản ngân hàng"}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="h-4 w-4 text-red-600"
                                />
                                <label htmlFor="bank" className="ml-2">Chuyển khoản ngân hàng</label>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Tổng tiền hàng:</span>
                                <span className="text-gray-900 font-medium">
                                    {shops.reduce((sum, shop) =>
                                        sum + calculateShopTotal(shop), 0).toLocaleString()}đ
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Giảm giá:</span>
                                <span className="text-green-600 font-medium">-{calculateTotalDiscount().toLocaleString()}đ</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Phí vận chuyển:</span>
                                <span className="text-gray-900">{calculateTotalShipping().toLocaleString()}đ</span>
                            </div>
                            <div className="border-t border-gray-200 pt-3 mt-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-medium">Tổng thanh toán:</span>
                                    <span className="text-2xl font-bold text-red-600">
                                        {calculateFinalTotal().toLocaleString()}đ
                                    </span>
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

            {showVoucherModal && selectedShopId && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex flex-col">
                                <h3 className="text-lg font-semibold text-gray-800">Chọn mã giảm giá</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    Shop: {shops.find(shop => shop.shopId === selectedShopId)?.shopName}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowVoucherModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="space-y-3 sm:space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Tổng tiền đơn hàng:</span>
                                    <span className="text-gray-900 font-medium">
                                        {formatCurrency(calculateShopTotal(shops.find(shop => shop.shopId === selectedShopId)))}đ
                                    </span>
                                </div>
                            </div>
                            {(() => {
                                const selectedShop = shops.find(shop => shop.shopId === selectedShopId);
                                const shopVouchers = Array.isArray(selectedShop?.vouchers) ? selectedShop.vouchers : [];

                                if (shopVouchers.length === 0) {
                                    return (
                                        <div className="text-center py-4 text-gray-500">
                                            Không có voucher nào khả dụng
                                        </div>
                                    );
                                }

                                return shopVouchers.map((voucher) => {
                                    const shopTotal = calculateShopTotal(selectedShop);
                                    const discountAmount = Math.floor((shopTotal * voucher.discountPercentage) / 100);
                                    const finalDiscount = Math.min(discountAmount, voucher.maxDiscount);
                                    const isValidTotal = shopTotal >= voucher.minTotalOrder;

                                    return (
                                        <div
                                            key={voucher.id || voucher.codeVoucher}
                                            className={`border rounded-lg p-3 sm:p-4 transition-all duration-200 hover:shadow-md ${isValidTotal
                                                ? "hover:border-blue-500 cursor-pointer hover:bg-blue-50"
                                                : "border-gray-200 bg-gray-50 opacity-75"
                                                }`}
                                            onClick={() => isValidTotal && handleSelectVoucher(selectedShopId, voucher)}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-semibold text-blue-600 text-base sm:text-lg">{voucher.codeVoucher}</h4>
                                                    <div className="text-xs sm:text-sm space-y-1 mt-1">
                                                        <p className="text-gray-600">
                                                            Giảm {voucher.discountPercentage}% tối đa {formatCurrency(voucher.maxDiscount)}đ
                                                        </p>
                                                        {isValidTotal ? (
                                                            <div className="text-green-600 space-y-1">
                                                                <p>Giảm {voucher.discountPercentage}% = {formatCurrency(discountAmount)}đ</p>
                                                                {discountAmount > voucher.maxDiscount && (
                                                                    <p>→ Áp dụng giảm tối đa: {formatCurrency(finalDiscount)}đ</p>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <p className="text-red-500">
                                                                Đơn tối thiểu {formatCurrency(voucher.minTotalOrder)}đ
                                                                <br />
                                                                Cần mua thêm {formatCurrency(voucher.minTotalOrder - shopTotal)}đ
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right text-xs sm:text-sm text-gray-500">
                                                    <p>Còn lại: {voucher.quantity}</p>
                                                    {voucher.expireDate && (
                                                        <p className="mt-1">HSD: {new Date(voucher.expireDate).toLocaleDateString()}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                });
                            })()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Payment

