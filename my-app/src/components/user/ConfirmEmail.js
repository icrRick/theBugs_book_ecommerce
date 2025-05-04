"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

export default function ConfirmEmail() {
  // Fix: Correct TypeScript syntax for useState
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [countDown, setCountDown] = useState(5);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isProcessing = useRef(false);

  useEffect(() => {
    const token = searchParams.get("token");
    const userId = searchParams.get("userId");
    if (!token) {
      setStatus("error");
      setMessage("Không tìm thấy token xác nhận trong URL");
      return;
    }

    const confirmEmail = async () => {
      if (isProcessing.current) return;
      isProcessing.current = true;

      try {
        const response = await axios.get(
          `http://localhost:8080/api/users/confirm-email?token=${token}&userId=${userId}`
        );

        if (response.status === 200) {
          console.log("✅ Xác nhận email thành công:", response.data);
          setStatus("success");
          setMessage("Email của bạn đã được xác nhận thành công!");
        } else {
          console.warn("❌ Xác nhận email thất bại:", response.data);
          setStatus("error");
          setMessage(
            "Đã có lỗi xảy ra khi xác nhận email của bạn. Token không hợp lệ hoặc đã hết hạn."
          );
        }
      } catch (error) {
        console.error("❌ Lỗi khi xác nhận email:", error);
        setStatus("error");
        setMessage(
          "Đã có lỗi xảy ra khi xác nhận email của bạn. Vui lòng thử lại sau."
        );
      } finally {
        isProcessing.current = false;
      }
    };

    if (token && !isProcessing.current) {
      confirmEmail();
    }
  }, [searchParams]);

  useEffect(() => {
    if (status !== "loading" && countDown === 0) {
      navigate("/home");
    } else if (status !== "loading") {
      const intervalId = setInterval(() => {
        setCountDown((prevCountDown) => {
          if (prevCountDown > 0) {
            return prevCountDown - 1;
          } else {
            clearInterval(intervalId);
            return 0;
          }
        });
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [countDown, navigate, status]);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1495446815901-a7297e633e8d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80')`,
      }}
    >
      <div className="max-w-3xl w-full mx-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-8">
            <div className="text-center">
              {status === "loading" ? (
                <>
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
                    <svg
                      className="animate-spin h-8 w-8 text-blue-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Đang xác nhận email...
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Vui lòng đợi trong giây lát
                  </p>
                </>
              ) : status === "success" ? (
                <>
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                    <svg
                      className="h-8 w-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Xác nhận email thành công!
                  </h2>
                  <p className="text-gray-600 mb-6">{message}</p>
                </>
              ) : (
                <>
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                    <svg
                      className="h-8 w-8 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Xác nhận email thất bại!
                  </h2>
                  <p className="text-gray-600 mb-6">{message}</p>
                </>
              )}

              {status !== "loading" && (
                <div className="mt-8 text-center">
                  <p className="text-gray-600 mb-4">
                    Bạn sẽ được chuyển về trang chủ sau {countDown} giây
                  </p>
                  <div className="flex justify-center space-x-4">
                    {/* Fix: Changed href to to for react-router-dom Link */}
                    <Link
                      to="/home"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Về trang chủ
                    </Link>
                    <Link
                      to="/account/profile"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Xem tài khoản
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
