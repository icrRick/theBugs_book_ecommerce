import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Loading from "../../utils/Loading";

const LoginGoogle = () => {
  const { login, fetchUserInfo } = useAuth();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const hasProcessed = useRef(false);

  useEffect(() => {
    const processGoogleLogin = async () => {
      // Nếu đã xử lý rồi thì không xử lý nữa
      if (hasProcessed.current) {
        return;
      }
      
      // Đánh dấu đã xử lý
      hasProcessed.current = true;

      if (!token) {
        setError("Không tìm thấy token xác thực. Vui lòng thử đăng nhập lại.");
        setIsLoading(false);
        return;
      }

      try {
        // Thực hiện đăng nhập với token
        await login(token);
        
        // Lấy thông tin người dùng
        const userData = await fetchUserInfo();
        
        // Chuyển hướng dựa trên vai trò
        if (userData && userData.role === 3) {
          navigate("/admin/dashboard");
        } else {
          navigate("/home");
        }
      } catch (error) {
        console.error("Lỗi trong quá trình đăng nhập Google:", error);
        setError("Đã xảy ra lỗi trong quá trình đăng nhập. Vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    };

    processGoogleLogin();
    
    // Cleanup function
    return () => {
      hasProcessed.current = true;
    };
  }, []);  // Loại bỏ tất cả dependencies để useEffect chỉ chạy một lần

  // Xử lý sự kiện quay lại
  const handleGoBack = () => {
    // Đánh dấu đã xử lý để tránh tiếp tục xử lý đăng nhập
    hasProcessed.current = true;
    navigate("/login");
  };

  return (
    <>
      {isLoading && <Loading />}
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
          <div className="text-center">
            <div className="flex justify-center">
              {error ? (
                <div className="text-red-600 mb-4">
                  <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              ) : (
                <div className="text-emerald-500 mb-4">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
                </div>
              )}
            </div>
            
            <h2 className="mt-2 text-2xl font-bold text-gray-800">
              {error ? "Đăng nhập thất bại" : "Đang xử lý đăng nhập"}
            </h2>
            
            <div className="mt-4">
              {error ? (
                <div>
                  <p className="text-red-600">{error}</p>
                  <button
                    onClick={handleGoBack}
                    className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  >
                    Quay lại trang đăng nhập
                  </button>
                </div>
              ) : (
                <p className="text-gray-600">Vui lòng đợi trong giây lát...</p>
              )}
            </div>
          </div>
          
          {!error && (
            <div className="mt-6">
              <button
                onClick={handleGoBack}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                Hủy và quay lại
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LoginGoogle;
