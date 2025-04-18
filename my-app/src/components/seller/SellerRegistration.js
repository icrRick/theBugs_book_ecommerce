"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SellerInfoStep from "./SellerInfoStep";
import IdRecognitionStep from "./IdRecognitionStep";
import ShopInfoStep from "./ShopInfoStep";
import ShopAddressStep from "./ShopAddressStep";
import axiosInstance from "../../utils/axiosInstance";
import Loading from "../../utils/Loading";

const SellerRegistration = () => {
      const [isLoading, setIsLoading] = useState(false);
      const navigate = useNavigate();
      const [currentStep, setCurrentStep] = useState(1);

      const [accountInfo, setAccountInfo] = useState({
            fullName: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
      });

      const [idRecognition, setIdRecognition] = useState({
            idType: "cccd",
            idNumber: "",
            idIssueDate: "",
            idIssuedBy: "",
            dob: "",
            gender: "",
            idFrontImage: null,
            idBackImage: null,
            idRecognitionData: null,
      });

      const [personalInfo, setPersonalInfo] = useState({
            bankName: "",
            bankAccount: "",
            bankAccountName: "",
      });

      const [shopInfo, setShopInfo] = useState({
            shop_slug: "",
            name: "",
            description: "",
            bankOwnerName: "",
            bankOwnerNumber: "",
            bankProvideName: "",
      });

      const [shopAddress, setShopAddress] = useState({
            provinceId: "",
            provinceName: "",
            districtId: "",
            districtName: "",
            wardId: "",
            wardName: "",
            address: "",
            isHeadquarter: true,
      });

      const [isSubmitting, setIsSubmitting] = useState(false);
      const [errors, setErrors] = useState({});
      const [registrationComplete, setRegistrationComplete] = useState(false);
      const [isProcessingId, setIsProcessingId] = useState(false);

      useEffect(() => {
            const fetchUserData = async () => {
                  axiosInstance
                        .get("api/users/me")
                        .then((response) => {
                              setAccountInfo(response.data);
                              setCurrentStep(2);
                        })
                        .catch(() => {
                              setCurrentStep(1);
                        });
            };
            fetchUserData();
      }, []);
      const handleSubmitAll = async () => {
            const formDataToSend = new FormData();
            console.log("DATA: ");
            console.log(shopInfo);
            console.log(shopAddress);
            console.log(accountInfo);
            
            formDataToSend.append(
                  "shopInfor",
                  new Blob([JSON.stringify(shopInfo)], {
                        type: "application/json",
                  })
            );
            formDataToSend.append(
                  "addressInfor",
                  new Blob([JSON.stringify(shopAddress)], {
                        type: "application/json",
                  })
            );
            formDataToSend.append(
                  "accountInfor",
                  new Blob([JSON.stringify(accountInfo)], {
                        type: "application/json",
                  })
            );
            axiosInstance
                  .post("api/users/register-seller", formDataToSend, {
                        headers: {
                              "Content-Type": "multipart/form-data",
                        },
                  })
                  .then((response) => {
                        console.log(response);
                  })
                  .catch((error) => {
                        console.log(error);
                  });
      };
      const handleAccountInfoChange = (e) => {
            const { name, value, type, checked } = e.target;

            setAccountInfo((prev) => ({
                  ...prev,
                  [name]: type === "checkbox" ? checked : value,
            }));

            clearFieldError(name);
      };

      const handleIdRecognitionChange = (e) => {
            const { name, value, type, files } = e.target;

            if (
                  type === "file" &&
                  (name === "idFrontImage" || name === "idBackImage")
            ) {
                  setIdRecognition((prev) => ({
                        ...prev,
                        [name]: files[0],
                  }));
            } else {
                  setIdRecognition((prev) => ({
                        ...prev,
                        [name]: value,
                  }));
            }

            clearFieldError(name);
      };

      const handleShopInfoChange = (e) => {
            const { name, value, type, files } = e.target;

            if (
                  type === "file" &&
                  (name === "shopLogo" || name === "shopBanner")
            ) {
                  setShopInfo((prev) => ({
                        ...prev,
                        [name]: files[0],
                  }));
            } else {
                  setShopInfo((prev) => ({
                        ...prev,
                        [name]: value,
                  }));
            }

            clearFieldError(name);
      };

      const handleShopAddressChange = (name, value) => {
            setShopAddress((prev) => ({
                  ...prev,
                  [name]: value, // value phải là number
            }));
            clearFieldError(name);
      };
      // Hàm xoá lỗi của từng field khi người dùng sửa đổi
      const clearFieldError = (fieldName) => {
            if (errors[fieldName]) {
                  setErrors((prev) => ({
                        ...prev,
                        [fieldName]: "",
                  }));
            }
      };

      // Xử lý thay đổi địa chỉ
      const handleAddressChange = (field, value, displayValue = "") => {
            setShopAddress({
                  ...shopAddress,
                  [field]: value,
                  [`${field.replace("Id", "Name")}`]: displayValue,
            });

            // Clear error when field is edited
            if (errors[field]) {
                  setErrors({
                        ...errors,
                        [field]: "",
                  });
            }
      };

      // Xử lý dữ liệu nhận diện CCCD/CMND
      const handleIdRecognitionData = (data) => {
            if (data) {
                  setIdRecognition((prev) => ({
                        ...prev,
                        idType: data.type,
                        idRecognitionData: data,
                        idNumber: data.id || prev.idNumber,
                        idIssueDate:
                              convertToDate(data.issue_date) ||
                              prev.idIssueDate, // Chỉnh sửa trường "issue_date"
                        idIssuedBy: data.issue_loc || prev.idIssuedBy, // Chỉnh sửa trường "issue_loc"
                        dob: convertToDate(data.dob) || prev.dob,
                        gender: data.sex || prev.gender, // Chỉnh sửa trường "sex"
                        features: data.features || prev.features, // Thêm trường "features"
                        address: data.address || prev.address, // Thêm trường "address"
                        addressEntities:
                              data.address_entities || prev.addressEntities, // Thêm trường "address_entities"
                        doe: convertToDate(data.doe) || prev.doe, // Thêm trường "doe"
                        nationality: data.nationality || prev.nationality, // Thêm trường "nationality"
                        name: data.name || prev.name, // Thêm trường "name"
                  }));
                  setAccountInfo((prev) => ({
                        ...prev,
                        dob: convertToDate(data.dob),
                        cccd: data.id,
                  }));
                  console.log(accountInfo);
            }
      };
      function convertToDate(dateString) {
            const [day, month, year] = dateString.split("/"); // Tách chuỗi theo dấu "/"
            const date = new Date(`${year}-${month}-${day}`); // Tạo đối tượng Date theo định dạng "yyyy-mm-dd"
            return date.toISOString().split("T")[0]; // Chuyển đổi sang định dạng "yyyy-MM-dd"
      }
      useEffect(() => {
            console.log("IDRecognition: ");
            console.log(idRecognition);
      }, [idRecognition]);

      // Xử lý chuyển bước tiếp theo
      const handleNext = () => {
            window.scrollTo(0, 0);
            setCurrentStep(currentStep + 1);
      };

      // Render các bước
      const renderStep = () => {
            switch (currentStep) {
                  case 1:
                        return (
                              <SellerInfoStep
                                    accountInfo={accountInfo}
                                    handleChange={handleAccountInfoChange}
                                    errors={errors}
                                    handleNext={handleNext}
                              />
                        );
                  case 2:
                        return (
                              <IdRecognitionStep
                                    idRecognition={idRecognition}
                                    handleChange={handleIdRecognitionChange}
                                    handleIdRecognitionData={
                                          handleIdRecognitionData
                                    }
                                    isProcessingId={isProcessingId}
                                    setIsProcessingId={setIsProcessingId}
                                    errors={errors}
                                    handleNext={handleNext}
                              />
                        );
                  case 3:
                        return (
                              <ShopInfoStep
                                    shopInfo={shopInfo}
                                    handleChange={handleShopInfoChange}
                                    handleNext={handleNext}
                                    errors={errors}
                              />
                        );
                  case 4:
                        return (
                              <ShopAddressStep
                                    shopInfo={shopInfo}
                                    shopAddress={shopAddress}
                                    handleChange={handleShopAddressChange}
                                    handleAddressChange={handleAddressChange}
                                    handleSubmitAll={handleSubmitAll}
                                    errors={errors}
                              />
                        );
                  default:
                        return (
                              <SellerInfoStep
                                    accountInfo={accountInfo}
                                    handleChange={handleAccountInfoChange}
                                    errors={errors}
                              />
                        );
            }
      };
      if (isLoading) {
            return <Loading />;
      }
      // Nếu đăng ký hoàn tất
      if (registrationComplete) {
            return (
                  <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                              <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-10 w-10 text-green-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                              >
                                    <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M5 13l4 4L19 7"
                                    />
                              </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                              Đăng ký thành công!
                        </h2>
                        <p className="text-gray-600 mb-8">
                              Cảm ơn bạn đã đăng ký trở thành người bán trên nền
                              tảng của chúng tôi. Chúng tôi sẽ xem xét thông tin
                              của bạn và thông báo kết quả trong thời gian sớm
                              nhất.
                        </p>
                        <p className="text-gray-500">
                              Bạn sẽ được chuyển hướng đến trang quản lý sau vài
                              giây...
                        </p>
                  </div>
            );
      }

      return (
            <div className="max-w-4xl mx-auto">
                  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-6">
                              Đăng ký trở thành người bán
                        </h1>

                        {/* Progress Bar */}
                        <div className="mb-8">
                              <div className="flex items-center justify-between">
                                    <div className="flex flex-col items-center">
                                          <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                      currentStep >= 1
                                                            ? "bg-blue-500 text-white"
                                                            : "bg-gray-200 text-gray-500"
                                                }`}
                                          >
                                                1
                                          </div>
                                          <span className="text-sm mt-2">
                                                Đăng ký tài khoản
                                          </span>
                                    </div>

                                    <div
                                          className={`flex-1 h-1 mx-2 ${
                                                currentStep >= 2
                                                      ? "bg-blue-500"
                                                      : "bg-gray-200"
                                          }`}
                                    ></div>

                                    <div className="flex flex-col items-center">
                                          <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                      currentStep >= 2
                                                            ? "bg-blue-500 text-white"
                                                            : "bg-gray-200 text-gray-500"
                                                }`}
                                          >
                                                2
                                          </div>
                                          <span className="text-sm mt-2">
                                                Xác minh danh tính
                                          </span>
                                    </div>

                                    <div
                                          className={`flex-1 h-1 mx-2 ${
                                                currentStep >= 3
                                                      ? "bg-blue-500"
                                                      : "bg-gray-200"
                                          }`}
                                    ></div>

                                    <div className="flex flex-col items-center">
                                          <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                      currentStep >= 3
                                                            ? "bg-blue-500 text-white"
                                                            : "bg-gray-200 text-gray-500"
                                                }`}
                                          >
                                                3
                                          </div>
                                          <span className="text-sm mt-2">
                                                Thông tin cửa hàng
                                          </span>
                                    </div>

                                    <div
                                          className={`flex-1 h-1 mx-2 ${
                                                currentStep >= 4
                                                      ? "bg-blue-500"
                                                      : "bg-gray-200"
                                          }`}
                                    ></div>

                                    <div className="flex flex-col items-center">
                                          <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                      currentStep >= 4
                                                            ? "bg-blue-500 text-white"
                                                            : "bg-gray-200 text-gray-500"
                                                }`}
                                          >
                                                4
                                          </div>
                                          <span className="text-sm mt-2">
                                                Địa chỉ cửa hàng
                                          </span>
                                    </div>
                              </div>
                        </div>

                        <div>{renderStep()}</div>
                  </div>
            </div>
      );
};

export default SellerRegistration;
