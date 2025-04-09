import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Dữ liệu mẫu cho dashboard
const dashboardData = {
  stats: {
    totalSellers: 124,
    pendingSellers: 15,
    totalUsers: 3567,
    activeUsers: 2890,
    totalProducts: 8754,
    totalOrders: 12543,
    totalRevenue: 1234567890,
  },
  recentSellerRequests: [
    { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@example.com', shopName: 'Sách Hay Online', requestDate: '2023-04-01T08:30:00', status: 'pending' },
    { id: 2, name: 'Trần Thị B', email: 'tranthib@example.com', shopName: 'Tri Thức Việt', requestDate: '2023-04-01T09:15:00', status: 'pending' },
    { id: 3, name: 'Lê Văn C', email: 'levanc@example.com', shopName: 'Sách Xưa Shop', requestDate: '2023-04-01T10:20:00', status: 'pending' },
    { id: 4, name: 'Phạm Thị D', email: 'phamthid@example.com', shopName: 'Sách Giáo Khoa 24h', requestDate: '2023-04-01T11:05:00', status: 'pending' },
    { id: 5, name: 'Hoàng Văn E', email: 'hoangvane@example.com', shopName: 'Sách Ngoại Văn', requestDate: '2023-04-01T13:45:00', status: 'pending' },
  ],
  recentUsers: [
    { id: 1, name: 'Nguyễn Thị F', email: 'nguyenthif@example.com', registrationDate: '2023-04-01T08:00:00', status: 'active' },
    { id: 2, name: 'Trần Văn G', email: 'tranvang@example.com', registrationDate: '2023-04-01T09:30:00', status: 'active' },
    { id: 3, name: 'Lê Thị H', email: 'lethih@example.com', registrationDate: '2023-04-01T10:45:00', status: 'inactive' },
    { id: 4, name: 'Phạm Văn I', email: 'phamvani@example.com', registrationDate: '2023-04-01T11:20:00', status: 'active' },
    { id: 5, name: 'Hoàng Thị K', email: 'hoangthik@example.com', registrationDate: '2023-04-01T14:10:00', status: 'active' },
  ],
  recentReports: [
    { id: 1, type: 'seller', reportedName: 'Sách Giả Shop', reason: 'Bán sách giả', reportDate: '2023-04-01T07:30:00', status: 'pending' },
    { id: 2, type: 'product', reportedName: 'Sách lậu XYZ', reason: 'Vi phạm bản quyền', reportDate: '2023-04-01T08:45:00', status: 'pending' },
    { id: 3, type: 'user', reportedName: 'user123', reason: 'Spam bình luận', reportDate: '2023-04-01T10:15:00', status: 'pending' },
    { id: 4, type: 'seller', reportedName: 'Shop ABC', reason: 'Lừa đảo', reportDate: '2023-04-01T11:30:00', status: 'pending' },
    { id: 5, type: 'product', reportedName: 'Sách XYZ', reason: 'Nội dung không phù hợp', reportDate: '2023-04-01T13:20:00', status: 'pending' },
  ],
};

const SuperAdminDashboard = () => {
  const [data, setData] = useState(dashboardData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Giả lập API call
    const fetchData = async () => {
      try {
        // Trong thực tế, bạn sẽ gọi API ở đây
        await new Promise(resolve => setTimeout(resolve, 1000));
        setData(dashboardData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Super Admin Dashboard</h1>
      
      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Tổng số người bán</p>
              <p className="text-2xl font-semibold text-gray-800">{data.stats.totalSellers}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-green-500 text-sm font-medium flex items-center">
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                8.2%
              </span>
              <span className="text-gray-500 text-sm ml-2">so với tháng trước</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 text-orange-600">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Tổng số người dùng</p>
              <p className="text-2xl font-semibold text-gray-800">{data.stats.totalUsers}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-green-500 text-sm font-medium flex items-center">
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                12.5%
              </span>
              <span className="text-gray-500 text-sm ml-2">so với tháng trước</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Tổng số đơn hàng</p>
              <p className="text-2xl font-semibold text-gray-800">{data.stats.totalOrders}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-green-500 text-sm font-medium flex items-center">
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                5.7%
              </span>
              <span className="text-gray-500 text-sm ml-2">so với tháng trước</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Tổng doanh thu</p>
              <p className="text-2xl font-semibold text-gray-800">{formatCurrency(data.stats.totalRevenue)}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-green-500 text-sm font-medium flex items-center">
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                9.3%
              </span>
              <span className="text-gray-500 text-sm ml-2">so với tháng trước</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Thống kê đặc biệt */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Đăng ký người bán chờ duyệt</h2>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
              {data.stats.pendingSellers} yêu cầu
            </span>
          </div>
          <div className="space-y-4">
            {data.recentSellerRequests.slice(0, 3).map((request) => (
              <div key={request.id} className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <p className="font-medium text-gray-800">{request.name}</p>
                  <p className="text-sm text-gray-500">{request.shopName}</p>
                  <p className="text-xs text-gray-400">{formatDate(request.requestDate)}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  <button className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link to="/admin/seller/requests" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Xem tất cả yêu cầu
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Người dùng mới</h2>
          </div>
          <div className="space-y-4">
            {data.recentUsers.slice(0, 3).map((user) => (
              <div key={user.id} className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <p className="font-medium text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <p className="text-xs text-gray-400">{formatDate(user.registrationDate)}</p>
                </div>
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link to="/admin/users" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Quản lý người dùng
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Báo cáo vi phạm</h2>
          </div>
          <div className="space-y-4">
            {data.recentReports.slice(0, 3).map((report) => (
              <div key={report.id} className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <div className="flex items-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium mr-2 ${
                      report.type === 'seller' ? 'bg-blue-100 text-blue-800' : 
                      report.type === 'product' ? 'bg-purple-100 text-purple-800' : 
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {report.type === 'seller' ? 'Người bán' : 
                       report.type === 'product' ? 'Sản phẩm' : 'Người dùng'}
                    </span>
                    <p className="font-medium text-gray-800">{report.reportedName}</p>
                  </div>
                  <p className="text-sm text-gray-500">{report.reason}</p>
                  <p className="text-xs text-gray-400">{formatDate(report.reportDate)}</p>
                </div>
                <div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm">
                    Xem
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link to="/admin/reports" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Xem tất cả báo cáo
            </Link>
          </div>
        </div>
      </div>
      
      {/* Các liên kết nhanh */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quản lý hệ thống</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link to="/admin/seller-requests" className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-800">Duyệt đăng ký người bán</p>
              <p className="text-sm text-gray-500">{data.stats.pendingSellers} yêu cầu chờ duyệt</p>
            </div>
          </Link>
          
          <Link to="/admin/sellers" className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-800">Quản lý người bán</p>
              <p className="text-sm text-gray-500">{data.stats.totalSellers} người bán</p>
            </div>
          </Link>
          
          <Link to="/admin/users" className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-800">Quản lý người dùng</p>
              <p className="text-sm text-gray-500">{data.stats.totalUsers} người dùng</p>
            </div>
          </Link>
          
          <Link to="/admin/reports" className="flex items-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
            <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-800">Quản lý báo cáo vi phạm</p>
              <p className="text-sm text-gray-500">{data.recentReports.length} báo cáo mới</p>
            </div>
          </Link>
          
          <Link to="/admin/products" className="flex items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-800">Quản lý sản phẩm</p>
              <p className="text-sm text-gray-500">{data.stats.totalProducts} sản phẩm</p>
            </div>
          </Link>
          
          <Link to="/admin/settings" className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="p-3 rounded-full bg-gray-200 text-gray-600 mr-4">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-800">Cài đặt hệ thống</p>
              <p className="text-sm text-gray-500">Cấu hình, phân quyền, thông báo</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
