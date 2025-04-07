import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../utils/cookie";
import Pagination from "../admin/Pagination";
import { showErrorToast, showSuccessToast } from "../../utils/Toast";
import Loading from "../../utils/Loading";

const Products = () => {
      const [typingTimeout, setTypingTimeout] = useState(null);
      const [totalItems, setTotalItems] = useState(0);
      const [products, setProducts] = useState([]);
      const [isLoading, setIsLoading] = useState(false);
      const [selectedItem, setSelectedItem] = useState();
      const navigate = useNavigate();

      const [searchTerm, setSearchTerm] = useState(() => {
            const params = new URLSearchParams(window.location.search);
            return params.get("searchTerm") || "";
      });

      const [currentPage, setCurrentPage] = useState(() => {
            const params = new URLSearchParams(window.location.search);
            const page = parseInt(params.get("page"));
            return isNaN(page) ? 1 : page;
      });

      //
      // 1. FETCH FUNCTION
      //
      const fetchData = async (page, keyword = searchTerm) => {
            try {
                  console.log("Page: ", page);
                  console.log("Search Term: ", keyword);
                  setIsLoading(true);
                  const response = await axios.get(
                        "http://localhost:8080/api/seller/productList",
                        {
                              headers: {
                                    Authorization: `Bearer ${getToken()}`,
                                    "Content-Type": "application/json",
                              },
                              params: {
                                    page: page,
                                    keyword: keyword,
                              },
                              withCredentials: true,
                        }
                  );

                  setIsLoading(false);
                  setProducts(response.data.data?.products ?? []);
                  setTotalItems(response.data.data?.totalItems ?? 0);
                  console.log("Response Data: ", response.data);
            } catch (error) {
                  setIsLoading(false);
                  console.error("Error fetching products:", error);
                  if (error.response) {
                        console.error("Status Code:", error.response.status);
                        console.error("Response Error:", error.response.data);
                  }
            }
      };

      //
      // 2. USEEFFECT
      //
      useEffect(() => {
            fetchData(currentPage, searchTerm);
      }, [currentPage]);

      //
      // 3. HANDLE FUNCTION
      //
      const handlePageChange = (newPage) => {
            setCurrentPage(newPage);
            const params = new URLSearchParams(window.location.search);
            params.set("page", newPage);
            window.history.pushState(null, "", "?" + params.toString());

            fetchData(newPage, searchTerm);
      };

      const handleSearch = (e) => {
            const value = e.target.value;

            const params = new URLSearchParams(window.location.search);
            params.set("searchTerm", value);
            params.set("page", "1");
            window.history.pushState(null, "", "?" + params.toString());

            setSearchTerm(value);

            if (typingTimeout) {
                  clearTimeout(typingTimeout);
            }

            const newTimeout = setTimeout(() => {
                  fetchData(1, value);
                  setCurrentPage(1);
            }, 500);

            setTypingTimeout(newTimeout);
      };

      const handleAddProduct = () => {
            navigate("/seller/addproduct");
      };

      const handleEditProduct = (productId) => {
            navigate(`/seller/editproduct/${productId}`);
      };

      const handleDeleteProduct = (productId) => {
            if (!productId) return;

            const deleteProduct = async () => {
                  setIsLoading(true);
                  const headers = {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getToken()}`,
                  };

                  try {
                        const { data } = await axios.post(
                              "http://localhost:8080/api/seller/deleteProduct",
                              { productId: Number(productId) },
                              { headers: headers }
                        );

                        console.log("Data BE: ");
                        console.log(data);
                        console.log(data.data);

                        if (data?.data) {
                              setIsLoading(false);
                              if (data.status) {
                                    showNotificationFromBE(data);
                                    navigate("/seller/products");
                              } else {
                                    showNotificationFromBE(data);
                              }
                        } else {
                              console.error("Invalid product data structure");
                        }
                  } catch (error) {
                        setIsLoading(false);
                        showNotificationFromBE(error.response.data);
                  }

                  await fetchData(currentPage);
            };

            deleteProduct();
      };

      //
      // 4. OTHER FUNCTION
      //
      const getStatusColor = (status) => {
            switch (status) {
                  case "true":
                        return "bg-green-100 text-green-800";
                  case "false":
                        return "bg-red-100 text-red-800";
                  default:
                        return "bg-gray-100 text-gray-800";
            }
      };

      const showNotificationFromBE = (data) => {
            data.message.split("\n").forEach((line) => {
                  if (line.toLowerCase().includes("error")) {
                        showErrorToast(line.replace(/error:/i, "").trim());
                  } else {
                        showSuccessToast(line);
                  }
            });
      };

      if (isLoading) {
            return <Loading />;
      }
      return (
            <div className="my-6">
                  <div className="my-6">
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                              <svg
                                    className="w-8 h-8 mr-3 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                              >
                                    <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                    />
                              </svg>
                              Quản lý Sản phẩm
                        </h1>
                        <p className="mt-2 text-sm text-gray-600">
                              Quản lý danh sách sách và ấn phẩm của bạn một cách
                              hiệu quả
                        </p>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg p-6 mb-8 transition-all duration-300 hover:shadow-xl">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                              <div className="flex-1 max-w-md relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                          <svg
                                                className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                          >
                                                <path
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      strokeWidth="2"
                                                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                />
                                          </svg>
                                    </div>
                                    <input
                                          type="text"
                                          placeholder="Tìm kiếm theo tên sản phẩm, tác giả, thể loại..."
                                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                                          value={searchTerm}
                                          onChange={handleSearch}
                                    />
                              </div>
                              <div className="flex space-x-3">
                                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200">
                                          <svg
                                                className="w-5 h-5 mr-2 text-gray-500"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                          >
                                                <path
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      strokeWidth="2"
                                                      d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                                                />
                                          </svg>
                                          Lọc
                                    </button>
                                    <button
                                          onClick={() => handleAddProduct()}
                                          className="inline-flex items-center px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-md hover:shadow-lg"
                                    >
                                          <svg
                                                className="w-5 h-5 mr-2"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                          >
                                                <path
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      strokeWidth="2"
                                                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                                />
                                          </svg>
                                          Thêm sản phẩm
                                    </button>
                              </div>
                        </div>

                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                              <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                          <tr className="bg-gray-50">
                                                <th
                                                      scope="col"
                                                      className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                                >
                                                      Hình ảnh
                                                </th>
                                                <th
                                                      scope="col"
                                                      className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                                >
                                                      Tên sản phẩm
                                                </th>
                                                <th
                                                      scope="col"
                                                      className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                                >
                                                      Thể loại
                                                </th>
                                                <th
                                                      scope="col"
                                                      className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                                >
                                                      Tác giả
                                                </th>

                                                <th
                                                      scope="col"
                                                      className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                                >
                                                      Cân nặng
                                                </th>
                                                <th
                                                      scope="col"
                                                      className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                                >
                                                      Trạng thái
                                                </th>
                                                <th
                                                      scope="col"
                                                      className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                                >
                                                      Thao tác
                                                </th>
                                          </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                          {products.map((product) => (
                                                <tr
                                                      key={product.id}
                                                      className="hover:bg-gray-50 transition-colors"
                                                >
                                                      <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="relative group">
                                                                  <img
                                                                        src={
                                                                              product
                                                                                    .images[0]
                                                                                    ?.name
                                                                        }
                                                                        alt={
                                                                              product.name
                                                                        }
                                                                        className="h-16 w-16 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-all duration-200"
                                                                  />
                                                                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-lg"></div>
                                                            </div>
                                                      </td>
                                                      <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
                                                                  {product.name}
                                                            </div>
                                                            <div className="text-xs text-gray-500 mt-1">
                                                                  ID: #
                                                                  {product.id}
                                                            </div>
                                                      </td>
                                                      <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex flex-wrap gap-1">
                                                                  {product.genres?.map(
                                                                        (
                                                                              cat
                                                                        ) => (
                                                                              <span
                                                                                    key={
                                                                                          cat.id
                                                                                    }
                                                                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition-colors cursor-pointer"
                                                                              >
                                                                                    {
                                                                                          cat.name
                                                                                    }
                                                                              </span>
                                                                        )
                                                                  )}
                                                            </div>
                                                      </td>
                                                      <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex flex-wrap gap-1">
                                                                  {product.authors?.map(
                                                                        (
                                                                              auth
                                                                        ) => (
                                                                              <span
                                                                                    key={
                                                                                          auth.id
                                                                                    }
                                                                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100 hover:bg-green-100 transition-colors cursor-pointer"
                                                                              >
                                                                                    {
                                                                                          auth.name
                                                                                    }
                                                                              </span>
                                                                        )
                                                                  )}
                                                            </div>
                                                      </td>

                                                      <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">
                                                                  {
                                                                        product.weight
                                                                  }
                                                                  g
                                                            </span>
                                                      </td>
                                                      <td className="px-6 py-4 whitespace-nowrap">
                                                            <span
                                                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                                                        product.active
                                                                  )}`}
                                                            >
                                                                  {product.active ===
                                                                  true
                                                                        ? "Đang bán"
                                                                        : "Ngừng bán"}
                                                            </span>
                                                      </td>
                                                      <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center space-x-3">
                                                                  <button
                                                                        onClick={() =>
                                                                              handleEditProduct(
                                                                                    product.id
                                                                              )
                                                                        }
                                                                        className="text-blue-600 hover:text-blue-900 transition-colors p-1 hover:bg-blue-50 rounded-full"
                                                                  >
                                                                        <svg
                                                                              xmlns="http://www.w3.org/2000/svg"
                                                                              className="h-5 w-5"
                                                                              viewBox="0 0 20 20"
                                                                              fill="currentColor"
                                                                        >
                                                                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                                        </svg>
                                                                  </button>
                                                                  <button
                                                                        onClick={() =>
                                                                              setSelectedItem(
                                                                                    product
                                                                              )
                                                                        }
                                                                        className="text-red-600 hover:text-red-900 transition-colors p-1 hover:bg-red-50 rounded-full"
                                                                  >
                                                                        <svg
                                                                              xmlns="http://www.w3.org/2000/svg"
                                                                              className="h-5 w-5"
                                                                              viewBox="0 0 20 20"
                                                                              fill="currentColor"
                                                                        >
                                                                              <path
                                                                                    fillRule="evenodd"
                                                                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                                                    clipRule="evenodd"
                                                                              />
                                                                        </svg>
                                                                  </button>
                                                            </div>
                                                      </td>
                                                </tr>
                                          ))}
                                    </tbody>
                              </table>
                        </div>
                        {products.length > 0 && (
                              <Pagination
                                    currentPage={currentPage}
                                    totalPages={Math.ceil(totalItems / 10)}
                                    setCurrentPage={handlePageChange}
                              />
                        )}
                  </div>
                  {selectedItem && (
                        <div className="fixed inset-0 overflow-y-auto z-50">
                              <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                                    <div
                                          className="fixed inset-0 transition-opacity"
                                          aria-hidden="true"
                                    >
                                          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                                    </div>
                                    <span
                                          className="hidden sm:inline-block sm:align-middle sm:h-screen"
                                          aria-hidden="true"
                                    >
                                          &#8203;
                                    </span>
                                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                                <div className="sm:flex sm:items-start">
                                                      <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                                            <svg
                                                                  className="h-6 w-6 text-red-600"
                                                                  xmlns="http://www.w3.org/2000/svg"
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
                                                                  Xác nhận xóa
                                                            </h3>
                                                            <div className="mt-2">
                                                                  <p className="text-sm text-gray-500">
                                                                        Bạn có
                                                                        chắc
                                                                        chắn
                                                                        muốn xóa
                                                                        sản phẩm{" "}
                                                                        <span className="font-bold text-red-500">
                                                                              {
                                                                                    selectedItem?.name
                                                                              }
                                                                        </span>{" "}
                                                                        <br></br>
                                                                        Hành
                                                                        động này
                                                                        không
                                                                        thể hoàn
                                                                        tác.
                                                                  </p>
                                                            </div>
                                                      </div>
                                                </div>
                                          </div>
                                          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                                <button
                                                      type="button"
                                                      onClick={() => {
                                                            handleDeleteProduct(
                                                                  selectedItem.id
                                                            );
                                                            setSelectedItem(
                                                                  null
                                                            );
                                                      }}
                                                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                                >
                                                      Xóa
                                                </button>
                                                <button
                                                      type="button"
                                                      onClick={() => {
                                                            setSelectedItem(
                                                                  null
                                                            );
                                                      }}
                                                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                                >
                                                      Hủy
                                                </button>
                                          </div>
                                    </div>
                              </div>
                        </div>
                  )}
            </div>
      );
};

export default Products;
