"use client";

import { useState, useRef } from "react";
import axiosInstance from "../../utils/axiosInstance";
import VideoCapture from "../user/VideoCaptured";
import { Pause, Play, RefreshCw, Maximize2 } from "lucide-react";
import { showErrorToast, showSuccessToast } from "../../utils/Toast";
import Loading from "../../utils/Loading";

const IdRecognitionStep = ({
  idRecognition, // Nhận dữ liệu từ trang chính
  handleChange,
  handleIdRecognitionData,
  isProcessingId,
  setIsProcessingId,
  handleNext,
  errors,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlayPause = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const replayVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };
  const [frontPreview, setFrontPreview] = useState(
    idRecognition?.idFrontImage
      ? URL.createObjectURL(idRecognition.idFrontImage)
      : null
  );
  const [backPreview, setBackPreview] = useState(
    idRecognition?.idBackImage
      ? URL.createObjectURL(idRecognition.idBackImage)
      : null
  );
  const [recognitionStatus, setRecognitionStatus] = useState(
    idRecognition?.idRecognitionData ? "success" : null
  );
  const [recognitionMessage, setRecognitionMessage] = useState("");

  const frontInputRef = useRef(null);
  const backInputRef = useRef(null);

  const [videoFile, setVideoFile] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleVideoCaptured = (file) => {
    setVideoFile(file);
    console.log("FILE");
    console.log(file);
    handleClosePopup();
  };

  // Xử lý tải lên ảnh mặt trước CCCD/CMND
  const handleFrontImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleChange({
        target: {
          name: "idFrontImage",
          value: file,
          type: "file",
          files: e.target.files,
        },
      });
      setFrontPreview(URL.createObjectURL(file));
      // Reset trạng thái nhận diện khi tải ảnh mới
      setRecognitionStatus(null);
      handleIdRecognitionData(null);
    }
  };

  // Xử lý tải lên ảnh mặt sau CCCD/CMND
  const handleBackImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleChange({
        target: {
          name: "idBackImage",
          value: file,
          type: "file",
          files: e.target.files,
        },
      });
      setBackPreview(URL.createObjectURL(file));
      // Reset trạng thái nhận diện khi tải ảnh mới
      setRecognitionStatus(null);
      handleIdRecognitionData(null);
    }
  };
  const handleSubmitStep2 = async () => {
    if (!idRecognition?.idFrontImage || !idRecognition?.idBackImage) {
      showErrorToast("Vui lòng tải lên ảnh mặt trước và sau của cmnd");
      return;
    }
    if (!videoFile) {
      showErrorToast("Vui lòng xác minh khuôn mặt trước khi qua bước kế tiếp");
      return;
    }
    setIsLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append("image", idRecognition.idFrontImage);
    formDataToSend.append("video", videoFile);
    axiosInstance
      .post("api/users/face-match", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.data.data.code === "200") {
          showSuccessToast("Nhận diện khuôn mặt thành công");
          handleNext();
        } else {
          setVideoFile(null);
          showErrorToast(response.data.data.message);
          showErrorToast(
            "Nhận diện khuôn mặt thất bại vui lòng kiểm tra lại video"
          );
        }
      })
      .catch((error) => {
        showErrorToast(
          "Nhận diện khuôn mặt thất bại vui lòng kiểm tra lại video"
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Xử lý nhận diện CCCD/CMND
  const handleRecognizeId = async () => {
    //validate
    if (!idRecognition?.idFrontImage || !idRecognition?.idBackImage) {
      setRecognitionStatus("error");
      setRecognitionMessage(
        "Vui lòng tải lên đầy đủ ảnh mặt trước và mặt sau CCCD/CMND"
      );
      return;
    }

    setIsLoading(true);
    setIsProcessingId(true);
    setRecognitionStatus("processing");
    setRecognitionMessage("Đang xử lý nhận diện giấy tờ...");
    //set up formdata
    const formDataToSend = new FormData();
    formDataToSend.append("images", idRecognition.idFrontImage);
    formDataToSend.append("images", idRecognition.idBackImage);
    //request api
    axiosInstance
      .post("/api/users/id-recognition", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        if (response.data.status) {
          // Cập nhật dữ liệu form
          handleIdRecognitionData(response.data.data.data[0]);
          setRecognitionStatus("success");
          setRecognitionMessage(
            "Nhận diện thành công! Thông tin đã được cập nhật tự động."
          );
        } else {
          setRecognitionStatus("error");
          setRecognitionMessage(
            response.errorMessage ||
              "Không thể nhận diện giấy tờ. Vui lòng kiểm tra lại ảnh và thử lại."
          );
        }
      })
      .catch((error) => {
        console.error("Error recognizing ID:", error);
        setRecognitionStatus("error");
        setRecognitionMessage(error.response.data.message);
      })
      .finally(() => {
        setIsLoading(false);
        setIsProcessingId(false);
      });
  };

  return (
    <>
      {isLoading && <Loading />}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Xác minh danh tính
        </h2>
        <p className="text-gray-600 mb-6">
          Vui lòng cung cấp hình ảnh CCCD/CMND để xác minh danh tính của bạn.
          Thông tin sẽ được trích xuất tự động.
        </p>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-500 mt-0.5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h4 className="text-blue-800 font-medium">
                Hướng dẫn chụp ảnh giấy tờ
              </h4>
              <ul className="list-disc list-inside text-sm text-blue-700 mt-1 space-y-1">
                <li>Đặt giấy tờ trên nền phẳng, đủ ánh sáng</li>
                <li>Chụp thẳng, không bị nghiêng, không bị mờ</li>
                <li>Đảm bảo hình ảnh rõ nét, không bị chói sáng</li>
                <li>Hiển thị đầy đủ 4 góc của giấy tờ</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ảnh mặt trước CCCD/CMND */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Mặt trước CCCD/CMND <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              {frontPreview ? (
                <div className="relative">
                  <img
                    src={frontPreview || "/placeholder.svg"}
                    alt="Mặt trước CCCD/CMND"
                    className="w-full h-48 object-contain mx-auto"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFrontPreview(null);
                      handleChange({
                        target: {
                          name: "idFrontImage",
                          value: null,
                        },
                      });
                      // Reset trạng thái nhận diện
                      setRecognitionStatus(null);
                      handleIdRecognitionData(null);
                    }}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
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
                  </button>
                </div>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-gray-400 mx-auto mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <p className="text-gray-500 mb-2">
                    Tải lên ảnh mặt trước CCCD/CMND
                  </p>
                </>
              )}
              <input
                type="file"
                id="front-id-upload"
                ref={frontInputRef}
                accept="image/*"
                onChange={handleFrontImageChange}
                className="hidden"
              />
              <label
                htmlFor="front-id-upload"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer inline-block"
              >
                Chọn ảnh
              </label>
              <p className="text-gray-500 text-xs mt-2">
                PNG, JPG (tối đa 5MB)
              </p>
            </div>
            {errors.idFrontImage && (
              <p className="text-red-500 text-sm mt-1">{errors.idFrontImage}</p>
            )}
          </div>

          {/* Ảnh mặt sau CCCD/CMND */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Mặt sau CCCD/CMND <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              {backPreview ? (
                <div className="relative">
                  <img
                    src={backPreview || "/placeholder.svg"}
                    alt="Mặt sau CCCD/CMND"
                    className="w-full h-48 object-contain mx-auto"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setBackPreview(null);
                      handleChange({
                        target: {
                          name: "idBackImage",
                          value: null,
                        },
                      });
                      // Reset trạng thái nhận diện
                      setRecognitionStatus(null);
                      handleIdRecognitionData(null);
                    }}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
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
                  </button>
                </div>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-gray-400 mx-auto mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <p className="text-gray-500 mb-2">
                    Tải lên ảnh mặt sau CCCD/CMND
                  </p>
                </>
              )}
              <input
                type="file"
                id="back-id-upload"
                ref={backInputRef}
                accept="image/*"
                onChange={handleBackImageChange}
                className="hidden"
              />
              <label
                htmlFor="back-id-upload"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer inline-block"
              >
                Chọn ảnh
              </label>
              <p className="text-gray-500 text-xs mt-2">
                PNG, JPG (tối đa 5MB)
              </p>
            </div>
            {errors.idBackImage && (
              <p className="text-red-500 text-sm mt-1">{errors.idBackImage}</p>
            )}
          </div>
        </div>
        {/* Nút nhận diện */}
        <div className="flex justify-center mt-6">
          <button
            type="button"
            onClick={handleRecognizeId}
            disabled={
              !idRecognition?.idFrontImage ||
              !idRecognition?.idBackImage ||
              isProcessingId
            }
            className={`px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center ${
              !idRecognition?.idFrontImage ||
              !idRecognition?.idBackImage ||
              isProcessingId
                ? "opacity-70 cursor-not-allowed"
                : ""
            }`}
          >
            {isProcessingId && (
              <svg
                className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
            )}
            {isProcessingId ? "Đang xử lý..." : "Nhận diện giấy tờ"}
          </button>
        </div>
        {recognitionStatus && (
          <div
            className={`mt-4 p-4 rounded-lg ${
              recognitionStatus === "success"
                ? "bg-green-50 border border-green-100"
                : recognitionStatus === "error"
                ? "bg-red-50 border border-red-100"
                : "bg-blue-50 border border-blue-100"
            }`}
          >
            <div className="flex items-start">
              {recognitionStatus === "success" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-green-500 mt-0.5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {recognitionStatus === "error" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-red-500 mt-0.5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {recognitionStatus === "processing" && (
                <svg
                  className="animate-spin h-5 w-5 text-blue-500 mt-0.5 mr-2"
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
              )}
              <p
                className={`${
                  recognitionStatus === "success"
                    ? "text-green-700"
                    : recognitionStatus === "error"
                    ? "text-red-700"
                    : "text-blue-700"
                }`}
              >
                {recognitionMessage}
              </p>
            </div>
          </div>
        )}
        {errors.idRecognitionData && (
          <p className="text-red-500 text-sm mt-1">
            {errors.idRecognitionData}
          </p>
        )}
        {videoFile && (
          <>
            <div className="relative w-full max-w-md mx-auto">
              <video
                ref={videoRef}
                src={URL.createObjectURL(videoFile)}
                className="w-full rounded-lg"
                autoPlay
              />

              <div className="flex justify-center gap-4 mt-3">
                <button
                  onClick={togglePlayPause}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={replayVideo}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}

        <div className="flex justify-center mt-4">
          <button
            onClick={handleOpenPopup}
            disabled={!idRecognition?.idNumber} // Chỉ cho click khi có idRecognition hợp lệ
            className={`px-6 py-3 rounded-lg transition-colors flex items-center
      ${
        idRecognition?.idNumber
          ? "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
          : "bg-gray-400 text-gray-200 cursor-not-allowed"
      }
    `}
          >
            Bấm vào đây để xác minh khuôn mặt
          </button>
        </div>
        {videoFile && (
          <div className="mt-4 p-4 rounded-lg bg-green-50 border border-green-200 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-green-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-green-700">
              Đã quay video khuôn mặt thành công!
            </p>
          </div>
        )}
        {videoFile === null && idRecognition?.idNumber && (
          <div className="mt-4 p-4 rounded-lg flex items-center gap-2 bg-yellow-50 border border-yellow-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-yellow-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 8a1 1 0 012 0v2a1 1 0 11-2 0V8zm0 6a1 1 0 112 0 1 1 0 01-2 0z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-yellow-700 font-medium">
              Vui lòng quay xác minh khuôn mặt!
            </p>
          </div>
        )}

        <div className="border-t border-gray-200 pt-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Thông tin từ giấy tờ
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Loại giấy tờ */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Loại giấy tờ <span className="text-red-500">*</span>
              </label>
              <select
                name="idType"
                value={idRecognition?.idType || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300"
                disabled
              >
                <option value="chip_back">Căn cước công dân</option>
                <option value="chip_front">Căn cước công dân</option>
                <option value="cmnd">Chứng minh nhân dân</option>
                <option value="passport">Hộ chiếu</option>
              </select>
            </div>

            {/* Số giấy tờ */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Số CCCD/CMND <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="idNumber"
                value={idRecognition?.idNumber || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300 bg-gray-50"
                placeholder="Số CCCD/CMND"
                readOnly
              />
            </div>

            {/* Họ tên */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={idRecognition?.name || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300 bg-gray-50"
                placeholder="Họ và tên"
                readOnly
              />
            </div>

            {/* Ngày sinh */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Ngày sinh <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="dob"
                value={idRecognition?.dob || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300 bg-gray-50"
                readOnly
              />
            </div>

            {/* Giới tính */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Giới tính <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={idRecognition?.gender || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300 bg-gray-50"
                disabled
              >
                <option value="">-- Chọn giới tính --</option>
                <option value="true">Nam</option>
                <option value="false">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>

            {/* Ngày cấp */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Ngày cấp <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="idIssueDate"
                value={idRecognition?.idIssueDate || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300 bg-gray-50"
                readOnly
              />
            </div>

            {/* Nơi cấp */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Nơi cấp <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="idIssuedBy"
                value={idRecognition?.idIssuedBy || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300 bg-gray-50"
                placeholder="Nơi cấp"
                readOnly
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Ngày hết hạn <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="idIssueDate"
                value={idRecognition?.doe || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300 bg-gray-50"
                readOnly
              />
            </div>
            {/* Địa chỉ */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Địa chỉ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={idRecognition?.address || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300 bg-gray-50"
                placeholder="Địa chỉ"
                readOnly
              />
            </div>
          </div>
        </div>
        <button
          onClick={handleSubmitStep2}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Tiếp tục bước tiếp theo
        </button>
        {isPopupOpen && (
          <VideoCapture
            onClose={handleClosePopup}
            onVideoCaptured={handleVideoCaptured}
          />
        )}
      </div>
    </>
  );
};

export default IdRecognitionStep;
