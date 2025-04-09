import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

// Dữ liệu mẫu
const sampleData = [
  { id: 1, title: 'Đắc Nhân Tâm', author: 'Dale Carnegie', publisher: 'NXB Tổng hợp', price: 86000, stock: 150, status: 'Còn hàng' },
  { id: 2, title: 'Nhà Giả Kim', author: 'Paulo Coelho', publisher: 'NXB Văn Học', price: 69000, stock: 200, status: 'Còn hàng' },
  { id: 3, title: 'Tuổi Trẻ Đáng Giá Bao Nhiêu', author: 'Rosie Nguyễn', publisher: 'NXB Hội Nhà Văn', price: 70000, stock: 100, status: 'Còn hàng' },
  { id: 4, title: 'Cây Cam Ngọt Của Tôi', author: 'José Mauro de Vasconcelos', publisher: 'NXB Hội Nhà Văn', price: 108000, stock: 80, status: 'Còn hàng' },
  { id: 5, title: 'Tôi Thấy Hoa Vàng Trên Cỏ Xanh', author: 'Nguyễn Nhật Ánh', publisher: 'NXB Trẻ', price: 125000, stock: 120, status: 'Còn hàng' },
  { id: 6, title: 'Hai Số Phận', author: 'Jeffrey Archer', publisher: 'NXB Văn Học', price: 150000, stock: 50, status: 'Còn hàng' },
  { id: 7, title: 'Người Giàu Có Nhất Thành Babylon', author: 'George S. Clason', publisher: 'NXB Tổng hợp', price: 88000, stock: 90, status: 'Còn hàng' },
  { id: 8, title: 'Điều Kỳ Diệu Của Tiệm Tạp Hóa Namiya', author: 'Keigo Higashino', publisher: 'NXB Hội Nhà Văn', price: 96000, stock: 70, status: 'Còn hàng' },
  { id: 9, title: 'Mắt Biếc', author: 'Nguyễn Nhật Ánh', publisher: 'NXB Trẻ', price: 110000, stock: 85, status: 'Còn hàng' },
  { id: 10, title: 'Cho Tôi Xin Một Vé Đi Tuổi Thơ', author: 'Nguyễn Nhật Ánh', publisher: 'NXB Trẻ', price: 80000, stock: 95, status: 'Còn hàng' },
  { id: 11, title: 'Tôi Là Bêtô', author: 'Nguyễn Nhật Ánh', publisher: 'NXB Trẻ', price: 78000, stock: 60, status: 'Còn hàng' },
  { id: 12, title: 'Đời Ngắn Đừng Ngủ Dài', author: 'Robin Sharma', publisher: 'NXB Trẻ', price: 75000, stock: 110, status: 'Còn hàng' },
  { id: 13, title: 'Dám Nghĩ Lớn', author: 'David J. Schwartz', publisher: 'NXB Lao Động', price: 115000, stock: 40, status: 'Còn hàng' },
  { id: 14, title: 'Đừng Bao Giờ Đi Ăn Một Mình', author: 'Keith Ferrazzi', publisher: 'NXB Trẻ', price: 92000, stock: 75, status: 'Còn hàng' },
  { id: 15, title: 'Bí Mật Của May Mắn', author: 'Alex Rovira', publisher: 'NXB Lao Động', price: 68000, stock: 55, status: 'Còn hàng' },
];

const ITEMS_PER_PAGE = 5;

// Hàm tạo mảng số trang với dấu ...
const getPageNumbers = (currentPage, totalPages) => {
  const delta = 2;
  const range = [];
  const rangeWithDots = [];

  range.push(1);

  for (let i = currentPage - delta; i <= currentPage + delta; i++) {
    if (i > 1 && i < totalPages) {
      range.push(i);
    }
  }

  if (totalPages > 1) {
    range.push(totalPages);
  }

  let prev = 0;
  for (const i of range) {
    if (prev + 1 < i) {
      rangeWithDots.push('...');
    }
    rangeWithDots.push(i);
    prev = i;
  }

  return rangeWithDots;
};

