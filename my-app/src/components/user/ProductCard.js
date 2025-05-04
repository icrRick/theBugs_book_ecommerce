import { formatCurrency } from "../../utils/Format";

const ProductImage = ({ image, name, promotionValue }) => (
    <div className="relative">
        <img
            src={image}
            alt={name || "Sản phẩm"}
            className="w-full h-52 object-cover"

        />
        {promotionValue > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm">
                -{promotionValue}%
            </div>
        )}
    </div>
);

const StarRating = ({ rate }) => {
    const stars = [];
    const fullStars = Math.floor(rate || 0);
    const hasHalfStar = (rate || 0) % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rate || 0);

    for (let i = 0; i < fullStars; i++) {
        stars.push(<i key={`full-${i}`} className="bi bi-star-fill"></i>);
    }
    if (hasHalfStar) {
        stars.push(<i key="half" className="bi bi-star-half"></i>);
    }
    for (let i = 0; i < emptyStars; i++) {
        stars.push(<i key={`empty-${i}`} className="bi bi-star"></i>);
    }
    return <div className="flex text-yellow-400">{stars}</div>;
};

const ProductPrice = ({ price, promotionValue }) => {
    const discountedPrice = promotionValue > 0
        ? price * (1 - promotionValue / 100)
        : price;

    return (
        <div className="flex-col mb-2 h-12">
            {promotionValue > 0 ? (
                <>
                    <div className="text-red-600 font-bold text-lg">
                        {formatCurrency(discountedPrice)}
                    </div>
                    <div className="text-gray-500 line-through text-sm">
                        {formatCurrency(price)}
                    </div>
                </>
            ) : (
                <div className="text-red-600 font-bold text-lg">
                    {formatCurrency(price)}
                </div>
            )}
        </div>
    );
};

const ProductStats = ({ reviewCount, purchased }) => (
    <div className="flex items-center justify-between mb-2">
        <div className="text-gray-600 text-sm">
            <i className="bi bi-star-fill text-yellow-400 mr-1"></i>
            {reviewCount || 0} đánh giá
        </div>
        <div className="text-gray-600 text-sm">
            <i className="bi bi-cart-check-fill mr-1"></i>
            {purchased || 0} đã bán
        </div>
    </div>
);

const ProductCard = ({ product }) => {


    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <a href={`/product-detail/${product.productCode}`} className="block">
                <ProductImage
                    image={product?.image}
                    name={product?.name}
                    promotionValue={product?.promotionValue}
                />
                <div className="p-4">
                    <h3 className="font-medium text-gray-800 mb-2 line-clamp-2 h-12">
                        {product?.name || "Chưa có tên"}
                    </h3>

                    <div className="flex items-center gap-2 mb-2">
                        <StarRating rate={product?.rate} />
                    </div>

                    <ProductPrice
                        price={product?.price}
                        promotionValue={product?.promotionValue}
                    />

                    <ProductStats
                        reviewCount={product?.reviewCount}
                        purchased={product?.purchased}
                    />
                </div>
            </a>
        </div>
    );
};

export default ProductCard;
