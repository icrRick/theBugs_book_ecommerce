
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const Cart = () => {
    const navigate = useNavigate()
    const [cart, setCart] = useState([
        {
            shopid: 1,
            shopname: "Shop 1",
            checked: false,
            selectedVoucher: null,
            products: [
                {
                    id: 1,
                    name: "Sản phẩm 1",
                    image: "https://via.placeholder.com/150",
                    price: "100.000đ",
                    discountPrice: "80.000đ",
                    quantity: 1,
                    checked: false,
                },
                {
                    id: 2,
                    name: "Sản phẩm 2",
                    image: "https://via.placeholder.com/150",
                    price: "100.000đ",
                    discountPrice: "80.000đ",
                    quantity: 1,
                    checked: false,
                },
            ],
        },
        {
            shopid: 2,
            shopname: "Shop 2",
            checked: false,
            selectedVoucher: null,
            products: [
                {
                    id: 3,
                    name: "Sản phẩm 3",
                    image: "https://via.placeholder.com/150",
                    price: "100.000đ",
                    discountPrice: "80.000đ",
                    quantity: 1,
                    checked: false,
                },
                {
                    id: 4,
                    name: "Sản phẩm 4",
                    image: "https://via.placeholder.com/150",
                    price: "100.000đ",
                    discountPrice: "80.000đ",
                    quantity: 1,
                    checked: false,
                },
            ],
        },
    ])

    const [showVoucherModal, setShowVoucherModal] = useState(false)
    const [selectedShopId, setSelectedShopId] = useState(null)

    // Dữ liệu mẫu cho voucher
    const vouchers = [
        { id: 1, code: "VOUCHER1", discount: "10%", minSpend: "100.000đ", maxDiscount: "50.000đ" },
        { id: 2, code: "VOUCHER2", discount: "20%", minSpend: "200.000đ", maxDiscount: "100.000đ" },
        { id: 3, code: "VOUCHER3", discount: "30%", minSpend: "300.000đ", maxDiscount: "150.000đ" },
    ]

    // Add a function to save checked products and vouchers to localStorage
    const saveCartStateToLocalStorage = (updatedCart) => {
        try {
            // Save checked products
            const checkedProducts = []

            updatedCart.forEach((shop) => {
                shop.products.forEach((product) => {
                    if (product.checked) {
                        checkedProducts.push({
                            id: product.id,
                            checked: true,
                        })
                    }
                })
            })

            localStorage.setItem("checkedProducts", JSON.stringify(checkedProducts))

            // Save vouchers
            const selectedVouchers = []

            updatedCart.forEach((shop) => {
                if (shop.selectedVoucher) {
                    selectedVouchers.push({
                        shopId: shop.shopid,
                        voucher: shop.selectedVoucher,
                    })
                }
            })

            localStorage.setItem("selectedVouchers", JSON.stringify(selectedVouchers))
        } catch (error) {
            console.error("Error saving cart state to localStorage:", error)
        }
    }
    const handleQuantityChange = (shopId, productId, newQuantity) => {
        if (newQuantity < 1) return

        const newCart = cart.map((shop) => {
            if (shop.shopid === shopId) {
                return {
                    ...shop,
                    products: shop.products.map((product) => {
                        if (product.id === productId) {
                            return {
                                ...product,
                                quantity: newQuantity,
                            }
                        }
                        return product
                    }),
                }
            }
            return shop
        })

        setCart(newCart)
    }
    // Modify the useEffect that loads from localStorage to also load vouchers
    useEffect(() => {
        try {
            // Load checked products
            const checkedProductsJSON = localStorage.getItem("checkedProducts")
            if (checkedProductsJSON) {
                const checkedProducts = JSON.parse(checkedProductsJSON)

                // Update cart with checked products from localStorage
                setCart((prevCart) => {
                    const newCart = [...prevCart]

                    newCart.forEach((shop) => {
                        let shopHasCheckedProducts = false

                        shop.products.forEach((product) => {
                            // Find if this product should be checked
                            const savedProduct = checkedProducts.find((p) => p.id === product.id)
                            if (savedProduct && savedProduct.checked) {
                                product.checked = true
                                shopHasCheckedProducts = true
                            }
                        })

                        // Update shop checked status based on products
                        shop.checked = shopHasCheckedProducts
                    })

                    return newCart
                })
            }

            // Load vouchers
            const selectedVouchersJSON = localStorage.getItem("selectedVouchers")
            if (selectedVouchersJSON) {
                const selectedVouchers = JSON.parse(selectedVouchersJSON)

                // Update cart with vouchers from localStorage
                setCart((prevCart) => {
                    const newCart = [...prevCart]

                    newCart.forEach((shop) => {
                        // Find if this shop has a voucher
                        const savedVoucher = selectedVouchers.find((v) => v.shopId === shop.shopid)
                        if (savedVoucher) {
                            shop.selectedVoucher = savedVoucher.voucher
                        }
                    })

                    return newCart
                })
            }

            // Check if returning from Payment
            const isReturningFromPayment = localStorage.getItem("returningFromPayment") === "true"
            if (isReturningFromPayment) {
                localStorage.removeItem("returningFromPayment")
            }
        } catch (error) {
            console.error("Error loading cart state from localStorage:", error)
        }
    }, [])

    // Modify the useEffect that saves to localStorage to use the new function
    useEffect(() => {
        saveCartStateToLocalStorage(cart)
    }, [cart])

    // Function to save checked products to localStorage
    // const saveCheckedProductsToLocalStorage = (updatedCart) => {
    //   // Extract only product IDs and their checked status
    //   const checkedProducts = []

    //   updatedCart.forEach((shop) => {
    //     shop.products.forEach((product) => {
    //       if (product.checked) {
    //         checkedProducts.push({
    //           id: product.id,
    //           checked: true,
    //         })
    //       }
    //     })
    //   })

    //   localStorage.setItem("checkedProducts", JSON.stringify(checkedProducts))
    // }

    // Load checked products from localStorage on component mount
    // useEffect(() => {
    //   try {
    //     const checkedProductsJSON = localStorage.getItem("checkedProducts")

    //     if (checkedProductsJSON) {
    //       const checkedProducts = JSON.parse(checkedProductsJSON)

    //       // Update cart with checked products from localStorage
    //       setCart((prevCart) => {
    //         const newCart = [...prevCart]

    //         newCart.forEach((shop) => {
    //           let shopHasCheckedProducts = false

    //           shop.products.forEach((product) => {
    //             // Find if this product should be checked
    //             const savedProduct = checkedProducts.find((p) => p.id === product.id)
    //             if (savedProduct && savedProduct.checked) {
    //               product.checked = true
    //               shopHasCheckedProducts = true
    //             }
    //           })

    //           // Update shop checked status based on products
    //           shop.checked = shopHasCheckedProducts
    //         })

    //         return newCart
    //       })
    //     }

    //     // Check if returning from Payment
    //     const isReturningFromPayment = localStorage.getItem("returningFromPayment") === "true"
    //     if (isReturningFromPayment) {
    //       localStorage.removeItem("returningFromPayment")
    //     }
    //   } catch (error) {
    //     console.error("Error loading checked products from localStorage:", error)
    //   }
    // }, [])

    // Save checked products whenever cart changes
    // useEffect(() => {
    //   saveCheckedProductsToLocalStorage(cart)
    // }, [cart])

    // Kiểm tra xem có bất kỳ sản phẩm hoặc shop nào được check không
    const hasCheckedItems = () => {
        return cart.some((shop) => shop.checked || shop.products.some((product) => product.checked))
    }

    const handleCheckAll = (checked) => {
        const newCart = cart.map((shop) => ({
            ...shop,
            checked: checked,
            products: shop.products.map((product) => ({
                ...product,
                checked: checked,
            })),
        }))
        setCart(newCart)
    }

    const handleCheckShop = (shopId, checked) => {
        const newCart = cart.map((shop) => {
            if (shop.shopid === shopId) {
                return {
                    ...shop,
                    checked: checked,
                    products: shop.products.map((product) => ({
                        ...product,
                        checked: checked,
                    })),
                }
            }
            return shop
        })
        setCart(newCart)
    }

    const handleCheckProduct = (shopId, productId, checked) => {
        const newCart = cart.map((shop) => {
            if (shop.shopid === shopId) {
                const updatedProducts = shop.products.map((product) => {
                    if (product.id === productId) {
                        return { ...product, checked }
                    }
                    return product
                })

                // Kiểm tra xem có bất kỳ sản phẩm nào trong shop được check không
                const hasCheckedProducts = updatedProducts.some((product) => product.checked)

                return {
                    ...shop,
                    checked: hasCheckedProducts,
                    products: updatedProducts,
                }
            }
            return shop
        })
        setCart(newCart)
    }

    // Kiểm tra xem có bất kỳ sản phẩm hoặc shop nào được check không để hiển thị trạng thái của title
    const isAllChecked = hasCheckedItems()

    // Thêm hàm kiểm tra shop có sản phẩm được check không
    const hasCheckedProductsInShop = (shopId) => {
        const shop = cart.find((shop) => shop.shopid === shopId)
        return shop && shop.products.some((product) => product.checked)
    }

    const handleDeleteCheckedProducts = () => {
        if (!hasCheckedItems()) {
            alert("Vui lòng chọn ít nhất một sản phẩm để xóa")
            return
        }

        // Filter out checked products
        const newCart = cart.map((shop) => ({
            ...shop,
            checked: false,
            products: shop.products.filter((product) => !product.checked),
        }))

        // Update shop checked status based on remaining products
        const finalCart = newCart.map((shop) => {
            const hasProducts = shop.products.length > 0
            return {
                ...shop,
                checked: false,
            }
        })

        setCart(finalCart)
        saveCartStateToLocalStorage(finalCart)
    }

    // Modify the handlePayment function to better save state before navigation
    const handlePayment = () => {
        // Filter selected products and add shop info
        const selectedProducts = cart.flatMap((shop) =>
            shop.products
                .filter((product) => product.checked)
                .map((product) => ({
                    ...product,
                    shopId: shop.shopid,
                    shopName: shop.shopname,
                    voucher: shop.selectedVoucher,
                })),
        )

        if (selectedProducts.length === 0) {
            alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán")
            return
        }

        // Save current state to localStorage before navigating
        saveCartStateToLocalStorage(cart)

        // Set flag to indicate we're going to Payment
        localStorage.setItem("returningFromPayment", "true")

        // Navigate to Payment with selected data
        navigate("/payment", {
            state: {
                selectedProducts,
                selectedVouchers: cart
                    .filter((shop) => shop.selectedVoucher)
                    .map((shop) => ({
                        shopId: shop.shopid,
                        shopName: shop.shopname,
                        voucher: shop.selectedVoucher,
                    })),
            },
        })
    }

    // Modify the handleSelectVoucher function to save state immediately
    const handleSelectVoucher = (shopId, voucher) => {
        const newCart = cart.map((shop) => {
            if (shop.shopid === shopId) {
                return {
                    ...shop,
                    selectedVoucher: voucher,
                }
            }
            return shop
        })
        setCart(newCart)
        setShowVoucherModal(false)

        // Save to localStorage immediately
        saveCartStateToLocalStorage(newCart)
    }

    // Modify the handleRemoveVoucher function to save state immediately
    const handleRemoveVoucher = (shopId) => {
        const newCart = cart.map((shop) => {
            if (shop.shopid === shopId) {
                return {
                    ...shop,
                    selectedVoucher: null,
                }
            }
            return shop
        })
        setCart(newCart)

        // Save to localStorage immediately
        saveCartStateToLocalStorage(newCart)
    }

    return (
        <div className="w-full">
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

            <div className="w-full border-b bg-white mb-4">
                <div className="flex items-center p-4">
                    <div className="w-8 flex justify-center">
                        <input
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            checked={isAllChecked}
                            onChange={(e) => handleCheckAll(e.target.checked)}
                        />
                    </div>
                    <div className="flex-1 pl-2">
                        <span className="font-medium text-gray-700">Sản phẩm</span>
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

            {cart.map((shop) => (
                <div
                    key={shop.shopid}
                    className="bg-white rounded-lg shadow-md overflow-hidden mb-4 "
                >
                    <div className="flex items-center p-4 sm:p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                       <div className="w-8 flex justify-center">
                       <input
                            type="checkbox"
                            className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500 transition-colors duration-200 "
                            checked={shop.checked}
                            onChange={(e) => handleCheckShop(shop.shopid, e.target.checked)}
                        />
                       </div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-700 flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-blue-600 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                />
                            </svg>
                            {shop.shopname}
                        </h3>
                    </div>

                    {shop.products.map((product) => (
                        <div key={product.id} className="flex items-center p-4 border-b border-gray-200">
                            <div className="w-8 flex justify-center">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                    checked={product.checked}
                                    onChange={(e) => handleCheckProduct(shop.shopid, product.id, e.target.checked)}
                                />
                            </div>
                            <div className="flex-1 pl-2 flex">
                                <div className="w-20 h-20 mr-4 relative">
                                    <img
                                        src={product.image || "/placeholder.svg"}
                                        alt={product.name}
                                        width={80}
                                        height={80}
                                        className="object-cover rounded"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="font-medium text-gray-800">{product.name}</h3>
                                    <p className="text-sm text-gray-600">Thể loại: 100</p>
                                    <p className="text-sm text-gray-600">Nhà xuất bản: Đen</p>
                                    <p className="text-sm text-gray-600">Tác giả: S</p>
                                </div>
                            </div>
                            <div className="w-32 flex justify-center">
                                <div className="flex items-center">
                                    <button
                                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l"
                                        onClick={() => handleQuantityChange(shop.shopid, product.id, product.quantity - 1)}
                                    >
                                        -
                                    </button>
                                    <div className="w-10 h-8 flex items-center justify-center border-t border-b border-gray-300">
                                        {product.quantity}
                                    </div>
                                    <button
                                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r"
                                        onClick={() => handleQuantityChange(shop.shopid, product.id, product.quantity + 1)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <div className="w-32 flex flex-col items-center">
                                <span className="text-red-600 font-medium">{product.discountPrice}</span>
                                <span className="text-gray-500 text-sm line-through">{product.price}</span>
                            </div>
                            <div className="w-32 text-center">
                                <span className="text-red-600 font-medium">
                                    {(Number.parseInt(product.discountPrice.replace(/[^\d]/g, "")) * product.quantity).toLocaleString()}đ
                                </span>
                            </div>
                            <div className="w-16 flex justify-center">
                                <button
                                    onClick={() => {
                                        handleCheckProduct(shop.shopid, product.id, true)
                                        handleDeleteCheckedProducts()
                                    }}
                                    className="text-gray-500 hover:text-red-600"
                                >
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
                    <div className="p-4  border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex justify-start">
                            {shop.selectedVoucher ? (
                                <div className="flex items-center space-x-2 bg-green-50 border border-green-200 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-green-100 transition-colors duration-200">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-green-700 font-medium text-sm sm:text-base">{shop.selectedVoucher.code}</span>
                                        <span className="text-xs sm:text-sm text-green-600">- Giảm {shop.selectedVoucher.discount}</span>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveVoucher(shop.shopid)}
                                        className="text-green-700 hover:text-green-900 ml-2 transition-colors duration-200"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 sm:h-5 sm:w-5"
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
                            ) : (
                                <button
                                    onClick={() => {
                                        if (hasCheckedProductsInShop(shop.shopid)) {
                                            setSelectedShopId(shop.shopid)
                                            setShowVoucherModal(true)
                                        } else {
                                            alert("Vui lòng chọn ít nhất một sản phẩm trước khi chọn mã giảm giá")
                                        }
                                    }}
                                    className={`flex items-center space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all duration-200 text-sm sm:text-base shadow-sm hover:shadow ${hasCheckedProductsInShop(shop.shopid)
                                            ? "text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100"
                                            : "text-gray-400 bg-gray-50 cursor-not-allowed"
                                        }`}
                                    disabled={!hasCheckedProductsInShop(shop.shopid)}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 sm:h-5 sm:w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                                        <path
                                            fillRule="evenodd"
                                            d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span>Chọn mã giảm giá</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            <div className="mt-4 sm:mt-6 bg-white rounded-lg shadow-md p-4 sm:p-6 ">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-4">
                    <div className="flex items-center space-x-4">
                        <input
                            type="checkbox"
                            className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500 transition-colors duration-200"
                            checked={isAllChecked}
                            onChange={(e) => handleCheckAll(e.target.checked)}
                        />
                        <span className="text-sm sm:text-base text-gray-600">Chọn tất cả</span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <button className="text-sm sm:text-base text-gray-600 hover:text-red-600 transition-colors duration-200">
                            Yêu thích sản phẩm đã chọn
                        </button>
                        <button className="text-sm sm:text-base text-gray-600 hover:text-red-600 transition-colors duration-200">
                            Yêu thích sản phẩm đã chọn
                        </button>
                        <span className="text-sm sm:text-base text-gray-600">Tổng tiền tạm tính:</span>
                        <span className="text-lg sm:text-xl font-bold text-red-600">320.000đ</span>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
                    <button className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm sm:text-base transition-colors duration-200">
                        Tiếp tục mua sắm
                    </button>
                    <button
                        onClick={handlePayment}
                        className="w-full sm:w-auto px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm sm:text-base transition-colors duration-200 shadow-sm hover:shadow"
                    >
                        Thanh toán
                    </button>
                </div>
            </div>

            {/* Voucher Modal */}
            {showVoucherModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full shadow-xl">
                        <div className="flex justify-between items-center mb-4 sm:mb-6">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-blue-600 mr-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                                    />
                                </svg>
                                Chọn mã giảm giá
                            </h3>
                            <button
                                onClick={() => setShowVoucherModal(false)}
                                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 sm:h-6 sm:w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="space-y-3 sm:space-y-4">
                            {vouchers.map((voucher) => (
                                <div
                                    key={voucher.id}
                                    className="border rounded-lg p-3 sm:p-4 hover:border-blue-500 cursor-pointer transition-all duration-200 hover:bg-blue-50 hover:shadow-md"
                                    onClick={() => handleSelectVoucher(selectedShopId, voucher)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-semibold text-blue-600 text-base sm:text-lg">{voucher.code}</h4>
                                            <p className="text-xs sm:text-sm text-gray-600 mt-1">Giảm {voucher.discount}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs sm:text-sm text-gray-500">Tối thiểu {voucher.minSpend}</p>
                                            <p className="text-xs sm:text-sm text-gray-500">Tối đa {voucher.maxDiscount}</p>
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

export default Cart

