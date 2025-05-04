"use client";

import { useState, useEffect } from "react";
import {
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  FaBoxOpen,
  FaChartLine,
  FaSortAmountDown,
  FaCalendarAlt,
} from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance";

const StatisticProduct = () => {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [timeRange, setTimeRange] = useState("month");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("sales");
  const [statisticalData, setStatisticalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Colors for charts
  const COLORS = [
    "#6366f1",
    "#8b5cf6",
    "#ec4899",
    "#f43f5e",
    "#f97316",
    "#f59e0b",
    "#10b981",
    "#14b8a6",
    "#0ea5e9",
    "#6366f1",
    "#8b5cf6",
    "#ec4899",
    "#f43f5e",
    "#f97316",
  ];
  const INVENTORY_COLORS = ["#10b981", "#f59e0b", "#ef4444"];

  useEffect(() => {
    if (startDate && endDate) {
      fetchStatisticalData();
    }
  }, [startDate, endDate]);
  useEffect(() => {
    fetchStatisticalData();
  }, []);
  const fetchStatisticalData = () => {
    setLoading(true);

    // Prepare query parameters
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    axiosInstance
      .get(`/api/seller/statistical?${params.toString()}`)
      .then((response) => {
        if (response.data.status) {
          setStatisticalData(response.data.data);
        } else {
          throw new Error(response.data.message || "Failed to fetch data");
        }
      })
      .catch((error) => {
        console.error("Error fetching statistical data:", error);
        setError(
          error.response?.data?.message || error.message || "An error occurred"
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  if (loading) {
    return <div className="p-8 text-center">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Lỗi: {error}</div>;
  }

  if (!statisticalData) {
    return <div className="p-8 text-center">Không có dữ liệu</div>;
  }

  return (
    <div className="p-8 bg-white rounded-xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Thống kê sản phẩm
          </h1>
          <p className="text-gray-500 mt-1">
            Phân tích hiệu suất và xu hướng sản phẩm
          </p>
        </div>
        <div className="flex space-x-3">
          <div className="relative">
            <input
              type="date"
              className="appearance-none pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all shadow-sm"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Từ ngày"
            />
            <FaCalendarAlt className="absolute left-3.5 top-3 text-gray-400" />
          </div>
          <div className="relative">
            <input
              type="date"
              className="appearance-none pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all shadow-sm"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="Đến ngày"
            />
            <FaCalendarAlt className="absolute left-3.5 top-3 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Overview metrics */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Tổng sản phẩm</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {statisticalData.allProduct || "Không có dữ liệu"}
              </h3>
              <div className="flex items-center mt-2">
                <span className="text-xs font-medium px-1.5 py-0.5 bg-green-100 text-green-700 rounded">
                  Đã bán:
                </span>
                <span className="text-xs text-gray-500 ml-1.5">
                  {statisticalData.soldProduct || "Không có dữ liệu"}
                </span>
              </div>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
              <FaBoxOpen className="text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex flex-col">
            <p className="text-sm text-gray-500 mb-1">Sản phẩm bán chạy nhất</p>
            <div className="flex items-center mt-2">
              {statisticalData.mostSoldProduct?.productImage && (
                <div className="relative w-16 h-16 mr-3 rounded-md overflow-hidden">
                  <img
                    src={statisticalData.mostSoldProduct.productImage}
                    alt={
                      statisticalData.mostSoldProduct.productName ||
                      "Không có dữ liệu"
                    }
                    className="object-cover w-full h-full"
                  />
                </div>
              )}

              <div>
                <h4 className="font-medium text-gray-800">
                  {statisticalData.mostSoldProduct?.productName ||
                    "Không có dữ liệu"}
                </h4>
                <p className="text-sm text-gray-500">
                  <span className="text-xs font-medium px-1.5 py-0.5 bg-green-100 text-green-700 rounded">
                    Đã bán:
                  </span>{" "}
                  {statisticalData.mostSoldProduct?.soldQuantity || "0"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex flex-col">
            <p className="text-sm text-gray-500 mb-1">Sản phẩm bán ít nhất</p>
            <div className="flex items-center mt-2">
              {statisticalData.leastSoldProduct?.productImage && (
                <div className="relative w-16 h-16 mr-3 rounded-md overflow-hidden">
                  <img
                    src={statisticalData.leastSoldProduct.productImage}
                    alt={
                      statisticalData.leastSoldProduct.productName ||
                      "Không có dữ liệu"
                    }
                    className="object-cover w-full h-full"
                  />
                </div>
              )}

              <div>
                <h4 className="font-medium text-gray-800">
                  {statisticalData.leastSoldProduct?.productName ||
                    "Không có dữ liệu"}
                </h4>
                <p className="text-sm text-gray-500">
                  <span className="text-xs font-medium px-1.5 py-0.5 bg-green-100 text-green-700 rounded">
                    Đã bán:
                  </span>{" "}
                  {statisticalData.leastSoldProduct?.soldQuantity || "0"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category and inventory charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Phân bố danh mục sản phẩm
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Tỷ lệ sản phẩm theo từng danh mục
            </p>
          </div>
          <div className="h-80 mt-4">
            {statisticalData.chart_GenresProduct &&
            statisticalData.chart_GenresProduct.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statisticalData.chart_GenresProduct}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="quantity"
                    nameKey="name"
                  >
                    {statisticalData.chart_GenresProduct.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke="none"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [
                      `${value} sản phẩm (${(
                        (value /
                          statisticalData.chart_GenresProduct.reduce(
                            (sum, item) => sum + item.quantity,
                            0
                          )) *
                        100
                      ).toFixed(1)}%)`,
                      name,
                    ]}
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      border: "none",
                      padding: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                Không có dữ liệu
              </div>
            )}
          </div>

          {/* Separate scrollable legend */}
          <div className="mt-4 max-h-40 overflow-y-auto pr-2 border-t pt-4">
            {statisticalData.chart_GenresProduct &&
            statisticalData.chart_GenresProduct.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {statisticalData.chart_GenresProduct.map((entry, index) => (
                  <div key={`legend-${index}`} className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-xs text-gray-700 truncate">
                      {entry.name || "Không có tên"}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">
                      ({entry.quantity || 0})
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500">Không có dữ liệu</div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Tình trạng kho hàng
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Phân tích tình trạng tồn kho sản phẩm
            </p>
          </div>
          <div className="h-64 mt-4">
            {statisticalData.chart_WareHouseProduct &&
            statisticalData.chart_WareHouseProduct.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statisticalData.chart_WareHouseProduct}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="quantity"
                    nameKey="name"
                  >
                    {statisticalData.chart_WareHouseProduct.map(
                      (entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            INVENTORY_COLORS[index % INVENTORY_COLORS.length]
                          }
                          stroke="none"
                        />
                      )
                    )}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [value, name]}
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      border: "none",
                      padding: "12px",
                    }}
                  />
                  <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    iconType="circle"
                    iconSize={8}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                Không có dữ liệu
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top products table */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Thống kê sản phẩm
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Chi tiết về tất cả sản phẩm
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 bg-white shadow-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="sales">Sắp xếp theo số lượng bán</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          {statisticalData.table_ProductStatistical &&
          statisticalData.table_ProductStatistical.length > 0 ? (
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sản phẩm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã sản phẩm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thể loại
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đã bán
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tồn kho
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doanh thu
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {statisticalData.table_ProductStatistical
                  .slice(
                    0,
                    showAllProducts
                      ? statisticalData.table_ProductStatistical.length
                      : 5
                  )
                  .map((product, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-all duration-150"
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-800">
                          {product.productName || "Không có dữ liệu"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {product.productCode || "Không có dữ liệu"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {product.genre ? (
                            product.genre.split(",").map((genre, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700"
                              >
                                {genre}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-500">
                              Không có dữ liệu
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-800">
                          {product.soldProduct !== undefined &&
                          product.soldProduct !== null
                            ? product.soldProduct
                            : "Không có dữ liệu"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className={`text-sm font-medium ${
                            product.wareHouseProduct === 0
                              ? "text-red-600"
                              : product.wareHouseProduct < 10
                              ? "text-amber-600"
                              : "text-green-600"
                          }`}
                        >
                          {product.wareHouseProduct !== undefined &&
                          product.wareHouseProduct !== null
                            ? product.wareHouseProduct
                            : "Không có dữ liệu"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-800">
                          {product.revenue !== undefined &&
                          product.revenue !== null
                            ? formatCurrency(product.revenue)
                            : "Không có dữ liệu"}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Không có dữ liệu sản phẩm
            </div>
          )}
        </div>
        {!showAllProducts &&
          statisticalData.table_ProductStatistical &&
          statisticalData.table_ProductStatistical.length > 5 && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowAllProducts(true)}
                className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm hover:bg-indigo-100 transition-all"
              >
                Xem tất cả ({statisticalData.table_ProductStatistical.length}{" "}
                sản phẩm)
              </button>
            </div>
          )}
      </div>
    </div>
  );
};

export default StatisticProduct;
