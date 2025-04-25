import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axiosInstance from "../../utils/axiosInstance";

import { formatCurrency } from "../../utils/Format";
import { cookie, getListProductIds, setListProductIds, setListVoucherIds } from '../../utils/cookie'
import { showErrorToast } from "../../utils/Toast";


const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
};

const Cart = () => {
    const navigate = useNavigate();
    const [showVoucherModal, setShowVoucherModal] = useState(false);
    const [selectedShopId, setSelectedShopId] = useState(null);
    const [cart, setCart] = useState([]);

    const [selectedItem, setSelectedItem] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [selectedVouchers, setSelectedVouchers] = useState({});

    const [pendingUpdate, setPendingUpdate] = useState(null);

    // Debounce pendingUpdate với delay 400ms
    const debouncedUpdate = useDebounce(pendingUpdate, 400);


    useEffect(() => {
        if (debouncedUpdate) {
            const { productId, quantity } = debouncedUpdate;
            saveCartItem(productId, quantity);
            setPendingUpdate(null);
        }
    }, [debouncedUpdate]);

    const handleQuantityChange = (productId, quantity) => {
        if (quantity < 1) {
            cart.forEach(shop => {
                shop.products.forEach(product => {
                    if (product.productId === productId) {
                        setSelectedItem(product);
                        setShowDeleteModal(true);
                    }
                });
            });
            return;
        }
        setPendingUpdate({ productId, quantity });
        
    };


    const isAllChecked = cart.length > 0 && cart.some(shop =>
        shop.products.some(product => product.checked)
    );

    const fetchCartItems = async () => {
        try {
            const response = await axiosInstance.get('/user/cart/getCartItems');
            if (response.status === 200 && response.data.status === true) {
                setCart(response.data.data.map(item => ({
                    ...item,
                    checked: false,
                    ...item.products.map(product => ({
                        ...product,
                        checked: false
                    }))
                })));
            } else {
                console.log(response.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const saveCartItem = async (productId, quantity) => {
        try {
            const response = await axiosInstance.post(`/user/cart/saveCartItem?productId=${productId}&quantity=${quantity}`);
            if (response.status === 200 && response.data.status === true) {
                setCart(prevCart => {
                    return prevCart.map(shop => ({
                        ...shop,
                        products: shop.products.map(product => {
                            if (product.productId === productId) {
                                return {
                                    ...product,
                                    productQuantity: quantity
                                };
                            }
                            return product;
                        })
                    }));
                });
            } else {
                console.log(response.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    const deleteCartItem = async (productId) => {
        try {
            const response = await axiosInstance.post(`/user/cart/deleteCartItem?productId=${productId}`)
            if (response.status === 200 && response.data.status === true) {
                setShowDeleteModal(false);
                setSelectedItem(null);
                fetchCartItems();
            } else {
                console.log(response.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleCheckAll = () => {
        const hasCheckedItems = cart.some(shop =>
            shop.checked && shop.products.some(product => product.checked)
        );

        setCart(cart.map(shop => ({
            ...shop,
            checked: !hasCheckedItems,
            products: shop.products.map(product => ({
                ...product,
                checked: !hasCheckedItems
            }))
        })));
    };

    const handleCheckProduct = (shopId, productId) => {
        setCart(cart.map(shop => {
            if (shop.shopId === shopId) {
                const updatedProducts = shop.products.map(product => ({
                    ...product,
                    checked: product.productId === productId ? !product.checked : product.checked
                }));
                const hasCheckedProducts = updatedProducts.some(product => product.checked);
                return {
                    ...shop,
                    checked: hasCheckedProducts,
                    products: updatedProducts
                };
            }
            return {
                ...shop
            };
        }));
    };

    const handleCheckShop = (shopId) => {
        setCart(cart.map(shop => {
            if (shop.shopId === shopId) {
                const newCheckedState = !shop.checked;
                return {
                    ...shop,
                    checked: newCheckedState,
                    products: shop.products.map(product => ({
                        ...product,
                        checked: newCheckedState
                    }))
                };
            }
            return {
                ...shop
            };
        }));
    };

    const calculateShopTotal = (shop) => {
        return shop.products.reduce((total, product) => {
            if (product.productPromotionValue > 0) {
                return total + (product.productPrice * (1 - product.productPromotionValue / 100) * product.productQuantity);
            }
            return total + (product.productPrice * product.productQuantity);
        }, 0);
    };


    const calculateVoucherDiscount = (shopTotal, voucher) => {
        if (!voucher) return 0;
        const discountAmount = Math.floor((shopTotal * voucher.discountPercentage) / 100);
        return Math.min(discountAmount, voucher.maxDiscount);
    };


    const handleSelectVoucher = (shopId, voucher) => {
        setSelectedVouchers(prev => ({
            ...prev,
            [shopId]: voucher
        }));
        setShowVoucherModal(false);
    };

    // Modify the handleRemoveVoucher function to save state immediately
    const handleRemoveVoucher = (shopId) => {
        setSelectedVouchers(prev => {
            const newVouchers = { ...prev };
            delete newVouchers[shopId];
            return newVouchers;
        });
    };
    useEffect(() => {
        fetchCartItems();
    }, []);

    const handlePayment = () => {
        // Lấy tất cả productId đã được checked từ tất cả các shop
        const productIds = cart.flatMap(shop =>
            shop.products
                .filter(product => product.checked)
                .map(product => product.productId)
        );
        console.log("voucher da chon ", selectedVouchers);

        const voucherIds = Object.values(selectedVouchers)
            .filter(voucher => voucher !== null)
            .map(voucher => voucher.id);

        const productIdsArray = productIds.map(id => parseInt(id));
        const voucherIdsArray = voucherIds.map(id => parseInt(id));

        setListProductIds(JSON.stringify(productIdsArray));
        setListVoucherIds(JSON.stringify(voucherIdsArray));
        if (productIdsArray.length === 0) {
            showErrorToast("Vui lòng chọn ít nhất một sản phẩm để thanh toán");
            return;
        }

        navigate('/payment');
    }

    const calculateTotalItems = (cart) => {
        return cart.reduce((count, shop) =>
            count + shop.products.filter(p => p.checked).length, 0
        );
    };

    const calculateShopTotalWithVoucher = (shop, selectedVouchers) => {
        const shopTotalAmount = shop.products.reduce((total, product) => {
            if (product.checked) {
                const price = product.productPromotionValue > 0
                    ? product.productPrice * (1 - product.productPromotionValue / 100)
                    : product.productPrice;
                return total + (price * product.productQuantity);
            }
            return total;
        }, 0);

        const voucherDiscount = calculateVoucherDiscount(shopTotalAmount, selectedVouchers[shop.shopId]);
        return shopTotalAmount - voucherDiscount;
    };

    const calculateTotalAmount = (cart, selectedVouchers) => {
        return cart.reduce((total, shop) =>
            total + calculateShopTotalWithVoucher(shop, selectedVouchers), 0
        );
    };

    return (
        <>
            {cart.length > 0 ? (
                <div className="w-full h-full">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 sm:h-8 sm:w-8 text-red-600 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>
                        Giỏ hàng của bạn
                    </h2>

                    {/* Header của bảng giỏ hàng */}
                    <div className="border-b bg-white mb-4">
                        <div className="flex items-center p-4">
                            <div className="w-8 flex justify-center">
                                <input
                                    type="checkbox"
                                    checked={isAllChecked}
                                    onChange={handleCheckAll}
                                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex-1 pl-2">
                                {
                                    calculateTotalItems(cart) > 0 ? (
                                        <span className="font-medium text-gray-700">Đã chọn {calculateTotalItems(cart)} sản phẩm</span>
                                    ) : (
                                        <span className="font-medium text-gray-700">Chưa có sản phẩm được chọn</span>
                                    )
                                }
                            </div>
                            <div className="w-32 text-center">
                                <span className="font-medium text-gray-700">Số lượng</span>
                            </div>
                            <div className="w-32 text-center">
                                <span className="font-medium text-gray-700">Đơn giá</span>
                            </div>
                            <div className="w-32 text-center">
                                <span className="font-medium text-gray-700">Tổng tiền</span>
                            </div>
                            <div className="w-16 text-center">
                                <span className="font-medium text-gray-700">Xóa</span>
                            </div>
                        </div>
                    </div>

                    {/* Danh sách shop và sản phẩm */}
                    {cart.map((shop) => (
                        <div
                            key={shop.shopId}
                            className="border-b bg-white mb-4"
                        >
                            {/* Header của shop */}
                            <div className="flex items-center p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                                <div className="w-8 flex justify-center">
                                    <input
                                        type="checkbox"
                                        checked={shop.checked}
                                        onChange={() => handleCheckShop(shop.shopId)}
                                        className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                                    />
                                </div>
                                <Link to={`/shop/${shop.shopId}`} className="font-medium text-gray-800 text-sm hover:text-blue-600 transition-colors duration-200 cursor-pointer">{shop.shopName || "Chưa có tên shop"}</Link>
                            </div>

                            {/* Danh sách sản phẩm của shop */}
                            {shop.products.map((product) => (
                                <div key={product.productId} className="flex items-center p-4 border-b border-gray-200">
                                    <div className="w-8 flex justify-center">
                                        <input
                                            type="checkbox"
                                            checked={product.checked}
                                            onChange={() => handleCheckProduct(shop.shopId, product.productId)}
                                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="flex-1 pl-2 flex">
                                        <div className="w-20 h-20 mr-4 relative overflow-hidden group">
                                            <img
                                                src={product.productImage || "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80"}
                                                alt={product.productName || "Chưa có tên sản phẩm"}
                                                className="w-full h-full object-cover rounded-lg transition-transform duration-300"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80";
                                                }}
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300 rounded-lg"></div>
                                        </div>
                                        <div className="flex flex-col">
                                            <h3 className="font-medium text-gray-800 text-sm hover:text-blue-600 transition-colors duration-200 cursor-pointer">{product.productName || "Chưa có tên sản phẩm"}</h3>
                                            <div className="mt-1 space-y-1">
                                                {product?.genres?.length > 0 ? (
                                                    <p className="text-xs text-gray-600 flex items-center">
                                                        <span className="font-medium mr-1">Thể loại:</span>
                                                        <span className="text-gray-500">{product?.genres.map(genre => genre.name).join(', ')}</span>
                                                    </p>
                                                ) : (
                                                    <p className="text-xs text-gray-400 italic flex items-center">
                                                        <span className="font-medium mr-1">Thể loại:</span>
                                                        <span>Chưa có thể loại</span>
                                                    </p>
                                                )}
                                                {product?.authors?.length > 0 ? (
                                                    <p className="text-xs text-gray-600 flex items-center">
                                                        <span className="font-medium mr-1">Tác giả:</span>
                                                        <span className="text-gray-500">{product?.authors.map(author => author.name).join(', ')}</span>
                                                    </p>
                                                ) : (
                                                    <p className="text-xs text-gray-400 italic flex items-center">
                                                        <span className="font-medium mr-1">Tác giả:</span>
                                                        <span>Chưa có tác giả</span>
                                                    </p>
                                                )}
                                                <p className="text-xs text-gray-600 flex items-center">
                                                    <span className="font-medium mr-1">Nhà xuất bản:</span>
                                                    <span className="text-gray-500">{product?.publisher?.name || "Chưa có nhà xuất bản"}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-32 flex justify-center">
                                        <div className="flex items-center">
                                            <button
                                                onClick={() => handleQuantityChange(product.productId, product.productQuantity - 1)}
                                                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l hover:bg-gray-100 transition-colors"
                                            >
                                                -
                                            </button>
                                            <div className="w-10 h-8 flex items-center justify-center border-t border-b border-gray-300">
                                                {product.productQuantity}
                                            </div>
                                            <button
                                                onClick={() => handleQuantityChange(product.productId, product.productQuantity + 1)}
                                                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r hover:bg-gray-100 transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <div className="w-32 flex flex-col items-center">

                                        {
                                            product.productPromotionValue > 0 ? (
                                                <>
                                                    <span className="text-red-600 font-medium">{formatCurrency(product.productPrice * (1 - product.productPromotionValue / 100))}</span>
                                                    <span className="text-gray-400 line-through">{formatCurrency(product.productPrice)}</span>

                                                </>
                                            ) : (
                                                <span className="text-red-600 font-medium">{formatCurrency(product.productPrice)}</span>
                                            )
                                        }


                                    </div>
                                    <div className="w-32 text-center">
                                        {
                                            product.productPromotionValue > 0 ? (
                                                <span className="text-red-600 font-medium">
                                                    {formatCurrency(product.productPrice * (1 - product.productPromotionValue / 100) * product.productQuantity)}
                                                </span>
                                            ) : (
                                                <span className="text-red-600 font-medium">
                                                    {formatCurrency(product.productPrice * product.productQuantity)}
                                                </span>
                                            )
                                        }
                                    </div>
                                    <div className="w-16 flex justify-center">
                                        <button onClick={() => {
                                            setSelectedItem(product);
                                            setShowDeleteModal(true);
                                        }} className="text-gray-500 hover:text-red-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 002 0V8a1 1 0 00-1-1z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* Footer của shop */}
                            <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                                <div className="flex flex-col space-y-4">
                                    {
                                        shop.vouchers.length > 0 && (
                                            <>
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => {
                                                            const currentShop = cart.find(s => s.shopId === shop.shopId);
                                                            const hasCheckedProducts = currentShop.products.some(p => p.checked);
                                                            if (hasCheckedProducts) {
                                                                setSelectedShopId(shop.shopId);
                                                                setShowVoucherModal(true);
                                                            }
                                                        }}
                                                        disabled={!shop.products.some(p => p.checked)}
                                                        className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors duration-200 text-sm ${shop.products.some(p => p.checked)
                                                            ? 'text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100'
                                                            : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                                                            }`}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                                                            <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                                                        </svg>
                                                        <span>{selectedVouchers[shop.shopId] ? 'Đổi mã khác' : 'Chọn mã giảm giá'}</span>
                                                    </button>
                                                    {selectedVouchers[shop.shopId] && (
                                                        <div className="flex items-center space-x-2 text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg">
                                                            <span className="text-sm font-medium">
                                                                Mã: {selectedVouchers[shop.shopId].codeVoucher} <span className="text-red-600 font-medium">(-{formatCurrency(calculateVoucherDiscount(
                                                                    shop.products.reduce((total, product) => total + (product.productPrice * product.productQuantity), 0),
                                                                    selectedVouchers[shop.shopId]
                                                                ))})</span>
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
                                                
                                            </>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Footer của giỏ hàng */}
                    <div className="border-b bg-white my-4 p-4">
                        <div className="flex flex-col mb-4 px-4 sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
                            <div className="flex flex-col items-end">
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm sm:text-base text-gray-600">
                                        Tổng thanh toán ({calculateTotalItems(cart)} sản phẩm):
                                    </span>
                                    <span className="text-lg sm:text-xl font-bold text-red-600">
                                        {formatCurrency(calculateTotalAmount(cart, selectedVouchers))}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col px-4 sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
                            <button
                                onClick={() => navigate('/')}
                                className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm sm:text-base transition-colors duration-200"
                            >
                                Tiếp tục mua sắm
                            </button>
                            <button
                                onClick={handlePayment}
                                className="w-full sm:w-auto px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm sm:text-base transition-colors duration-200 shadow-sm hover:shadow"
                            >
                                Thanh toán
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center py-16 px-4">
                    <div className="relative">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-32 w-32 text-gray-300 mb-6 transform hover:scale-105 transition-transform duration-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-pulse"></div>
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-3">Giỏ hàng của bạn đang trống</h3>
                    <p className="text-gray-500 text-center max-w-md mb-8">Hãy khám phá và thêm những cuốn sách yêu thích vào giỏ hàng của bạn</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                        </svg>
                        <span>Tiếp tục mua sắm</span>
                    </button>
                </div>
            )}

            {/* Voucher Modal */}
            {showVoucherModal && selectedShopId && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex flex-col">
                                <h3 className="text-lg font-semibold text-gray-800">Chọn mã giảm giá</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    Shop: {cart.find(shop => shop.shopId === selectedShopId)?.shopName}
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
                            {/* Hiển thị tổng tiền của shop được chọn */}
                            <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Tổng tiền đơn hàng:</span>
                                    <span className="text-gray-900 font-medium">
                                        {formatCurrency(calculateShopTotal(cart.find(shop => shop.shopId === selectedShopId) || { products: [] }))}
                                    </span>
                                </div>
                            </div>

                            {/* Danh sách voucher */}
                            {cart.find(shop => shop.shopId === selectedShopId)?.vouchers?.map((voucher) => {
                                const selectedShop = cart.find(shop => shop.shopId === selectedShopId);
                                const shopTotal = calculateShopTotal(selectedShop || { products: [] });
                                const discountAmount = Math.floor((shopTotal * voucher.discountPercentage) / 100);
                                const finalDiscount = Math.min(discountAmount, voucher.maxDiscount);
                                const isValidTotal = shopTotal >= voucher.minTotalOrder;

                                return (
                                    <div
                                        key={voucher.id}
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
                                                        Giảm {voucher.discountPercentage}% tối đa {formatCurrency(voucher.maxDiscount)}
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
                                                            Đơn tối thiểu {formatCurrency(voucher.minTotalOrder)}
                                                            <br />
                                                            Cần mua thêm {formatCurrency(voucher.minTotalOrder - shopTotal)}
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
                            })}
                        </div>
                    </div>
                </div>
            )}
            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 overflow-y-auto z-50">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            Xác nhận xóa
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Bạn có chắc chắn muốn xóa sản phẩm <span className="font-bold text-red-500">{selectedItem?.productName}</span> này? Hành động này không thể hoàn tác.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={() => deleteCartItem(selectedItem.productId)}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Xóa
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setSelectedItem(null);
                                    }}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Cart



