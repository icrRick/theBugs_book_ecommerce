import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

// Dữ liệu mẫu
const sampleData = {
  totalProducts: 12500,
  totalSold: 85600,
  totalRevenue: 8560000000,
  
  // Dữ liệu báo cáo sản phẩm theo thể loại
  productsByGenre: [
    { genre: 'Văn học', count: 3500, sold: 24000, revenue: 2400000000 },
    { genre: 'Kinh tế', count: 2800, sold: 18500, revenue: 1850000000 },
    { genre: 'Kỹ năng sống', count: 2200, sold: 15400, revenue: 1540000000 },
    { genre: 'Thiếu nhi', count: 1800, sold: 12600, revenue: 1260000000 },
    { genre: 'Giáo khoa', count: 1200, sold: 8400, revenue: 840000000 },
    { genre: 'Khác', count: 1000, sold: 6700, revenue: 670000000 },
  ],
  
  // Dữ liệu báo cáo sản phẩm theo tác giả
  topAuthors: [
    { name: 'Nguyễn Nhật Ánh', books: 45, sold: 8500, revenue: 850000000 },
    { name: 'Dale Carnegie', books: 12, sold: 7800, revenue: 780000000 },
    { name: 'Paulo Coelho', books: 30, sold: 7200, revenue: 720000000 },
    { name: 'Rosie Nguyễn', books: 5, sold: 6800, revenue: 680000000 },
    { name: 'Tô Hoài', books: 120, sold: 6500, revenue: 650000000 },
  ],
  
  // Dữ liệu báo cáo sản phẩm theo nhà xuất bản
  topPublishers: [
    { name: 'NXB Trẻ', books: 2500, sold: 18500, revenue: 1850000000 },
    { name: 'NXB Kim Đồng', books: 3000, sold: 17200, revenue: 1720000000 },
    { name: 'NXB Tổng hợp TP.HCM', books: 1800, sold: 15800, revenue: 1580000000 },
    { name: 'NXB Hội Nhà Văn', books: 1500, sold: 14500, revenue: 1450000000 },
    { name: 'NXB Văn Học', books: 2200, sold: 13200, revenue: 1320000000 },
  ],
  
  // Dữ liệu báo cáo sản phẩm theo giá
  productsByPrice: [
    { range: 'Dưới 50.000đ', count: 2500, sold: 22000, revenue: 880000000 },
    { range: '50.000đ - 100.000đ', count: 4500, sold: 32000, revenue: 2400000000 },
    { range: '100.000đ - 200.000đ', count: 3800, sold: 24000, revenue: 3600000000 },
    { range: '200.000đ - 500.000đ', count: 1500, sold: 7000, revenue: 1750000000 },
    { range: 'Trên 500.000đ', count: 200, sold: 600, revenue: 360000000 },
  ],
  
  // Dữ liệu báo cáo sản phẩm theo đánh giá
  productsByRating: [
    { rating: '5 sao', count: 3200, percentage: 25.6 },
    { rating: '4 sao', count: 5800, percentage: 46.4 },
    { rating: '3 sao', count: 2500, percentage: 20 },
    { rating: '2 sao', count: 800, percentage: 6.4 },
    { rating: '1 sao', count: 200, percentage: 1.6 },
  ],
  
  // Dữ liệu báo cáo sản phẩm theo tình trạng
  productsByStatus: [
    { status: 'Còn hàng', count: 10500, percentage: 84 },
    { status: 'Hết hàng', count: 1500, percentage: 12 },
    { status: 'Ngừng kinh doanh', count: 500, percentage: 4 },
  ],
};

