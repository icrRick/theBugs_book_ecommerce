import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

// Thêm dữ liệu mẫu
const sampleData = [
  { id: 1, name: 'Hành động' },
  { id: 2, name: 'Kinh dị' },
  { id: 3, name: 'Tình cảm' },
  { id: 4, name: 'Hài hước' },
  { id: 5, name: 'Khoa học viễn tưởng' },
  { id: 6, name: 'Phiêu lưu' },
  { id: 7, name: 'Hoạt hình' },
  { id: 8, name: 'Tài liệu' },
  { id: 9, name: 'Âm nhạc' },
  { id: 10, name: 'Thể thao' },
  { id: 11, name: 'Chiến tranh' },
  { id: 12, name: 'Lịch sử' },
  { id: 13, name: 'Gia đình' },
  { id: 14, name: 'Tâm lý' },
  { id: 15, name: 'Học đường' },
  { id: 16, name: 'Võ thuật' },
  { id: 17, name: 'Viễn tây' },
  { id: 18, name: 'Trinh thám' },
  { id: 19, name: 'Hình sự' },
  { id: 20, name: 'Cổ trang' },
  { id: 21, name: 'Thần thoại' },
  { id: 22, name: 'Siêu anh hùng' },
  { id: 23, name: 'Kiếm hiệp' },
  { id: 24, name: 'Tiên hiệp' },
  { id: 25, name: 'Xuyên không' },
  { id: 26, name: 'Đam mỹ' },
  { id: 27, name: 'Ngôn tình' },
  { id: 28, name: 'Huyền huyễn' },
  { id: 29, name: 'Bí ẩn' },
  { id: 30, name: 'Giả tưởng' },
  { id: 31, name: 'Thiếu nhi' },
  { id: 32, name: 'Ca nhạc' },
  { id: 33, name: 'Game Show' },
  { id: 34, name: 'Reality Show' },
  { id: 35, name: 'Talk Show' },
  { id: 36, name: 'Sitcom' },
  { id: 37, name: 'TV Show' },
  { id: 38, name: 'Tâm linh' },
  { id: 39, name: 'Tội phạm' },
  { id: 40, name: 'Khám phá' },
  { id: 41, name: 'Phiêu lưu' },
  { id: 42, name: 'Sinh tồn' },
  { id: 43, name: 'Thảm họa' },
  { id: 44, name: 'Zombie' },
  { id: 45, name: 'Quái vật' },
  { id: 46, name: 'Người ngoài hành tinh' },
  { id: 47, name: 'Điệp viên' },
  { id: 48, name: 'Chiến tranh lạnh' },
  { id: 49, name: 'Chính kịch' },
  { id: 50, name: 'Hài kịch' }
];

const ITEMS_PER_PAGE = 5; // Giảm số item trên mỗi trang để test pagination tốt hơn

// Thêm hàm tạo mảng số trang với dấu ...
const getPageNumbers = (currentPage, totalPages) => {
  const delta = 2; // Số trang hiển thị bên cạnh trang hiện tại
  const range = [];
  const rangeWithDots = [];

  // Luôn hiển thị trang đầu
  range.push(1);

  for (let i = currentPage - delta; i <= currentPage + delta; i++) {
    if (i > 1 && i < totalPages) {
      range.push(i);
    }
  }

  // Luôn hiển thị trang cuối nếu có nhiều hơn 1 trang
  if (totalPages > 1) {
    range.push(totalPages);
  }

  // Thêm dấu ... vào các khoảng trống
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

const Genres = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '' });
  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async (selectedName) => {
    setLoading(true);
    try {
      const searchValue = selectedName || searchText;  // Sử dụng tên được chọn hoặc searchText
      const filteredData = sampleData.filter(item => 
        item.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      
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
  }, [searchText, currentPage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const index = sampleData.findIndex(item => item.id === editingId);
        if (index !== -1) {
          sampleData[index] = { ...sampleData[index], ...formData };
          toast.success('Cập nhật thành công!');
        }
      } else {
        const newId = Math.max(...sampleData.map(item => item.id)) + 1;
        sampleData.push({ id: newId, ...formData });
        toast.success('Thêm mới thành công!');
      }
      setShowModal(false);
      fetchData();
      setFormData({ name: '' });
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
        toast.success('Xóa thành công!');
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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
     <h1 className='text-2xl font-bold mb-4'>Quản lý thể loại</h1>
      {/* Search và Add */}
      <div className="flex justify-between items-center mb-6">
        <div className="w-full max-w-md relative">
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text"
              placeholder="Tìm kiếm thể loại..."
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setIsSearching(true);
              }}
              onFocus={() => setIsSearching(true)}
              className="w-full py-3 ps-11 pe-4 bg-white border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors duration-200"
            />
          </div>

          {/* Dropdown Results */}
          {searchText && isSearching && (
            <div className="absolute z-50 w-full mt-2">
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                <div className="max-h-64 overflow-y-auto">
                  {sampleData
                    .filter(item => 
                      item.name.toLowerCase().includes(searchText.toLowerCase())
                    )
                    .map(item => (
                      <div
                        key={item.id}
                        onClick={() => {
                          const selectedName = item.name;
                          setSearchText(selectedName);
                          setIsSearching(false);
                          fetchData(selectedName);
                        }}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150 border-b border-gray-100 last:border-0"
                      >
                        <div className="text-sm text-gray-700">{item.name}</div>
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
            setFormData({ name: '' });
            setShowModal(true);
          }}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Thêm mới
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 uppercase tracking-wider">
                Tên thể loại
              </th>
              <th className="text-right py-4 px-6 text-sm font-medium text-gray-600 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
                <td className="py-3.5 px-6 text-gray-800">{item.name}</td>
                <td className="py-3.5 px-6 text-right">
                  <button
                    onClick={() => {
                      setEditingId(item.id);
                      setFormData({ name: item.name });
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
                Bạn có chắc chắn muốn xóa thể loại này?
              </p>
              <div className="flex justify-end">
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
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingId ? 'Chỉnh sửa thể loại' : 'Thêm thể loại mới'}
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên thể loại
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập tên thể loại"
                  required
                />
              </div>
              <div className="flex justify-end">
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

export default Genres;
