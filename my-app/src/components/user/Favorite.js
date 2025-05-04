import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";

const CardProduct = ({ items, onToggleFavorite }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((product) => (
        <div
          key={product.id}
          className="border rounded-lg p-4 shadow-md hover:shadow-lg transition flex flex-col"
        >
          <img
            src={product.productImage || "/placeholder.svg"}
            alt={product.productName}
            className="w-full h-48 object-cover rounded-md mb-2"
          />
          <h3 className="text-md font-medium mb-2">{product.productName}</h3>
          <p className="text-gray-700 mb-2">
            {(
              product.productPrice - (product.promotionValue || 0)
            ).toLocaleString()}{" "}
            đ
          </p>
          <button
            onClick={() => onToggleFavorite(product.productId)}
            className="mt-auto px-4 py-2 flex items-center justify-center text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
          >
            <i
              className={`bi ${
                true ? "bi-heart-fill" : "bi-heart"
              } text-lg mr-2`}
            ></i>
            <span>Xóa yêu thích</span>
          </button>
        </div>
      ))}
    </div>
  );
};

const Favorite = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/user/favorite/list");
      if (
        response.status === 200 &&
        response.data.status === true &&
        Array.isArray(response.data.data)
      ) {
        setProducts(response.data.data);
      } else {
        toast.error(
          response.data.message || "Không thể tải danh sách yêu thích"
        );
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Vui lòng đăng nhập để xem danh sách yêu thích");
        navigate("/login");
      } else {
        toast.error(
          error.response?.data?.message || "Lỗi khi tải danh sách yêu thích"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = async (productId) => {
    if (!productId) {
      toast.error("ID sản phẩm không hợp lệ");
      return;
    }
    try {
      const response = await axiosInstance.post(
        `/user/favorite/add-and-remove?productId=${productId}`
      );
      if (response.status === 200 && response.data.status === true) {
        toast.success(response.data.message);
        fetchProducts(); // Làm mới danh sách
      } else {
        toast.error(response.data.message || "Không thể thay đổi yêu thích");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Vui lòng đăng nhập để sử dụng tính năng này");
        navigate("/login");
      } else {
        toast.error(
          error.response?.data?.message || "Lỗi khi thay đổi yêu thích"
        );
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-lg font-semibold mb-4">Sản phẩm yêu thích</h2>
      {isLoading ? (
        <p className="text-center">Đang tải...</p>
      ) : products.length === 0 ? (
        <p className="text-center">Chưa có sản phẩm yêu thích nào</p>
      ) : (
        <CardProduct items={products} onToggleFavorite={handleToggleFavorite} />
      )}
    </div>
  );
};

export default Favorite;
