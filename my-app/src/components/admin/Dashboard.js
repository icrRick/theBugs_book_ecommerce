import React, { useState, useEffect } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import axiosInstance from '../../utils/axiosInstance';
import Loading from '../../utils/Loading';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);



const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);


  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/admin/dashboard');
      if (response.status === 200 && response.data.status === true) {
        setData(response.data.data);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

  const shopStatusData = {
    labels: ['Đang hoạt động', 'Đã khóa', 'Chờ duyệt'],
    datasets: [
      {
        data: [data.activeTrueShops, data.statusTrueShops, data.approveNullShops],
        backgroundColor: [
          'rgba(75, 192, 192, 0.5)',  // Đang hoạt động - xanh lá
          'rgba(255, 99, 132, 0.5)',  // Đã khóa - đỏ
          'rgba(255, 205, 86, 0.5)'   // Chờ duyệt - vàng
        ],
        borderColor: [
          'rgb(75, 192, 192)',
          'rgb(255, 99, 132)',
          'rgb(255, 205, 86)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const productStatusData = {
    labels: ['Đang hoạt động', 'Đã khóa', 'Chờ duyệt'],
    datasets: [
      {
        data: [data.activeTrueProducts, data.statusTrueProducts, data.approveNullProducts],
        backgroundColor: [
          'rgba(75, 192, 192, 0.5)',  // Đang hoạt động - xanh lá
          'rgba(255, 99, 132, 0.5)',  // Đã khóa - đỏ
          'rgba(255, 205, 86, 0.5)'   // Chờ duyệt - vàng
        ],
        borderColor: [
          'rgb(75, 192, 192)',
          'rgb(255, 99, 132)',
          'rgb(255, 205, 86)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const shopPieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          },
          usePointStyle: true,
          pointStyle: 'circle',
          generateLabels: function(chart) {
            const datasets = chart.data.datasets;
            return chart.data.labels.map(function(label, i) {
              const meta = chart.getDatasetMeta(0);
              const style = meta.controller.getStyle(i);
              const value = datasets[0].data[i];
              const total = data.totalShops;
              const percentage = Math.round((value / total) * 100);
              
              return {
                text: `${label}: ${value}/${total} (${percentage}%)`,
                fillStyle: style.backgroundColor,
                strokeStyle: style.borderColor,
                lineWidth: style.borderWidth,
                hidden: !chart.getDataVisibility(i),
                index: i
              };
            });
          }
        },
        onClick: null
      },
      title: {
        display: true,
        text: 'Trạng thái',
        font: {
          size: 16,
          family: "'Inter', sans-serif"
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = data.totalShops;
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value}/${total} (${percentage}%)`;
          },
          title: function(context) {
            return 'Cửa hàng';
          }
        }
      }
    },
    interaction: {
      mode: 'nearest',
      intersect: false
    },
    onClick: null
  };

  const productPieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          },
          usePointStyle: true,
          pointStyle: 'circle',
          generateLabels: function(chart) {
            const datasets = chart.data.datasets;
            return chart.data.labels.map(function(label, i) {
              const meta = chart.getDatasetMeta(0);
              const style = meta.controller.getStyle(i);
              const value = datasets[0].data[i];
              const total = data.totalProducts;
              const percentage = Math.round((value / total) * 100);
              
              return {
                text: `${label}: ${value}/${total} (${percentage}%)`,
                fillStyle: style.backgroundColor,
                strokeStyle: style.borderColor,
                lineWidth: style.borderWidth,
                hidden: !chart.getDataVisibility(i),
                index: i
              };
            });
          }
        },
        onClick: null
      },
      title: {
        display: true,
        text: 'Trạng thái',
        font: {
          size: 16,
          family: "'Inter', sans-serif"
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = data.totalProducts;
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value}/${total} (${percentage}%)`;
          },
          title: function(context) {
            return 'Sản phẩm';
          }
        }
      }
    },
    interaction: {
      mode: 'nearest',
      intersect: false
    },
    onClick: null
  };

  // Dữ liệu cho biểu đồ cột
  const shopBarData = {
    labels: ['Đang hoạt động', 'Đã khóa', 'Chờ duyệt'],
    datasets: [
      {
        data: [data.activeTrueShops, data.statusTrueShops, data.approveNullShops],
        backgroundColor: [
          'rgba(75, 192, 192, 0.5)',  // Đang hoạt động - xanh lá
          'rgba(255, 99, 132, 0.5)',  // Đã khóa - đỏ
          'rgba(255, 205, 86, 0.5)'   // Chờ duyệt - vàng
        ],
        borderColor: [
          'rgb(75, 192, 192)',
          'rgb(255, 99, 132)',
          'rgb(255, 205, 86)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const productBarData = {
    labels: ['Đang hoạt động', 'Đã khóa', 'Chờ duyệt'],
    datasets: [
      {
        data: [data.activeTrueProducts, data.statusTrueProducts, data.approveNullProducts],
        backgroundColor: [
          'rgba(75, 192, 192, 0.5)',  // Đang hoạt động - xanh lá
          'rgba(255, 99, 132, 0.5)',  // Đã khóa - đỏ
          'rgba(255, 205, 86, 0.5)'   // Chờ duyệt - vàng
        ],
        borderColor: [
          'rgb(75, 192, 192)',
          'rgb(255, 99, 132)',
          'rgb(255, 205, 86)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Tùy chọn cho biểu đồ cột
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = data.totalShops;
            return `${label}: ${value}/${total}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  const productBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = data.totalProducts;
            return `${label}: ${value}/${total}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  return (
    <>
      {loading && <Loading />}
      <div className="my-4 bg-white rounded-lg shadow-sm overflow-hidden max-w-full">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <a
                        href="#"
                        className="hover:text-gray-700 transition-colors duration-200"
                      >
                        Trang chủ
                      </a>


                    </div>

                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 truncate">
                      Trang chủ
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                      Tổng quan về hệ thống quản lý sách
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Thống kê chi tiết */}
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
            <div className="rounded-lg border border-gray-300 p-4 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-500 font-medium">Tổng thể loại</p>
                  <p className="text-xl font-bold text-gray-800">{data.totalGenres}</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-300 p-4 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center">
                <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-500 font-medium">Tổng cửa hàng</p>
                  <p className="text-xl font-bold text-gray-800">{data.totalShops}</p>
                </div>
              </div>
            </div>
          

            <div className="rounded-lg border border-gray-300 p-4 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center">
                <div className="p-2 rounded-xl bg-yellow-50 text-yellow-600">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-500 font-medium">Tổng tác giả</p>
                  <p className="text-xl font-bold text-gray-800">{data.totalAuthors}</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-300 p-4 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center">
                <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-500 font-medium">Tổng nhà xuất bản</p>
                  <p className="text-xl font-bold text-gray-800">{data.totalPublishers}</p>
                </div>
              </div>
            </div>

          
            <div className="rounded-lg border border-gray-300 p-4 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center">
                <div className="p-2 rounded-xl bg-pink-50 text-pink-600">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-500 font-medium">Tổng sản phẩm</p>
                  <p className="text-xl font-bold text-gray-800">{data.totalProducts}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Biểu đồ cột */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="rounded-lg border border-gray-300 p-6 transition-all duration-300">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
                Trạng thái cửa hàng 
              </h3>
              <div className="h-[300px] sm:h-[400px]">
                <Bar data={shopBarData} options={barOptions} />
              </div>
            </div>
            <div className="rounded-lg border border-gray-300 p-6 transition-all duration-300">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
                Trạng thái sản phẩm 
              </h3>
              <div className="h-[300px] sm:h-[400px]">
                <Bar data={productBarData} options={productBarOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
