import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Select from "react-select";
import { getToken } from "../../utils/cookie";
import { showErrorToast, showSuccessToast } from "../../utils/Toast";
import Loading from "../../utils/Loading";

const AddProduct = () => {
  // ================== useState ==================
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const page = searchParams.get("page") || "1";
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "DESC";

  // Mock data for options
  const [authorOptions, setAuthorOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [publisherOptions, setPublisherOptions] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    weight: 0,
    price: 0,
    quantity: 0,
    categories: [],
    authors: [],
    publisher: {},
    images: [],
    active: true,
  });
  
  // ================== useEffect (Fetching initial data) ==================
  useEffect(() => {
    const fetchAllData = async () => {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      };

      try {
        const [authorsRes, publishersRes, genresRes] = await Promise.all([
          axios.get("http://localhost:8080/api/seller/authorList", { headers }),
          axios.get("http://localhost:8080/api/seller/publisherList", {
            headers,
          }),
          axios.get("http://localhost:8080/api/seller/genresList", { headers }),
        ]);

        setAuthorOptions(mapToSelectOptions(authorsRes.data.data.arrayList));
        setPublisherOptions(
          mapToSelectOptions(publishersRes.data.data.arrayList)
        );
        setCategoryOptions(mapToSelectOptions(genresRes.data.data.arrayList));
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchAllData();
  }, []);

  // ================== mapToSelectOptions ==================
  const mapToSelectOptions = (list) => {
    if (!Array.isArray(list)) return [];
    return list.map((item) => ({ value: item.id, label: item.name }));
  };

  // ================== handleInputChange ==================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["price", "weight", "quantity"].includes(name)
        ? Number(value)
        : value,
    }));
  };

  // ================== handleBackToList ==================
  const handleBackToList = () => {
    navigate(`/seller/products?page=${page}&searchTerm=${search}&sort=${sort}`);
  };

  // ================== handleSelectChange ==================
  const handleSelectChange = (selectedOptions, { name }) => {
    setFormData((prev) => ({
      ...prev,
      [name]: selectedOptions,
    }));
  };

  // ================== handleImageChange ==================
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
    setErrors((prev) => ({ ...prev, images: null }));
  };

  // ================== extractIds ==================
  const extractIds = (items) => items.map((item) => item.value);

  // ================== handleSubmit ==================
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const productData = {
      name: formData.title,
      description: formData.description,
      weight: formData.weight,
      price: formData.price,
      quantity: formData.quantity,
      authors_id: extractIds(formData.authors),
      genres_id: extractIds(formData.categories),
      publisher_id: formData.publisher.value,
      active: formData.active,
    };

    const formDataToSend = new FormData();
    formDataToSend.append(
      "product",
      new Blob([JSON.stringify(productData)], {
        type: "application/json",
      })
    );

    // Add images to form data
    if (formData.images?.length) {
      formData.images.forEach((image) =>
        formDataToSend.append("images", image)
      );
    }

    // Send request to create or update the product
    fetch("http://localhost:8080/api/seller/productCreate", {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formDataToSend,
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 400 && data?.data) {
          setErrors(data.data.errorMap);
        }
        return data;
      })
      .then((data) => {
        setIsLoading(false);
        if (data.status) {
          data.message.split("\n").forEach((line) => {
            if (line.toLowerCase().includes("error")) {
              showErrorToast(line.replace(/error:/i, "").trim());
            } else {
              showSuccessToast(line);
            }
          });
          handleBackToList();
        } else {
          showErrorToast(data.message.replace(/error:/i, "").trim());
        }
      })
      .catch((error) => {
        setIsLoading(false);
        showErrorToast(error.message);
      });
  };

  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="my-6">
      {/* Header Section */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Thêm Sản Phẩm Mới
        </h1>
        <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
          Điền đầy đủ thông tin để thêm sách mới vào cửa hàng của bạn
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Basic Information Section */}
          <div className="p-10">
            <div className="space-y-10">
              <div>
                <div className="flex items-center space-x-2 mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Thông tin cơ bản
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Thông tin chính về cuốn sách của bạn.
                    </p>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-6">
                  {/* Tên sách */}
                  <div className="col-span-full ">
                    <label className="block text-sm font-semibold text-gray-900">
                      Tên sách <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 transition-all duration-200 sm:text-sm"
                        placeholder="Nhập tên sách..."
                        required
                      />
                      {errors.name && (
                        <div className="text-red-500 text-sm mt-1">
                          {errors.name} {/* Hiển thị thông báo lỗi */}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Thông tin chi tiết */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-900">
                      Cân nặng (gram) <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        className="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 transition-all duration-200 sm:text-sm"
                        placeholder="0"
                        min="0"
                        required
                      />
                      {errors.weight && (
                        <div className="text-red-500 text-sm mt-1">
                          {errors.weight} {/* Hiển thị thông báo lỗi */}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-900">
                      Số lượng <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        className="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 transition-all duration-200 sm:text-sm"
                        placeholder="0"
                        min="0"
                        required
                      />
                      {errors.quantity && (
                        <div className="text-red-500 text-sm mt-1">
                          {errors.quantity} {/* Hiển thị thông báo lỗi */}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-900">
                      Giá (VNĐ) <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 transition-all duration-200 sm:text-sm"
                        placeholder="0"
                        min="0"
                        required
                      />
                      {errors.price && (
                        <div className="text-red-500 text-sm mt-1">
                          {errors.price} {/* Hiển thị thông báo lỗi */}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* Mô tả */}
              <div className="col-span-full">
                <label className="block text-sm font-semibold text-gray-900">
                  Mô tả <span className="text-red-500">*</span>
                </label>
                <div className="mt-2">
                  <textarea
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 transition-all duration-200 sm:text-sm"
                    placeholder="Mô tả chi tiết về cuốn sách..."
                    required
                  />
                  {errors.description && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.description} {/* Hiển thị thông báo lỗi */}
                    </div>
                  )}
                </div>
              </div>
              {/* Phân loại Section */}
              <div className="pt-10 border-t border-gray-200">
                <div className="flex items-center space-x-2 mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Phân loại
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Chọn thể loại và thông tin phân loại cho cuốn sách.
                    </p>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 ">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900">
                      Thể loại <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2 border">
                      <Select
                        isMulti
                        name="categories"
                        options={categoryOptions}
                        value={formData.categories.id}
                        onChange={(selected) =>
                          handleSelectChange(selected, {
                            name: "categories",
                          })
                        }
                        className="basic-multi-select"
                        classNamePrefix="select"
                        placeholder="Chọn thể loại..."
                        styles={{
                          control: (base) => ({
                            ...base,
                            minHeight: "45px",
                            borderRadius: "0.5rem",
                            border: "none",
                            boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                            "&:hover": {
                              borderColor: "#2563eb",
                            },
                          }),
                        }}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900">
                      Tác giả <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2 border">
                      <Select
                        isMulti
                        name="authors"
                        options={authorOptions}
                        value={formData.authors.id}
                        onChange={(selected) =>
                          handleSelectChange(selected, {
                            name: "authors",
                          })
                        }
                        className="basic-multi-select"
                        classNamePrefix="select"
                        placeholder="Chọn tác giả..."
                        styles={{
                          control: (base) => ({
                            ...base,
                            minHeight: "45px",
                            borderRadius: "0.5rem",
                            border: "none",
                            boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                            "&:hover": {
                              borderColor: "#2563eb",
                            },
                          }),
                        }}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900">
                      Nhà xuất bản <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2 border">
                      <Select
                        name="publisher"
                        options={publisherOptions}
                        value={formData.publisher}
                        onChange={(selected) =>
                          handleSelectChange(selected, {
                            name: "publisher",
                          })
                        }
                        className="basic-single-select"
                        classNamePrefix="select"
                        placeholder="Chọn nhà xuất bản..."
                        isSearchable
                        styles={{
                          control: (base) => ({
                            ...base,
                            minHeight: "45px",
                            borderRadius: "0.5rem",
                            border: "1px solid #ccc",
                            boxShadow: "none",
                            backgroundColor: "#fff",
                            "&:hover": {
                              borderColor: "#2563eb",
                            },
                          }),
                          menu: (base) => ({
                            ...base,
                            borderRadius: "0.5rem",
                            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                            backgroundColor: "#fff",
                          }),
                          option: (
                            base,
                            { isFocused, isSelected, isActive }
                          ) => ({
                            ...base,
                            backgroundColor: isActive
                              ? "#ff4d4d" // Màu đỏ khi active
                              : isFocused
                              ? "#cfe4ff"
                              : "#fff",
                            "&:active": {
                              backgroundColor: "#B2D4FF",
                            },
                            color: "black",
                          }),
                        }}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Hình ảnh Section */}
              <div className="pt-10 border-t border-gray-200">
                <div className="flex items-center space-x-2 mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Hình ảnh sản phẩm
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Thêm hình ảnh chất lượng cao để thu hút người mua.
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 py-10 transition-colors duration-200 hover:border-blue-400">
                    <div className="text-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="mx-auto h-12 w-12 text-gray-400"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                        />
                      </svg>
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label
                          htmlFor="images"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500 transition-colors duration-200"
                        >
                          <span>Tải ảnh lên</span>
                          <input
                            id="images"
                            name="images"
                            type="file"
                            multiple
                            className="sr-only"
                            onChange={handleImageChange}
                            accept="image/*"
                          />
                        </label>

                        <p className="pl-1">hoặc kéo thả vào đây</p>
                      </div>
                      <p className="text-xs leading-5 text-gray-500">
                        PNG, JPG, GIF tối đa 10MB
                      </p>
                    </div>
                  </div>
                  {errors.images && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.images}{" "}
                    </div>
                  )}
                  {formData.images.length > 0 && (
                    <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="group relative">
                          <div className="aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Preview ${index + 1}`}
                              className="pointer-events-none object-cover group-hover:opacity-75 transition-opacity duration-200"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  images: prev.images.filter(
                                    (_, i) => i !== index
                                  ),
                                }));
                              }}
                              className="absolute right-2 top-2 rounded-full bg-gray-900/70 p-1.5 text-white opacity-0 shadow-sm transition-opacity duration-200 hover:bg-gray-900 group-hover:opacity-100"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-5 h-5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-span-full">
                <label className="block text-sm font-semibold text-gray-900">
                  Trạng thái
                  <span className="text-red-500">*</span>
                </label>
                <div className="mt-2 flex items-center">
                  <button
                    type="button"
                    id="active"
                    onClick={() =>
                      handleInputChange({
                        target: {
                          name: "active",
                          value: !formData.active,
                        },
                      })
                    }
                    className={`relative inline-flex items-center h-8 rounded-full w-40 transition-colors duration-200 ease-in-out ${
                      formData.active ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`absolute inset-0 flex items-center justify-center text-sm text-white transition-opacity duration-200 ease-in-out ${
                        formData.active ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      Đang bán
                    </span>
                    <span
                      className={`absolute inset-0 flex items-center justify-center text-sm text-gray-800 transition-opacity duration-200 ease-in-out ${
                        !formData.active ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      Ngừng bán
                    </span>
                    <span
                      className={`inline-block w-6 h-6 rounded-full transform transition-transform duration-200 ease-in-out ${
                        formData.active
                          ? "translate-x-32 bg-white"
                          : "translate-x-2 bg-white"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="px-10 py-6 bg-gray-50 flex items-center justify-end gap-x-6">
            <button
              onClick={handleBackToList}
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-700 transition-colors duration-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex items-center rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Thêm sản phẩm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
