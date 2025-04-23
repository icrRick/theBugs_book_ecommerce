import { Link } from "react-router-dom";

const CardProduct = ({ items }) => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {items.map((product) => (
                <div
                    key={product.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
                >
                    <div className="relative">
                        <Link to={`/product-detail/${product?.productCode}`} className="block">
                            <img
                                src={product?.productImage || "/placeholder.svg"}
                                alt={product?.productName}
                                className="w-full aspect-[3/4] object-cover"
                            />

                        </Link>

                        {product?.promotionValue > 0 && (
                            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                                - {product?.promotionValue}%
                            </div>
                        )}

                        {/* Các icon ở góc dưới bên phải */}
                        <div className="absolute bottom-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {/* Icon yêu thích */}
                            <button
                                className="p-2 rounded-full bg-white/80 hover:bg-white shadow-md text-gray-400 hover:text-rose-500 transition-all duration-300 transform hover:scale-110"
                                onClick={(e) => e.preventDefault()}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>

                            {/* Icon giỏ hàng */}
                            <button
                                className="p-2 rounded-full bg-white/80 hover:bg-emerald-500 shadow-md text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110"
                                onClick={(e) => e.preventDefault()}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <Link to={`/product-detail/${product?.productId}`} className="block">
                        <div className="p-4">
                            <h3 className="font-medium text-gray-800 mb-1 line-clamp-2 h-12">{product?.productName}</h3>

                            <div className="flex items-center mb-2">
                                <div className="flex text-amber-400">
                                    {[...Array(5)].map((_, index) => (
                                        <svg
                                            key={index}
                                            xmlns="http://www.w3.org/2000/svg"
                                            className={`h-4 w-4 ${index < Math.floor(product?.rate) ? "fill-current" : "stroke-current fill-none"}`}
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                            />
                                        </svg>
                                    ))}
                                </div>
                                <span className="text-xs text-gray-500 ml-1">({product?.rate})</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    {
                                        product?.promotionValue !== null ? (
                                            <>
                                                <span className="text-emerald-600 font-bold">{product?.productPrice - ((product?.promotionValue / 100) * product?.productPrice)}</span>
                                                <span className="text-gray-400 text-sm line-through ml-2">
                                                    {product?.productPrice}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-emerald-600 font-bold">{product?.productPrice}</span>
                                        )
                                    }
                                </div>

                            </div>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    )
}

export default CardProduct;