const Products = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ 
    title: '', 
    author: '', 
    publisher: '', 
    price: '', 
    stock: '', 
    status: 'Còn hàng' 
  });
  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterBy, setFilterBy] = useState('title');

  const fetchData = async (selectedTitle) => {
    setLoading(true);
    try {
      const searchValue = selectedTitle || searchText;
      let filteredData = [...sampleData];
      
      if (searchValue) {
        filteredData = sampleData.filter(item => {
          if (filterBy === 'title') {
            return item.title.toLowerCase().includes(searchValue.toLowerCase());
          } else if (filterBy === 'author') {
            return item.author.toLowerCase().includes(searchValue.toLowerCase());
          } else if (filterBy === 'publisher') {
            return item.publisher.toLowerCase().includes(searchValue.toLowerCase());
          }
          return true;
        });
      }
      
      // Tính toán dữ liệu cho trang hiện tại
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const paginatedData = filteredData.slice(startIndex, endIndex);
      
      setData(paginatedData);
      setTotalPages(Math.ceil(filteredData.length / ITEMS_PER_PAGE));
    } catch (error) {
      console.error('Error:', error);
      toast.error('Có lỗi khi tải dữ liệu');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [searchText, currentPage, filterBy]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const index = sampleData.findIndex(item => item.id === editingId);
        if (index !== -1) {
          sampleData[index] = { ...sampleData[index], ...formData };
          toast.success('Cập nhật sản phẩm thành công!');
        }
      } else {
        const newId = Math.max(...sampleData.map(item => item.id)) + 1;
        sampleData.push({ id: newId, ...formData });
        toast.success('Thêm sản phẩm mới thành công!');
      }
      setShowModal(false);
      fetchData();
      setFormData({ title: '', author: '', publisher: '', price: '', stock: '', status: 'Còn hàng' });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Có lỗi xảy ra!');
    }
  };

  const handleDelete = async (id) => {
    try {
      const index = sampleData.findIndex(item => item.id === id);
      if (index !== -1) {
        sampleData.splice(index, 1);
        toast.success('Xóa sản phẩm thành công!');
        fetchData();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Có lỗi xảy ra khi xóa!');
    }
    setShowDeleteModal(false);
  };

  const openDeleteModal = (id) => {
    setDeletingId(id);
    setShowDeleteModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className='text-2xl font-bold mb-4'>Quản lý sản phẩm</h1>
      
      {/* Search và Add */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="w-full md:max-w-xl">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  setIsSearching(true);
                }}
                onFocus={() => setIsSearching(true)}
                className="w-full py-3 ps-11 pe-4 bg-white border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors duration-200"
              />
            </div>
            
            <select 
              className="py-3 px-4 bg-white border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors duration-200"
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
            >
              <option value="title">Tên sách</option>
              <option value="author">Tác giả</option>
              <option value="publisher">Nhà xuất bản</option>
            </select>
          </div>

          {/* Dropdown Results */}
          {searchText && isSearching && (
            <div className="absolute z-50 w-full max-w-xl mt-2">
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                <div className="max-h-64 overflow-y-auto">
                  {sampleData
                    .filter(item => {
                      if (filterBy === 'title') {
                        return item.title.toLowerCase().includes(searchText.toLowerCase());
                      } else if (filterBy === 'author') {
                        return item.author.toLowerCase().includes(searchText.toLowerCase());
                      } else if (filterBy === 'publisher') {
                        return item.publisher.toLowerCase().includes(searchText.toLowerCase());
                      }
                      return true;
                    })
                    .slice(0, 10)
                    .map(item => (
                      <div
                        key={item.id}
                        onClick={() => {
                          const selectedTitle = item.title;
                          setSearchText(selectedTitle);
                          setIsSearching(false);
                          fetchData(selectedTitle);
                        }}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150 border-b border-gray-100 last:border-0"
                      >
                        <div className="text-sm text-gray-700">{item.title}</div>
                        <div className="text-xs text-gray-500">{item.author} - {item.publisher}</div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ title: '', author: '', publisher: '', price: '', stock: '', status: 'Còn hàng' });
            setShowModal(true);
          }}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center whitespace-nowrap"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Thêm sản phẩm
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Tên sách
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Tác giả
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 uppercase tracking-wider hidden md:table-cell">
                  Nhà xuất bản
                </th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Giá
                </th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-600 uppercase tracking-wider hidden lg:table-cell">
                  Tồn kho
                </th>
                <th className="text-center py-4 px-6 text-sm font-medium text-gray-600 uppercase tracking-wider hidden sm:table-cell">
                  Trạng thái
                </th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
                  <td className="py-3.5 px-6 text-gray-800">
                    <div className="font-medium">{item.title}</div>
                  </td>
                  <td className="py-3.5 px-6 text-gray-600">{item.author}</td>
                  <td className="py-3.5 px-6 text-gray-600 hidden md:table-cell">{item.publisher}</td>
                  <td className="py-3.5 px-6 text-gray-800 text-right font-medium">{item.price.toLocaleString()}đ</td>
                  <td className="py-3.5 px-6 text-gray-600 text-right hidden lg:table-cell">{item.stock}</td>
                  <td className="py-3.5 px-6 hidden sm:table-cell">
                    <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      item.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button
                      onClick={() => {
                        setEditingId(item.id);
                        setFormData({
                          title: item.title,
                          author: item.author,
                          publisher: item.publisher,
                          price: item.price,
                          stock: item.stock,
                          status: item.status
                        });
                        setShowModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 font-medium mr-4 transition-colors duration-200"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => openDeleteModal(item.id)}
                      className="text-red-600 hover:text-red-800 font-medium transition-colors duration-200"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Trước
            </button>
            
            {getPageNumbers(currentPage, totalPages).map((item, index) => (
              item === '...' ? (
                <span 
                  key={`dots-${index}`} 
                  className="px-3 py-1 text-gray-500"
                >
                  {item}
                </span>
              ) : (
                <button
                  key={item}
                  onClick={() => setCurrentPage(item)}
                  className={`px-3 py-1 rounded ${
                    currentPage === item
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {item}
                </button>
              )
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Sau
            </button>
          </div>
        </div>
      </div>

      {/* Modal xác nhận xóa */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Xác nhận xóa
              </h2>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-6">
                Bạn có chắc chắn muốn xóa sản phẩm này?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200 font-medium"
                >
                  Hủy
                </button>
                <button
                  onClick={() => handleDelete(deletingId)}
                  className="px-5 py-2.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 font-medium"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal thêm/sửa */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingId ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên sách
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập tên sách"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tác giả
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập tên tác giả"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nhà xuất bản
                  </label>
                  <input
                    type="text"
                    name="publisher"
                    value={formData.publisher}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập tên nhà xuất bản"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập giá sách"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số lượng tồn kho
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập số lượng tồn kho"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trạng thái
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="Còn hàng">Còn hàng</option>
                    <option value="Hết hàng">Hết hàng</option>
                    <option value="Ngừng kinh doanh">Ngừng kinh doanh</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200 font-medium mr-3"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  {editingId ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
