import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import CardProduct from "./CardProduct";

const Favorite = () => {
  const [products, setProducts] = useState([]);
  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get("/user/favorite/list");
      if (response.status === 200 && response.data.status === true) {
        setProducts(response.data.data);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  }
  useEffect(() => {
    fetchProducts();
  }, []);
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-lg font-semibold mb-4">Sản phẩm yêu thích</h2>
      <CardProduct items={products} />
    </div>
  );
};

export default Favorite;
