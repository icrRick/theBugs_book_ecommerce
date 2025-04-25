const ProductCart = ({product}) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="relative">
                <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-md"
                />
                {product.discount && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm">
                        -{product.discount}%
                    </span>
                )}
            </div>
            
            <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                
                <div className="flex items-center mt-2">
                    {[...Array(5)].map((_, index) => (
                        <svg
                            key={index}
                            className={`w-4 h-4 ${
                                index < (product.rating || 0)
                                    ? 'text-yellow-400'
                                    : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    ))}
                    <span className="text-gray-500 ml-2">({product.reviewCount || 0})</span>
                </div>

                <div className="mt-2 flex items-center">
                    <span className="text-green-600 font-bold text-lg">
                        {new Intl.NumberFormat('vi-VN').format(product.price)}đ
                    </span>
                    {product.originalPrice && (
                        <span className="ml-2 text-gray-400 line-through text-sm">
                            {new Intl.NumberFormat('vi-VN').format(product.originalPrice)}đ
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProductCart;
