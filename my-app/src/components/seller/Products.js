import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../utils/cookie";
import Pagination from "../admin/Pagination";

const Products = () => {
      const [searchTerm, setSearchTerm] = useState("");
      const [totalItems, setTotalItems] = useState(0);
      const [products, setProducts] = useState([]);
      const [pageSize, setPageSize] = useState(10);

      const [currentPage, setCurrentPage] = useState(() => {
            const params = new URLSearchParams(window.location.search);
            const page = parseInt(params.get("page"));
            return isNaN(page) ? 1 : page; // fallback nếu không có page hoặc page không hợp lệ
      });

      const handlePageChange = (newPage) => {
            setCurrentPage(newPage);
            const params = new URLSearchParams(window.location.search);
            params.set("page", newPage);
            window.history.pushState(null, "", "?" + params.toString());
      };

      useEffect(() => {
            fetchData(currentPage); // dùng state đã được khởi tạo đúng
      }, [currentPage]);

      const fetchData = async (page) => {
            try {
                  console.log("Page " + page);
                  console.log(getToken());
                  const response = await axios.get(
                        "http://localhost:8080/api/seller/productList",
                        {
                              headers: {
                                    Authorization: `Bearer ${getToken()}`,
                                    "Content-Type": "application/json",
                              },
                              params: {
                                    page: page,
                              },
                              withCredentials: true,
                        }
                  );
                  setProducts(response.data.data.products);
                  setTotalItems(response.data.data.totalItems);
                  console.log("Response Data: ", response.data);
            } catch (error) {
                  console.error("Error fetching products:", error);
                  if (error.response) {
                        console.error("Status Code:", error.response.status);
                        console.error("Response Error:", error.response.data);
                  }
            }
      };

      useEffect(() => {
            fetchData(currentPage);
      }, [currentPage]);
      const handleSearch = (e) => {
            setSearchTerm(e.target.value);
      };

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

      const navigate = useNavigate();
      const handleAddProduct = () => {
            navigate("/seller/addproduct");
      };
      const handleEditProduct = (productId) => {
            navigate(`/seller/editproduct/${productId}`);
      };
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
                                                                        product.status
                                                                  )}`}
                                                            >
                                                                  {product.status ===
                                                                  "active"
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
                                                                  <button className="text-red-600 hover:text-red-900 transition-colors p-1 hover:bg-red-50 rounded-full">
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
            </div>
      );
};

export default Products;
