import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white border-t border-gray-700">
      <div className="max-w-7xl mx-auto p-2 mt-4">
        <div className="flex flex-col md:flex-row justify-between">
          {/* Thông tin về cửa hàng */}
          <div className="md:w-1/3 mb-8 md:mb-0">
            <h3 className="text-lg font-bold mb-3">E-Com Books</h3>
            <p className="text-gray-300 text-sm">
              Chuyên cung cấp sách chất lượng với giá cả hợp lý. 
              Đặt hàng online, giao hàng tận nơi.
            </p>
          </div>

          {/* Phần bên phải */}
          <div className="md:w-2/3 flex flex-col md:flex-row justify-end space-y-8 md:space-y-0 md:space-x-12">
            {/* Liên kết nhanh */}
            <div>
              <h3 className="text-lg font-bold mb-3">Liên kết nhanh</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">Trang chủ</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">Sản phẩm</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">Giới thiệu</a></li>
              </ul>
            </div>

            {/* Thông tin liên hệ */}
            <div>
              <h3 className="text-lg font-bold mb-3">Liên hệ</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM</li>
                <li>Điện thoại: (84) 123-456-789</li>
                <li>Email: info@ecombooks.com</li>
                <li>Giờ làm việc: 8:00 - 22:00</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright section */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} E-Com Books. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 