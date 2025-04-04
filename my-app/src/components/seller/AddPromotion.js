import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AddPromotion = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [formData, setFormData] = useState({
    promotionValue: '',
    startDate: '',
    endDate: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [expireDate, setExpireDate] = useState('');
  useEffect(() => {
    // TODO: Fetch products from API
    // This is mock data for demonstration
    setProducts([
      { 
        id: 1, 
        name: 'Sách 1', 
        price: 100000,
        currentPromotion: {
          value: 10,
          endDate: '2024-04-30'
        }
      },
      { 
        id: 2, 
        name: 'Sách 2', 
        price: 150000,
        currentPromotion: null
      },
      { 
        id: 3, 
        name: 'Sách 3', 
        price: 200000,
        currentPromotion: {
          value: 15,
          endDate: '2024-04-25'
        }
      },
      { 
        id: 4, 
        name: 'Sách 4', 
        price: 250000,
        currentPromotion: null
      },
      { 
        id: 5, 
        name: 'Sách 5', 
        price: 300000,
        currentPromotion: null
      },
      { 
        id: 6, 
        name: 'Sách 6', 
        price: 350000,
        currentPromotion: null
      },
      { 
        id: 7, 
        name: 'Sách 7', 
        price: 400000,
        currentPromotion: null
      },
      { 
        id: 8, 
        name: 'Sách 8', 
        price: 450000,
        currentPromotion: null
      },
    ]);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProductSelect = (productId) => {
    const product = products.find(p => p.id === productId);
    
    // Kiểm tra nếu sản phẩm có khuyến mãi hiện tại
    if (product.currentPromotion) {
      const currentEndDate = new Date(product.currentPromotion.endDate);
      const newEndDate = new Date(formData.endDate);
      
      // Nếu ngày kết thúc khuyến mãi mới nhỏ hơn ngày kết thúc khuyến mãi hiện tại
      if (newEndDate < currentEndDate) {
        alert(`Sản phẩm "${product.name}" đang có khuyến mãi đến ngày ${product.currentPromotion.endDate}`);
        return;
      }
    }

    setSelectedProducts((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      return [...prev, productId];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Form Data:', formData);
      console.log('Selected Products:', selectedProducts);
      alert('Khuyến mãi đã được thêm thành công');
      navigate('/seller/promotions');
    } catch (error) {
      alert('Có lỗi xảy ra khi thêm khuyến mãi');
    }
  };

  // Tính toán giá sau giảm
  const calculateDiscountedPrice = (product) => {
    const currentPromotion = product.currentPromotion;
    const newPromotionValue = parseFloat(formData.promotionValue);
    
    // Nếu không có khuyến mãi nào
    if (!currentPromotion && !newPromotionValue) {
      return product.price;
    }
    
    // Nếu có khuyến mãi hiện tại và không có khuyến mãi mới
    if (currentPromotion && !newPromotionValue) {
      return product.price * (1 - currentPromotion.value / 100);
    }
    
    // Nếu có khuyến mãi mới và không có khuyến mãi hiện tại
    if (!currentPromotion && newPromotionValue) {
      return product.price * (1 - newPromotionValue / 100);
    }
    
    // Nếu có cả hai, lấy giá trị khuyến mãi cao hơn
    const currentDiscount = currentPromotion.value / 100;
    const newDiscount = newPromotionValue / 100;
    const maxDiscount = Math.max(currentDiscount, newDiscount);
    
    return product.price * (1 - maxDiscount);
  };

  // Lọc sản phẩm theo từ khóa tìm kiếm
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Tính toán phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleRemoveSelected = (productId) => {
    setSelectedProducts(prev => prev.filter(id => id !== productId));
  };

  // Lấy thông tin sản phẩm đã chọn
  const selectedProductsInfo = products.filter(product => 
    selectedProducts.includes(product.id)
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Thêm Khuyến Mãi Mới</h1>
            <p className="mt-1 text-sm text-gray-500">Điền thông tin khuyến mãi và chọn sản phẩm áp dụng</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá Trị Khuyến Mãi (%) <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="number"
                    name="promotionValue"
                    value={formData.promotionValue}
                    onChange={handleInputChange}
                    placeholder="Nhập phần trăm giảm giá"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">%</span>
                  </div>
                </div>
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày Bắt Đầu <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày Kết Thúc <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="mt-8">
              {/* Hiển thị sản phẩm đã chọn */}
              {selectedProductsInfo.length > 0 && (
                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-blue-800 mb-3">Sản Phẩm Đã Chọn ({selectedProductsInfo.length})</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProductsInfo.map(product => (
                      <div
                        key={product.id}
                        className="flex items-center bg-white rounded-md shadow-sm px-3 py-2 text-sm"
                      >
                        <span className="text-gray-700">{product.name}</span>
                        <span className="mx-2 text-gray-400">|</span>
                        <span className="text-green-600 font-medium">
                          {calculateDiscountedPrice(product).toLocaleString('vi-VN')}đ
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSelected(product.id)}
                          className="ml-2 text-gray-400 hover:text-red-500 focus:outline-none"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Danh Sách Sản Phẩm</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Đã chọn {selectedProductsInfo.length} sản phẩm
                  </p>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Chọn
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tên Sản Phẩm
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Giá Gốc
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Khuyến Mãi Hiện Tại
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Giá Sau Giảm
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentItems.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selectedProducts.includes(product.id)}
                              onChange={() => handleProductSelect(product.id)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {product.price.toLocaleString('vi-VN')}đ
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {product.currentPromotion ? (
                              <div className="text-sm">
                                <p className="text-blue-600">{product.currentPromotion.value}%</p>
                                <p className="text-gray-500 text-xs">Hết hạn: {product.currentPromotion.endDate}</p>
                              </div>
                            ) : (
                              <div className="text-sm text-gray-500">Không có</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-green-600 font-medium">
                              {calculateDiscountedPrice(product).toLocaleString('vi-VN')}đ
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Phân trang */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-4 space-x-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    Trước
                  </button>
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => paginate(index + 1)}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        currentPage === index + 1
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    Sau
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/seller/promotions')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={selectedProducts.length === 0}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                  ${selectedProducts.length === 0 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  }`}
              >
                Thêm Khuyến Mãi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPromotion;
