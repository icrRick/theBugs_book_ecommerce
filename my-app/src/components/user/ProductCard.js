import { formatCurrency } from "../../utils/Format";

const ProductImage = ({ image, name, promotionValue }) => (
    <div className="relative overflow-hidden rounded-t-lg group">
        <div className="w-full h-52 p-2">
            <img
                src={image}
                alt={name || "Sản phẩm"}
                className="h-full w-full aspect-[3/4] object-cover"
            />
        </div>
        {promotionValue > 0 && (
            <div className="absolute top-2 right-2 bg-red-600 text-white px-2.5 py-1 rounded-md text-sm font-bold shadow-lg transform rotate-0">
                -{promotionValue}%
            </div>
        )}
    </div>
);

const StarRating = ({ rate, reviewCount, purchased }) => (
    <div className="flex items-center">
        <div className="flex text-yellow-400 mr-2">
            {[...Array(5)].map((_, i) => (
                <i key={i} className={`text-sm bi ${i < Math.floor(rate || 0)
                        ? "bi-star-fill"
                        : i < Math.ceil(rate || 0)
                            ? "bi-star-half"
                            : "bi-star"
                    }`}></i>
            ))}
        </div>
        <div className="flex items-center text-xs text-gray-500">
            <span>{reviewCount || 0}</span>
            <span className="mx-1">|</span>
            <i className="bi bi-cart-check text-gray-400 mx-1"></i>
            <span>{purchased || 0}</span>
        </div>
    </div>
);

const ProductPrice = ({ price, promotionValue }) => {
    const discountedPrice = promotionValue > 0
        ? price * (1 - promotionValue / 100)
        : price;

    return (
        <div className="flex flex-col mb-1.5 h-12">
            <div className={`font-bold text-base ${promotionValue > 0 ? "text-red-600" : "text-gray-800"}`}>
                {formatCurrency(discountedPrice)}
            </div>
            {promotionValue > 0 && (
                <div className="text-gray-500 line-through text-sm">
                    {formatCurrency(price)}
                </div>
            )}
        </div>
    );
};

const ProductCard = ({ product }) => (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md hover:border-gray-300">
        <a href={`/product-detail/${product?.id}`} className="block">
            <ProductImage
                image={product?.image}
                name={product?.name}
                promotionValue={product?.promotionValue}
            />
            <div className="p-3">
                <h3 className="font-medium text-gray-800 mb-1.5 line-clamp-2 h-11 text-base hover:text-blue-600 transition-colors">
                    {product?.name || "Chưa có tên"}
                </h3>

                <div className="mb-1.5">
                    <StarRating
                        rate={product?.rate}
                        reviewCount={product?.reviewCount}
                        purchased={product?.purchased}
                    />
                </div>

                <ProductPrice
                    price={product?.price}
                    promotionValue={product?.promotionValue}
                />
            </div>
        </a>
    </div>
);

export default ProductCard;
