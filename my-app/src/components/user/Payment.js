import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import { cookie, getAddressId, getListVoucherIds, getQuantity, getQuantityByNow, removeListProductIds, removeListVoucherIds, setListOrderId } from '../../utils/cookie'
import { calculateShippingFree } from "../../utils/ShippingFree"
import axiosInstance from "../../utils/axiosInstance"
import axios from "axios"
import { showErrorToast } from "../../utils/Toast"
import { formatCurrency } from "../../utils/Format"
import { s_getCartItems } from "../service/cartItemService"
import { useAuth } from "../../contexts/AuthContext"

const Payment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { setCartCount } = useAuth();
    const { getListProductIds, getListVoucherIds } = cookie();
    const [shops, setShops] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState("Thanh toán tiền mặt khi nhận hàng");
    const [showVoucherModal, setShowVoucherModal] = useState(false);
    const [selectedShopId, setSelectedShopId] = useState(null);
    const [shippingFees, setShippingFees] = useState({});
    const [customerInfo, setCustomerInfo] = useState({
        fullName: "",
        phone: "",
        address: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const token = 'f248ba4d-d70a-11ef-881c-b25c083cd867';


    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await axios.get(
                    'https://online-gateway.ghn.vn/shiip/public-api/master-data/province',
                    { headers: { 'Token': token } }
                );
                setProvinces(response.data.data);
            } catch (error) {
                console.error("Error fetching provinces:", error);
            }
        };
        fetchProvinces();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (!customerInfo.provinceId) return;

            try {
                // Fetch districts
                const districtResponse = await axios.get(
                    `https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${customerInfo.provinceId}`,
                    { headers: { 'Token': token } }
                );
                setDistricts(districtResponse.data.data);

                // Fetch wards if districtId exists
                if (customerInfo.districtId) {
                    const wardResponse = await axios.get(
                        `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${customerInfo.districtId}`,
                        { headers: { 'Token': token } }
                    );
                    setWards(wardResponse.data.data);
                }
            } catch (error) {
                console.error("Error fetching address data:", error);
            }
        };

        fetchData();
    }, [customerInfo.provinceId, customerInfo.districtId]);

    const getProvinceName = (provinceId) => {
        const province = provinces.find(p => p.ProvinceID === provinceId);
        return province ? province.ProvinceName : '';
    };

    const getDistrictName = (districtId) => {
        const district = districts.find(d => d.DistrictID === districtId);
        return district ? district.DistrictName : '';
    };

    const getWardName = (wardId) => {
        const ward = wards.find(w => w.WardCode === wardId);
        return ward ? ward.WardName : '';
    };

    useEffect(() => {
        const addressId = getAddressId();
        if (addressId) {
            axiosInstance.get(`/user/address/default?addressId=${addressId}`)
                .then((response) => {
                    const data = response.data.data;
                    if (data) {
                        const provinceName = getProvinceName(data.provinceId);
                        const districtName = getDistrictName(data.districtId);
                        const wardName = getWardName(data.wardId);

                        setCustomerInfo({
                            fullName: data.fullName || "",
                            phone: data.phone || "",
                            address: `${data.street || ""}, ${wardName}, ${districtName}, ${provinceName}`,
                            provinceId: data.provinceId,
                            districtId: data.districtId,
                            wardId: data.wardId
                        });
                    }
                })
                .catch((error) => {
                    console.error("Error fetching address:", error);
                });
        }
    }, [provinces, districts, wards]);



    const fetchCartData = async () => {
        setIsLoading(true);

        const productIdsStr = getListProductIds();
        const voucherIdsStr = getListVoucherIds();
        if (!productIdsStr || !voucherIdsStr) {
            navigate('/cart');
            return;
        }

        const productIds = JSON.parse(productIdsStr);
        const voucherIds = JSON.parse(voucherIdsStr);

        if (productIds.length === 0 && voucherIds.length === 0) {
            navigate('/cart');
            return;
        }
        // Lấy quantity từ state nếu có nêu không thì là 0
        const quantity = getQuantityByNow() || 0;
        const requestBody = {
            productIntegers: productIds,
          
            voucherIntegers: voucherIds,
            productQuantity: quantity, 
        };

        try {
            const response = await axiosInstance.post("/user/payment/list", requestBody);

            if (response.status === 200 && response.data.status === true) {
                setShops(response.data.data);
            } else {
                showErrorToast(response.data.message || "Có lỗi xảy ra khi tải dữ liệu giỏ hàng");
            }
        } catch (error) {
            showErrorToast(error.response?.data?.message || "Không thể kết nối ến máy chủ");
            console.error("Error fetching cart data:", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchCartData();
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

    const getSelectedVoucherForShop = (shopId) => {
        const shop = shops.find(s => s.shopId === shopId);
        if (!shop || !shop.voucherSelected || shop.voucherSelected.length === 0) {
            return null;
        }

        const selectedVoucherId = shop.voucherSelected[0].id;
        const voucher = shop.vouchers.find(v => v.id === selectedVoucherId);
        return voucher || null;
    };

    const handleSelectVoucher = (shopId, voucher) => {
        setShops(prevShops => {
            return prevShops.map(shop => {
                if (shop.shopId === shopId) {
                    return {
                        ...shop,
                        voucherSelected: [{
                            id: voucher.id,
                            codeVoucher: voucher.codeVoucher,
                            discountPercentage: voucher.discountPercentage,
                            minTotalOrder: voucher.minTotalOrder,
                            maxDiscount: voucher.maxDiscount
                        }]
                    };
                }
                return shop;
            });
        });
        setShowVoucherModal(false);
    };

    const handleRemoveVoucher = (shopId) => {
        setShops(prevShops => {
            return prevShops.map(shop => {
                if (shop.shopId === shopId) {
                    return {
                        ...shop,
                        voucherSelected: []
                    };
                }
                return shop;
            });
        });
    };

    const calculateShopTotal = (shop) => {
        return shop.products.reduce((total, product) =>
            total + (product.promotionValue > 0 ? (product.price * (1 - product.promotionValue / 100)) : product.price) * product.productQuantity, 0);
    };

    const calculateVoucherDiscount = (shopTotal, voucher) => {
        if (!voucher || !voucher.discountPercentage || shopTotal < (voucher.minTotalOrder || 0)) return 0;
        const discountAmount = Math.floor((shopTotal * voucher.discountPercentage) / 100);
        return Math.min(discountAmount, voucher.maxDiscount || 0);
    };

    const calculateTotalDiscount = () => {
        return shops.reduce((total, shop) => {
            const shopTotal = calculateShopTotal(shop);
            const voucher = getSelectedVoucherForShop(shop.shopId);
            return total + calculateVoucherDiscount(shopTotal, voucher);
        }, 0);
    }

    const calculateTotalShipping = () => {
        return shops.reduce((total, shop) => total + (shippingFees[shop.shopId] || 0), 0);
    };

    const calculateFinalTotal = () => {
        return shops.reduce((total, shop) => {
            const shopTotal = calculateShopTotal(shop);
            const voucher = getSelectedVoucherForShop(shop.shopId);
            const voucherDiscount = calculateVoucherDiscount(shopTotal, voucher);
            return total + shopTotal + (shippingFees[shop.shopId] || 0) - voucherDiscount;
        }, 0);
    };

    // Thêm hàm tính tổng giá gốc (không bao gồm khuyến mãi)
    const calculateOriginalShopTotal = (shop) => {
        return shop.products.reduce((total, product) =>
            total + product.price * product.productQuantity, 0);
    };

    const calculateTotalOriginalPrice = () => {
        return shops.reduce((total, shop) => total + calculateOriginalShopTotal(shop), 0);
    };

    // Thêm hàm tính giảm giá trực tiếp từ khuyến mãi của sản phẩm
    const calculatePromotionDiscount = () => {
        return shops.reduce((total, shop) => {
            return total + shop.products.reduce((shopTotal, product) => {
                if (product.promotionValue > 0) {
                    return shopTotal + (product.price * product.promotionValue / 100 * product.productQuantity);
                }
                return shopTotal;
            }, 0);
        }, 0);
    };

    const handlePayment = async () => {
        try {
            const responseData = shops.map(shop => {
                return {
                    shopId: shop.shopId,
                    voucherId: shop.voucherSelected && shop.voucherSelected.length > 0 ? shop.voucherSelected[0].id : null,
                    shippingFee: shippingFees[shop.shopId] || 0,
                    paymentMethod: paymentMethod,
                    customerInfo: customerInfo.fullName + " - " + customerInfo.phone + " - " + customerInfo.address,
                    cartItems: shop.products.map(product => ({
                        productId: product.id,
                        olPrice: product.price,
                        price: product.promotionValue > 0 ? (product.price * (1 - product.promotionValue / 100)) : product.price,
                        quantity: product.productQuantity,
                    })),
                };
            });

            if (responseData.length < 0) {
                navigate('/cart');
                return;
            }

            console.log("Gửi yêu cầu thanh toán với dữ liệu:", responseData);
            const responseCreateOrder = await axiosInstance.post("/user/payment/payment-ordered", responseData);
            if (responseCreateOrder.status === 200) {
                console.log("responseCreateOrder.data.data", responseCreateOrder.data.data);
                const responseCartItems = await s_getCartItems();
                setCartCount(responseCartItems.reduce((acc, shop) => acc + shop.products.length, 0));
                const arrayOrderIds = responseCreateOrder.data.data; // Ví dụ: [25, 26]
                setListOrderId(JSON.stringify(arrayOrderIds));
                if (paymentMethod === "Thanh toán chuyển khoản ngân hàng") {
                    try {
                        const orderId = Math.floor(new Date().getTime() / 1000) + 10;
                        const total = calculateFinalTotal();

                        if (!total || isNaN(total) || total <= 0) {
                            showErrorToast("Số tiền thanh toán không hợp lệ. Vui lòng kiểm tra lại giỏ hàng.");
                            setIsLoading(false);
                            return;
                        }

                        if (!customerInfo?.fullName || !customerInfo?.phone || !customerInfo?.address) {
                            showErrorToast("Vui lòng kiểm tra lại thông tin giao hàng.");
                            setIsLoading(false);
                            return;
                        }

                        const paymentData = {
                            orderId: Number(orderId),
                            orderInfor: "Thanh toan don hang " + orderId,
                            total: Number(total),
                        };

                        console.log("Gửi yêu cầu thanh toán với dữ liệu:", paymentData);

                        const responseVnpay = await axiosInstance.get("/user/payment-online/create-payment", {
                            params: paymentData
                        });

                        console.log("Kết quả từ API VNPAY:", responseVnpay.data);

                        if (responseVnpay.status === 200 && responseVnpay.data?.status === true) {
                            window.location.href = responseVnpay.data.data;
                        } else {
                            let errorMessage = "ã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại sau hoặc liên hệ bộ phận hỗ trợ.";

                            if (responseVnpay.data?.code === 76) {
                                errorMessage = "Vui lòng chọn ngân hàng khác ể thanh toán hoặc liên hệ bộ phận hỗ trợ.";
                                showErrorToast(errorMessage);
                                return;
                            } else if (responseVnpay.data?.code === 3) {
                                errorMessage = "Định dạng dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin thanh toán hoặc liên hệ bộ phận hỗ trợ.";
                            } else if (responseVnpay.data?.message) {
                                errorMessage = responseVnpay.data.message;
                            }

                            showErrorToast(errorMessage);
                            setPaymentMethod("Thanh toán tiền mặt khi nhận hàng");
                        }
                    } catch (error) {
                        console.error("Lỗi khi gọi API VNPay:", error);
                        let errorMessage = "Đã có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại sau hoặc liên hệ bộ phận hỗ trợ.";

                        if (error.responseVnpay?.data?.code === 3) {
                            errorMessage = "Định dạng dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin thanh toán hoặc liên hệ bộ phận hỗ trợ.";
                        } else if (error.responseVnpay?.data?.message) {
                            errorMessage = error.responseVnpay.data.message;
                        } else if (error.message) {
                            errorMessage = error.message;
                        }

                        showErrorToast(errorMessage);
                    } finally {
                        setIsLoading(false);
                    }
                    removeListProductIds();
                    removeListVoucherIds();
                } else {
                    navigate("/payment-cod");
                    removeListProductIds();
                    removeListVoucherIds();
                }
              
            }
        } catch (error) {
            console.error("Lỗi khi đặt hàng:", error.response.data.message);
            showErrorToast("Đã có lỗi xảy ra khi đặt hàng. Vui lòng thử lại sau." , error.response.data.message);
        } finally {
            setIsLoading(false);
        }
    };



    const handleBack = () => {
        removeListProductIds();
        removeListVoucherIds();
        navigate('/cart');
    }

    return (
        <div className="w-full">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Thanh toán</h2>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
                <div className="lg:col-span-8 space-y-4 sm:space-y-6 mb-4">
                    {shops.map((shop) => (
                        <div key={shop.shopId} className="border-b bg-white mb-4 overflow-hidden">
                            <div className="p-3 sm:p-4 border-b border-gray-200 bg-gray-50">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                    <h3 className="text-base sm:text-lg font-semibold text-gray-700">{shop.shopName}</h3>
                                    <div className="flex items-center space-x-2 sm:space-x-4 bg-white px-2 sm:px-3 py-1 rounded-full border border-gray-200">
                                        <span className="text-xs sm:text-sm text-gray-600">Phí vận chuyển</span>
                                        <span className="text-xs sm:text-sm font-medium text-red-600">
                                            {formatCurrency(shippingFees[shop.shopId] || 0)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="divide-y divide-gray-200">
                                {shop.products.map((product) => (
                                    <div key={product.id} className="p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                            <div className="flex items-start sm:items-center space-x-3 sm:space-x-4">
                                                <img
                                                    src={product.image || "/placeholder.svg"}
                                                    alt={product.name}
                                                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg shadow-sm"
                                                />
                                                <div className="space-y-1 sm:space-y-2">
                                                    <h4 className="font-medium text-gray-900">
                                                        {product.name}
                                                        <p className="text-xs sm:text-sm text-gray-600">
                                                            {product.productQuantity} x    {
                                                                product.promotionValue > 0 ? (
                                                                    <>
                                                                        <span className="text-red-600 font-medium">{formatCurrency(product.price * (1 - product.promotionValue / 100))}</span>
                                                                        <span className="text-gray-400 line-through ml-2">{formatCurrency(product.price)}</span>

                                                                    </>
                                                                ) : (
                                                                    <span className="text-red-600 font-medium">{formatCurrency(product.price)}</span>
                                                                )
                                                            }
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
                                            <p className="font-semibold text-red-600 text-sm sm:text-base">
                                                {
                                                    product.promotionValue > 0 ? (
                                                        <span className="text-red-600 font-medium">{formatCurrency(product.productQuantity * product.price * (1 - product.promotionValue / 100))}</span>
                                                    ) : (
                                                        <span className="text-red-600 font-medium">{formatCurrency(product.productQuantity * product.price)}</span>
                                                    )
                                                }
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-3 sm:p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                                <div className="flex flex-col space-y-3 sm:space-y-4">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <button
                                            onClick={() => {
                                                setSelectedShopId(shop.shopId);
                                                setShowVoucherModal(true);
                                            }}
                                            className="flex items-center space-x-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-colors duration-200 text-xs sm:text-sm text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                                                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                                            </svg>
                                            <span>{getSelectedVoucherForShop(shop.shopId) ? 'Đổi mã khác' : 'Chọn mã giảm giá'}</span>
                                        </button>
                                        {getSelectedVoucherForShop(shop.shopId) && (
                                            <div className="flex items-center space-x-2 text-blue-600 bg-blue-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
                                                <span className="text-xs sm:text-sm font-medium">
                                                    Mã: {getSelectedVoucherForShop(shop.shopId).codeVoucher}
                                                    <span className="text-red-600 font-medium">
                                                        (-{formatCurrency(calculateVoucherDiscount(
                                                            calculateShopTotal(shop),
                                                            getSelectedVoucherForShop(shop.shopId)
                                                        ))})
                                                    </span>
                                                </span>
                                                <button
                                                    onClick={() => handleRemoveVoucher(shop.shopId)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" viewBox="0 0 20 20" fill="currentColor">
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

                <div className="lg:col-span-4 space-y-4 sm:space-y-6">
                    <div className="border-b bg-white mb-4 p-4 sm:p-6">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <h3 className="text-base sm:text-lg font-semibold">Thông tin giao hàng</h3>
                            <button
                                className="text-blue-600 hover:text-blue-800 text-sm sm:text-base"
                                onClick={() => navigate("/place-order-address")}
                            >
                                Thay đổi
                            </button>
                        </div>
                        <div className="space-y-2">
                            <div className="text-xs sm:text-sm">
                                <span className="font-medium">Họ và tên:</span> {customerInfo.fullName || "Chưa có thông tin"}
                            </div>
                            <div className="text-xs sm:text-sm">
                                <span className="font-medium">Số điện thoại:</span> {customerInfo.phone || "Chưa có thông tin"}
                            </div>
                            <div className="text-xs sm:text-sm">
                                <span className="font-medium">Địa chỉ:</span> {customerInfo.address || "Chưa có thông tin"}
                            </div>
                        </div>
                    </div>

                    <div className="border-b bg-white p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Phương thức thanh toán</h3>
                        <div className="space-y-3 sm:space-y-4">
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="cash"
                                    name="paymentMethod"
                                    value="Thanh toán tiền mặt khi nhận hàng"
                                    checked={paymentMethod === "Thanh toán tiền mặt khi nhận hàng"}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="h-3 w-3 sm:h-4 sm:w-4 text-red-600"
                                />
                                <label htmlFor="cash" className="ml-2 text-xs sm:text-sm">Thanh toán tiền mặt khi nhận hàng</label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="bank"
                                    name="paymentMethod"
                                    value="Thanh toán chuyển khoản ngân hàng"
                                    checked={paymentMethod === "Thanh toán chuyển khoản ngân hàng"}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="h-3 w-3 sm:h-4 sm:w-4 text-red-600"
                                />
                                <label htmlFor="bank" className="ml-2 text-xs sm:text-sm">Chuyển khoản ngân hàng</label>
                            </div>
                        </div>
                    </div>

                    <div className="border-b bg-white p-4 sm:p-6">
                        <div className="space-y-2 sm:space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-xs sm:text-sm text-gray-600">Tổng tiền hàng (giá gốc):</span>
                                <span className="text-xs sm:text-sm text-gray-900 font-medium">
                                    {formatCurrency(calculateTotalOriginalPrice())}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs sm:text-sm text-gray-600">Giảm giá khuyến mãi sản phẩm:</span>
                                <span className="text-xs sm:text-sm text-green-600 font-medium">-{formatCurrency(calculatePromotionDiscount())}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs sm:text-sm text-gray-600">Giảm giá voucher:</span>
                                <span className="text-xs sm:text-sm text-green-600 font-medium">-{formatCurrency(calculateTotalDiscount())}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs sm:text-sm text-gray-600">Phí vận chuyển:</span>
                                <span className="text-xs sm:text-sm text-gray-900">{formatCurrency(calculateTotalShipping())}</span>
                            </div>
                            <div className="border-t border-gray-200 pt-2 sm:pt-3 mt-2 sm:mt-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm sm:text-lg font-medium">Tổng thanh toán:</span>
                                    <span className="text-base sm:text-2xl font-bold text-red-600">
                                        {formatCurrency(calculateFinalTotal())}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-6">
                            <button
                                onClick={handleBack}
                                disabled={isLoading}
                                className="flex-1 bg-gray-200 text-gray-700 py-2 sm:py-3 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 text-sm sm:text-base"
                            >
                                Trở về
                            </button>
                            <button
                                onClick={handlePayment}
                                disabled={isLoading}
                                className="flex-1 bg-red-600 text-white py-2 sm:py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 text-sm sm:text-base"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        đang xử lý...
                                    </div>
                                ) : (
                                    "Xác nhận đặt hàng"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showVoucherModal && selectedShopId && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-3 sm:mb-4">
                            <div className="flex flex-col">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-800">Chọn mã giảm giá</h3>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                    Shop: {shops.find(shop => shop.shopId === selectedShopId)?.shopName}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowVoucherModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-3 sm:mb-4">
                                <div className="flex justify-between items-center text-xs sm:text-sm">
                                    <span className="text-gray-600">Tổng tiền ơn hàng:</span>
                                    <span className="text-gray-900 font-medium">
                                        {formatCurrency(calculateShopTotal(shops.find(shop => shop.shopId === selectedShopId)))}
                                    </span>
                                </div>
                            </div>
                            {(() => {
                                const selectedShop = shops.find(shop => shop.shopId === selectedShopId);
                                const shopVouchers = Array.isArray(selectedShop?.vouchers) ? selectedShop.vouchers : [];

                                if (shopVouchers.length === 0) {
                                    return (
                                        <div className="text-center py-3 sm:py-4 text-gray-500 text-sm">
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
                                            className={`border rounded-lg p-2 sm:p-3 transition-all duration-200 hover:shadow-md ${isValidTotal
                                                ? "hover:border-blue-500 cursor-pointer hover:bg-blue-50"
                                                : "border-gray-200 bg-gray-50 opacity-75"
                                                }`}
                                            onClick={() => isValidTotal && handleSelectVoucher(selectedShopId, voucher)}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-semibold text-blue-600 text-sm sm:text-base">{voucher.codeVoucher}</h4>
                                                    <div className="text-xs space-y-1 mt-1">
                                                        <p className="text-gray-600">
                                                            Giảm {voucher.discountPercentage}% tối a {formatCurrency(voucher.maxDiscount)}
                                                        </p>
                                                        {isValidTotal ? (
                                                            <div className="text-green-600 space-y-1">
                                                                <p>Giảm {voucher.discountPercentage}% = {formatCurrency(discountAmount)}</p>
                                                                {discountAmount > voucher.maxDiscount && (
                                                                    <p>→ Áp dụng giảm tối đa: {formatCurrency(finalDiscount)}</p>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <p className="text-red-500">
                                                                đơn hàng tối thiểu {formatCurrency(voucher.minTotalOrder)}
                                                                <br />
                                                                Cần mua thêm {formatCurrency(voucher.minTotalOrder - shopTotal)}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right text-xs text-gray-500">
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

