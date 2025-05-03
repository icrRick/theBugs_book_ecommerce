import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { showSuccessToast, showErrorToast } from "../../utils/Toast";
import axiosInstance from "../../utils/axiosInstance";

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const dropdownRef = useRef(null);
  const { userInfo, logout, isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [islistening, setIsListening] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const navigate = useNavigate();
  const fetchCartItems = async () => {
    try {
      const response = await axiosInstance.get("/user/cart/getCartItems");
      if (response.status === 200 && response.data.status === true) {
        const shopList = response.data.data; // đây là mảng chứa nhiều shop

        let totalProductIds = 0;
        shopList.forEach((shop) => {
          totalProductIds += shop.products.length;
        });

        setCartCount(totalProductIds);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      setShowSuggestions(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //code search product by tâm
  const handleSearch = () => {
    const trimmed = searchKeyword.trim();
    if (trimmed === "") {
      navigate("/search");
    } else {
      saveSearchHistory(trimmed);
      navigate(`/search?keyword=${encodeURIComponent(trimmed)}`, {
        state: { keyword: trimmed },
      });
    }
  };
  const handleEnter = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleFocusInput = () => {
    const history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    setSearchHistory(history);
    setShowSuggestions(true);
  };

  const handleVoiceSearch = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
          channelCount: 1,
        },
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
        audioBitsPerSecond: 128000,
      });

      let audioChunks = [];

      setIsListening(true);

      mediaRecorder.ondataavailable = (e) => {
        audioChunks.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("file", audioBlob, "voice.webm");

        stream.getTracks().forEach((track) => track.stop());

        try {
          const response = await fetch(
            "http://localhost:8080/search/voice/transcribe",
            {
              method: "POST",
              body: formData,
              headers: {
                Accept: "application/json",
              },
            }
          );

          setIsListening(false);

          const isJson = response.headers
            .get("content-type")
            ?.includes("application/json");
          const data = isJson ? await response.json() : {};

          if (!response.ok) {
            throw new Error(data.message || `Lỗi server: ${response.status}`);
          }
          if (data.status && data.data?.transcript) {
            let transcript = data.data.transcript
              .replace(/[?!.]+$/, "")
              .replace(/[?!.]/g, "")
              .trim();

            setSearchKeyword(transcript);
            saveSearchHistory(transcript);
            navigate(`/search?keyword=${encodeURIComponent(transcript)}`); // chuyển trang tìm kiếm luôn
          } else {
            alert("Không thể nhận diện giọng nói!");
          }
        } catch (error) {
          setIsListening(false);
          alert("Lỗi gửi file ghi âm: " + error.message);
        }
      };

      mediaRecorder.start();
      setTimeout(() => {
        mediaRecorder.stop();
      }, 2500);
    } catch (error) {
      setIsListening(false);
      alert("Không thể truy cập micro: " + error.message);
    }
  };

  //save history
  const saveSearchHistory = (keyword) => {
    if (!keyword) return;
    let history = JSON.parse(localStorage.getItem("searchHistory")) || [];

    history = [keyword, ...history.filter((item) => item !== keyword)];

    if (history.length > 10) history = history.slice(0, 10);

    localStorage.setItem("searchHistory", JSON.stringify(history));
  };

  const handleChangeInput = (e) => {
    const value = e.target.value;
    setSearchKeyword(value);

    if (value.trim() === "") {
      setShowSuggestions(false);
      return;
    }

    const history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    const filtered = history.filter((item) =>
      item.toLowerCase().includes(value.toLowerCase())
    );

    setSearchHistory(filtered);
    setShowSuggestions(true);
  };

  const handleSelectHistoryKeyword = (keyword) => {
    const trimmed = keyword.trim();
    setSearchKeyword(trimmed);
    saveSearchHistory(trimmed);
    setShowSuggestions(false);

    const newParams = new URLSearchParams(window.location.search);
    newParams.set("keyword", trimmed);
    newParams.set("page", 1);

    setSearchParams(newParams);
  };

  const handleNavigateCart = () => {
    navigate("/cart");
  };
  const handleLogoutClick = () => {
    setIsModalOpen(true);
  };
  const handleLogout = () => {
    logout();
    setIsModalOpen(false);
    navigate("/login");
    showSuccessToast("Đăng xuất thành công");
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-2 py-2.5">
        <div className="flex justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/home" className="text-xl font-bold text-gray-800">
                THEBUGS
              </Link>
            </div>
            <div className="hidden sm:ml-4 sm:flex sm:items-center sm:space-x-3 md:space-x-4 lg:space-x-8">
              <Link
                to="/register-seller"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-2 py-1 border-b-2 text-sm font-medium"
              >
                Bán hàng cùng THEBUGS
              </Link>
              <Link
                to="/search"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-2 py-1 border-b-2 text-sm font-medium"
              >
                Sản phẩm
              </Link>
              {/* Thanh tìm kiếm */}
              <div className="relative ml-2 lg:ml-4">
                <input
                  type="text"
                  value={searchKeyword}
                  autoComplete="off"
                  placeholder="Tìm kiếm..."
                  className="w-[180px] sm:w-[250px] md:w-[300px] lg:w-[400px] px-3 py-1.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  onChange={handleChangeInput}
                  onKeyDown={handleEnter}
                  onFocus={handleFocusInput}
                />
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={handleSearch}
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
                {showSuggestions && searchHistory.length > 0 && (
                  <div className="absolute left-0 z-50 bg-white border border-gray-200 rounded-xl shadow-lg mt-1 w-full max-w-[400px]">
                    <div className="flex justify-between items-center px-4 py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-600">
                        Lịch sử tìm kiếm
                      </span>
                      <button
                        onClick={() => {
                          localStorage.removeItem("searchHistory");
                          setSearchHistory([]);
                        }}
                        className="text-xs text-blue-500 hover:underline"
                      >
                        Xoá tất cả
                      </button>
                    </div>
                    <ul className="max-h-60 overflow-y-auto">
                      {searchHistory.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer group"
                        >
                          <div
                            role="button"
                            tabIndex={0}
                            className="text-sm text-gray-700 group-hover:text-indigo-600"
                            onClick={() => handleSelectHistoryKeyword(item)}
                          >
                            {item}
                          </div>

                          <button
                            className="text-gray-400 text-xs hover:text-red-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              const updated = searchHistory.filter(
                                (_, i) => i !== index
                              );
                              localStorage.setItem(
                                "searchHistory",
                                JSON.stringify(updated)
                              );
                              setSearchHistory(updated);
                            }}
                          >
                            ✕
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <button onClick={handleVoiceSearch} className="ml-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-600 hover:text-gray-800"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14a4 4 0 004-4V6a4 4 0 10-8 0v4a4 4 0 004 4zM19 10v2a7 7 0 11-14 0v-2m14 0H5"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Giỏ hàng và Menu dropdown */}
          <div className="hidden sm:flex sm:items-center sm:space-x-2 md:space-x-3 lg:space-x-4">
            <div className="relative">
              <button
                className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={handleNavigateCart}
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-1 sm:space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
              >
                <img
                  className="h-6 w-6 sm:h-8 sm:w-8 rounded-full"
                  src="https://placehold.co/100x100/2ecc71/ffffff?text=S%C3%A1ch+3"
                  alt="User avatar"
                />
                <span className="hidden lg:inline-block text-sm font-medium">
                  Tài khoản
                </span>
                <svg
                  className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${
                    isDropdownOpen ? "transform rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown menu */}
              {isDropdownOpen && (
                <div className="absolute z-20 right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1" role="menu">
                    {isAuthenticated && userInfo ? (
                      <>
                        <Link
                          to={"/account/profile"}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Tài khoản
                        </Link>

                        {userInfo.role === 2 && (
                          <Link
                            to={"/seller/dashboard"}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Cửa hàng của bạn
                          </Link>
                        )}
                        <Link
                          to={"/account/ordered"}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Đơn hàng
                        </Link>
                        <Link
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={handleLogoutClick}
                        >
                          Đăng xuất
                        </Link>
                      </>
                    ) : (
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Đăng nhập
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-1.5 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Mở menu chính</span>
              {!isOpen ? (
                <svg
                  className="block h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {/* Thanh tìm kiếm mobile */}
            <div className="px-3 py-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <Link
              to={"/register-seller"}
              className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-sm font-medium"
            >
              Bán hàng cùng THEBUGS
            </Link>
            <Link
              to={"/search"}
              className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-sm font-medium"
            >
              Sản phẩm
            </Link>

            {/* Giỏ hàng mobile */}
            <div className="px-3 py-2 flex items-center space-x-2">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="text-sm text-gray-700">
                Giỏ hàng ({cartCount})
              </span>
            </div>

            {/* Menu dropdown mobile */}
            <div className="px-3 py-2">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
              >
                <img
                  className="h-6 w-6 rounded-full"
                  src="https://via.placeholder.com/32"
                  alt="User avatar"
                />
                <span className="text-sm font-medium">Tài khoản</span>
                <svg
                  className={`w-3 h-3 transition-transform ${
                    isDropdownOpen ? "transform rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="mt-2 space-y-1">
                  {isAuthenticated && userInfo ? (
                    <>
                      <Link
                        to={"/account/profile"}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Tài khoản
                      </Link>

                      {userInfo.role === 2 && (
                        <Link
                          to={"/seller/dashboard"}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Cửa hàng của bạn
                        </Link>
                      )}
                      <Link
                        to={"/account/ordered"}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Đơn hàng
                      </Link>
                      <Link
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={handleLogoutClick}
                      >
                        Đăng xuất
                      </Link>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Đăng nhập
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Modal xác nhận đăng xuất */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Xác nhận đăng xuất
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleLogout}
                >
                  Đăng xuất
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {islistening && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <svg
              className="animate-bounce w-10 h-10 text-red-500 mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14a4 4 0 004-4V6a4 4 0 10-8 0v4a4 4 0 004 4zM19 10v2a7 7 0 11-14 0v-2m14 0H5"
              />
            </svg>
            <p className="text-gray-700 font-semibold text-lg">Đang nghe...</p>
            <p className="text-gray-500 text-sm mt-2">
              Hãy nói nội dung tìm kiếm
            </p>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