const ReportProducts = () => {
  const [data, setData] = useState(sampleData);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('year');
  const [reportType, setReportType] = useState('genre');
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    // Trong thực tế, bạn sẽ gọi API để lấy dữ liệu báo cáo ở đây
    setLoading(true);
    setTimeout(() => {
      setData(sampleData);
      setLoading(false);
    }, 500);
  }, [timeRange]);

  const handleExport = (format) => {
    setExportLoading(true);
    setTimeout(() => {
      toast.success(`Xuất báo cáo dạng ${format.toUpperCase()} thành công!`);
      setExportLoading(false);
    }, 1500);
  };

  // Hàm vẽ biểu đồ cột ngang
  const renderHorizontalBarChart = (data, valueKey, colorClass) => {
    const maxValue = Math.max(...data.map(item => item[valueKey]));
    
    return (
      <div className="space-y-4 mt-4">
        {data.map((item, index) => {
          const width = (item[valueKey] / maxValue) * 100;
          return (
            <div key={index} className="flex flex-col">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{item.genre || item.range || item.status || item.rating}</span>
                <span className="text-sm text-gray-500">
                  {valueKey === 'revenue' ? `${item[valueKey].toLocaleString()}đ` : item[valueKey].toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${colorClass}`} 
                  style={{ width: `${width}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Hàm vẽ biểu đồ tròn
  const renderPieChart = (data, valueKey) => {
    const total = data.reduce((sum, item) => sum + item[valueKey], 0);
    let startAngle = 0;
    
    return (
      <div className="flex justify-center mt-4">
        <div className="relative w-64 h-64">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {data.map((item, index) => {
              const value = item[valueKey];
              const percentage = (value / total) * 100;
              const angle = (percentage / 100) * 360;
              const endAngle = startAngle + angle;
              
              // Tính toán tọa độ cho đường cung
              const x1 = 50 + 50 * Math.cos((startAngle * Math.PI) / 180);
              const y1 = 50 + 50 * Math.sin((startAngle * Math.PI) / 180);
              const x2 = 50 + 50 * Math.cos((endAngle * Math.PI) / 180);
              const y2 = 50 + 50 * Math.sin((endAngle * Math.PI) / 180);
              
              // Xác định cờ large-arc
              const largeArcFlag = angle > 180 ? 1 : 0;
              
              // Tạo đường dẫn SVG
              const path = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
              
              // Mảng màu cho các phần
              const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
              
              const result = (
                <path
                  key={index}
                  d={path}
                  fill={colors[index % colors.length]}
                  stroke="#fff"
                  strokeWidth="0.5"
                />
              );
              
              startAngle = endAngle;
              return result;
            })}
          </svg>
        </div>
      </div>
    );
  };

  // Hàm hiển thị chú thích cho biểu đồ tròn
  const renderPieLegend = (data, valueKey) => {
    const total = data.reduce((sum, item) => sum + item[valueKey], 0);
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    
    return (
      <div className="grid grid-cols-2 gap-4 mt-6">
        {data.map((item, index) => {
          const value = item[valueKey];
          const percentage = ((value / total) * 100).toFixed(1);
          return (
            <div key={index} className="flex items-center">
              <div 
                className="w-4 h-4 rounded-sm mr-2" 
                style={{ backgroundColor: colors[index % colors.length] }}
              ></div>
              <div className="text-sm">
                <span className="font-medium">{item.genre || item.range || item.status || item.rating}</span>
                <span className="text-gray-500 ml-2">{percentage}%</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold">Báo cáo sản phẩm</h1>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
          <select 
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="year">Năm nay</option>
            <option value="quarter">Quý này</option>
            <option value="month">Tháng này</option>
            <option value="week">Tuần này</option>
          </select>
          
          <div className="relative">
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center"
              onClick={() => document.getElementById('exportDropdown').classList.toggle('hidden')}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {exportLoading ? 'Đang xuất...' : 'Xuất báo cáo'}
            </button>
            <div id="exportDropdown" className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden z-10">
              <div className="py-1">
                <button 
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => handleExport('pdf')}
                >
                  Xuất PDF
                </button>
                <button 
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => handleExport('excel')}
                >
                  Xuất Excel
                </button>
                <button 
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => handleExport('csv')}
                >
                  Xuất CSV
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Thẻ thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Tổng sản phẩm</p>
              <h3 className="text-2xl font-bold text-gray-800">{data.totalProducts.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Tổng đã bán</p>
              <h3 className="text-2xl font-bold text-gray-800">{data.totalSold.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Tổng doanh thu</p>
              <h3 className="text-2xl font-bold text-gray-800">{data.totalRevenue.toLocaleString()}đ</h3>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Báo cáo chính */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <h3 className="text-lg font-semibold text-gray-800">Phân tích sản phẩm</h3>
            <div className="mt-3 sm:mt-0">
              <select 
                className="px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="genre">Theo thể loại</option>
                <option value="price">Theo giá</option>
                <option value="rating">Theo đánh giá</option>
                <option value="status">Theo tình trạng</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              {reportType === 'genre' && renderHorizontalBarChart(data.productsByGenre, 'count', 'bg-blue-600')}
              {reportType === 'price' && renderHorizontalBarChart(data.productsByPrice, 'count', 'bg-blue-600')}
              {reportType === 'rating' && renderHorizontalBarChart(data.productsByRating, 'count', 'bg-blue-600')}
              {reportType === 'status' && renderHorizontalBarChart(data.productsByStatus, 'count', 'bg-blue-600')}
            </div>
            
            <div>
              {reportType === 'genre' && renderPieChart(data.productsByGenre, 'count')}
              {reportType === 'price' && renderPieChart(data.productsByPrice, 'count')}
              {reportType === 'rating' && renderPieChart(data.productsByRating, 'count')}
              {reportType === 'status' && renderPieChart(data.productsByStatus, 'count')}
              
              {reportType === 'genre' && renderPieLegend(data.productsByGenre, 'count')}
              {reportType === 'price' && renderPieLegend(data.productsByPrice, 'count')}
              {reportType === 'rating' && renderPieLegend(data.productsByRating, 'count')}
              {reportType === 'status' && renderPieLegend(data.productsByStatus, 'count')}
            </div>
          </div>
        </div>
      </div>
      
      {/* Bảng thống kê */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Tác giả hàng đầu</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tác giả</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Số sách</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Đã bán</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Doanh thu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.topAuthors.map((author, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{author.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">{author.books}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">{author.sold.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">{author.revenue.toLocaleString()}đ</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Nhà xuất bản hàng đầu</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nhà xuất bản</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Số sách</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Đã bán</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Doanh thu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.topPublishers.map((publisher, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{publisher.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">{publisher.books}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">{publisher.sold.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">{publisher.revenue.toLocaleString()}đ</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportProducts;
