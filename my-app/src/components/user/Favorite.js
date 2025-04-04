
const Favorite = () => {
    const products = [
        {
          id: 1,
          name: 'Sách 1',
          image: 'https://placehold.co/100x100/2ecc71/ffffff?text=S%C3%A1ch+3',
          shop: 'Shop A',
          rate: 4.5,
          price: 150000,
          discountPrice: 120000,
          stock: 50,
        },
        {
          id: 2,
          name: 'Sách 1',
          image: 'https://placehold.co/100x100/2ecc71/ffffff?text=S%C3%A1ch+3',
          shop: 'Shop A',
          rate: 4.5,
          price: 150000,
          discountPrice: 120000,

        },
        {
          id: 3,
          name: 'Sách 1',
          image: 'https://placehold.co/100x100/2ecc71/ffffff?text=S%C3%A1ch+3',
          shop: 'Shop A',
          rate: 4.5,
          price: 150000,
          discountPrice: 120000,
          stock: 50,        },
        {
          id: 4,
          name: 'Sách 1',
          image: 'https://placehold.co/100x100/2ecc71/ffffff?text=S%C3%A1ch+3',
          shop: 'Shop A',
          rate: 4.5,
          price: 150000,
          discountPrice: 120000,

        },
        {
          id: 5,
          name: 'Sách 1',
          image: 'https://placehold.co/100x100/2ecc71/ffffff?text=S%C3%A1ch+3',
          shop: 'Shop A',
          rate: 4.5,
          price: 150000,
          discountPrice: 120000,
        },
      ];
    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-lg font-semibold mb-4">Sản phẩm yêu thích</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 hover:shadow-lg transition-all duration-300">
              <div className="relative group">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full aspect-square object-cover rounded-lg mb-4" 
                />
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm">
                  -20%
                </div>
              </div>
              
              <h3 className="font-medium mb-2 line-clamp-2">{product.name}</h3>
              
              <div className="flex items-center gap-2 mb-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, index) => (
                    <i key={index} className="bi bi-star-fill"></i>
                  ))}
                </div>
                <span className="text-gray-600">({product.rate})</span>
              </div>

              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-red-600 font-bold text-lg">
                    {product.discountPrice.toLocaleString()}đ
                  </span>
                  <span className="text-gray-500 line-through ml-2">
                    {product.price.toLocaleString()}đ
                  </span>
                </div>
               
              </div>

              <a href="#" className="text-blue-600 hover:text-blue-800 font-medium block mb-3">
                {product.shop}
              </a>

              <div className="flex items-center justify-end gap-2">
                <button className="p-2 rounded-full border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors duration-300">
                  <i className="bi bi-heart"></i>
                </button>
                <button className="p-2 rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors duration-300">
                  <i className="bi bi-cart-plus"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
        </div>
    );
};

export default Favorite;
