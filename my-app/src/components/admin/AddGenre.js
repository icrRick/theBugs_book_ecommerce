import React, { useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { showSuccessToast } from '../../utils/Toast';

const AddGenre = () => {
    const [genreName, setGenreName] = useState('');
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        image: null,
    });
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        handleFile(file);
    };

    const handleFile = (file) => {
        if (file) {
            if (file.type.startsWith('image/')) {
                setImage(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviewUrl(reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                alert('Vui lòng chọn file hình ảnh hợp lệ!');
            }
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handleFile(file);
    };

    const removeImage = () => {
        setImage(null);
        setPreviewUrl('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!genreName.trim()) {
            alert('Vui lòng nhập tên thể loại!');
            return;
        }
        if (!image) {
            alert('Vui lòng chọn hình ảnh!');
            return;
        }

        setLoading(true);
        try {
            // TODO: Implement API call to save genre
            await new Promise(resolve => setTimeout(resolve, 1000));
            const response = await axiosInstance.post('/admin/genre/add', formData);
            if (response.data.status === true) {
                showSuccessToast(response.data.message);
                setGenreName('');
                setImage(null);
                setPreviewUrl('');
            }
            alert('Thể loại đã được thêm thành công!');
            setGenreName('');
            setImage(null);
            setPreviewUrl('');
        } catch (error) {
            alert('Có lỗi xảy ra khi thêm thể loại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white backdrop-blur-xl backdrop-filter rounded-3xl shadow-2xl overflow-hidden border border-gray-100 transform hover:scale-[1.01] transition-all duration-500 ease-out">
                    {/* Header Section */}
                    <div className="relative bg-gradient-to-r from-indigo-600 via-blue-600 to-blue-500 px-8 py-12">
                        <div className="relative z-10">
                            <h4 className="text-4xl font-extrabold text-white tracking-tight">
                                Thêm Thể Loại Mới
                            </h4>
                            <p className="mt-3 text-blue-100 text-lg font-medium">
                                Tạo và quản lý thể loại sách mới trong hệ thống
                            </p>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent opacity-50"></div>
                        
                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 -mt-6 -mr-6">
                            <div className="text-blue-200 opacity-20">
                                <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                    
                    {/* Form Content */}
                    <div className="p-8 lg:p-12 space-y-8">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Genre Name Input */}
                            <div className="space-y-2">
                                <label htmlFor="genreName" className="block text-lg font-semibold text-gray-800 mb-2">
                                    Tên thể loại
                                </label>
                                <div className="relative rounded-lg group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                                    <input
                                        type="text"
                                        id="genreName"
                                        placeholder="Nhập tên thể loại"
                                        value={genreName}
                                        onChange={(e) => setGenreName(e.target.value)}
                                        required
                                        className="relative block w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 hover:border-blue-400 text-gray-700 text-lg bg-white shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* Image Upload Area */}
                            <div className="space-y-2">
                                <label className="block text-lg font-semibold text-gray-800 mb-2">
                                    Hình ảnh thể loại
                                </label>
                                <div
                                    className={`relative border-3 border-dashed rounded-2xl p-12 text-center transition-all duration-300
                                        ${isDragging 
                                            ? 'border-blue-500 bg-blue-50/70' 
                                            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50/70'
                                        }`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    <input
                                        type="file"
                                        id="image"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                    
                                    {!previewUrl ? (
                                        <label htmlFor="image" className="cursor-pointer block group">
                                            <div className="space-y-6">
                                                <div className="mx-auto w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center border-2 border-blue-200 group-hover:border-blue-400 group-hover:bg-blue-100 transition-all duration-300">
                                                    <svg className="w-12 h-12 text-blue-500 group-hover:text-blue-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-lg text-gray-700 font-medium">
                                                        Kéo thả hình ảnh vào đây hoặc
                                                        <span className="text-blue-500 hover:text-blue-600 ml-1 font-semibold">
                                                            chọn file
                                                        </span>
                                                    </p>
                                                    <p className="text-base text-gray-500 mt-2">
                                                        PNG, JPG, GIF (Khuyến nghị: 400x400px)
                                                    </p>
                                                </div>
                                            </div>
                                        </label>
                                    ) : (
                                        <div className="relative inline-block group">
                                            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                                <img
                                                    src={previewUrl}
                                                    alt="Preview"
                                                    className="max-h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="absolute -top-4 -right-4 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
                                            >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-4 px-6 rounded-xl text-white font-semibold text-lg transition-all duration-500 transform
                                    ${loading 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 hover:-translate-y-1 active:translate-y-0'
                                    }
                                    focus:outline-none focus:ring-4 focus:ring-blue-500/20 shadow-lg hover:shadow-2xl`}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Đang xử lý...
                                    </div>
                                ) : (
                                    'Thêm thể loại'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
             {/* Add Modal */}
      {/* {showAddModal && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Thêm thể loại mới
                  </h3>
                  <div className="mb-6">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Tên thể loại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("name", {
                        required: "Tên thể loại là bắt buộc",
                        minLength: {
                          value: 2,
                          message: "Tên thể loại phải có ít nhất 2 ký tự"
                        }
                      })}
                      className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.name ? "border-red-300" : "border-gray-300"}`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hình ảnh <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 transition-colors duration-200">
                      <div className="space-y-2 text-center">
                        {previewImage ? (
                          <div className="relative group mx-auto">
                            <div className="relative w-48 h-48 rounded-lg overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-xl">
                              <img
                                src={previewImage}
                                alt="Preview"
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <div className="absolute inset-0 flex items-center justify-center space-x-4">
                                  <label
                                    htmlFor="image"
                                    className="inline-flex items-center p-2.5 bg-white/90 text-blue-600 rounded-full hover:bg-white cursor-pointer transition-all duration-200 transform hover:scale-110 hover:shadow-lg"
                                    title="Thay đổi ảnh"
                                  >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                  </label>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setPreviewImage(null);
                                      setSelectedFile(null);
                                      const imageInput = document.querySelector('input[type="file"]');
                                      if (imageInput) {
                                        imageInput.value = '';
                                      }
                                    }}
                                    className="inline-flex items-center p-2.5 bg-white/90 text-red-600 rounded-full hover:bg-white transition-all duration-200 transform hover:scale-110 hover:shadow-lg"
                                    title="Xóa ảnh"
                                  >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                            <p className="mt-2 text-sm text-gray-500 truncate">
                              {selectedFile?.name || "Ảnh đã chọn"}
                            </p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <label
                              htmlFor="image"
                              className="relative cursor-pointer group"
                            >
                              <div className="mx-auto h-32 w-32 rounded-full bg-gray-50 flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-blue-500 transition-all duration-200 group-hover:bg-gray-100">
                                <svg
                                  className="mx-auto h-12 w-12 text-gray-400 group-hover:text-blue-500 transition-colors duration-200"
                                  stroke="currentColor"
                                  fill="none"
                                  viewBox="0 0 48 48"
                                  aria-hidden="true"
                                >
                                  <path
                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                              <div className="mt-3 text-center">
                                <div className="text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors duration-200">
                                  Tải ảnh lên
                                </div>
                                <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF tối đa 10MB</p>
                              </div>
                            </label>
                          </div>
                        )}
                        <input
                          type="file"
                          id="image"
                          name="image"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        {errors.image && (
                          <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleSubmit(onSubmitAdd)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
                >
                  Thêm mới
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )} */}
        </div>
    );
};

export default AddGenre;
