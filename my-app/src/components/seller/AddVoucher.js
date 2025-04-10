import React from 'react'
import { useForm } from 'react-hook-form'
import axiosInstance from '../../utils/axiosInstance'
import { useNavigate } from 'react-router-dom'
import { showErrorToast, showSuccessToast } from '../../utils/Toast'

const AddVoucher = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      codeVoucher: '',
      description: '',
      quantity: '',
      startDate: '',
      expireDate: '',
      minTotalOrder: '',
      maxDiscount: '',
      discountPercentage: ''
    }
  })
  const navigate = useNavigate();

  const onSubmit = async (data) => {

    try {
      const response = await axiosInstance.post('/seller/voucher/add', data);

      if (response.data.status===true) {
        showSuccessToast(response.data.message);
        navigate('/seller/vouchers');
      }


    } catch (error) {
      showErrorToast(error.response.data.message);
    }

  }

  return (
    <div className="my-6">
      {/* Header */}
      <div className="bg-white rounded-t-xl border border-b-0 border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Thêm Voucher Mới</h1>
              <p className="text-sm text-gray-500 mt-1">Điền thông tin bên dưới để tạo voucher mới</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-b-xl border border-gray-200 p-6 space-y-8">
          {/* Thông tin cơ bản */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 mr-3 flex items-center justify-center">1</span>
              Thông tin cơ bản
            </h2>
            <div className='mb-4'>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="codeVoucher">
                Mã voucher <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="codeVoucher"
                {...register("codeVoucher", { required: "Vui lòng nhập mã voucher" })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase transition duration-150"
                placeholder="VD: SUMMER2024"
              />
              {errors.codeVoucher && <p className="mt-1 text-sm text-red-600">{errors.codeVoucher.message}</p>}
            </div>
     
            <div className='mb-4'>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="codeVoucher">
                Số lượng voucher <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="quantity"
                {...register("quantity", { required: "Vui lòng nhập số lượng voucher" })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase transition duration-150"
                placeholder="VD: 100"
              />
              {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>}
            </div>
          </div>

          {/* Giá trị và thời gian */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 mr-3 flex items-center justify-center">2</span>
              Giá trị và thời gian
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="discountPercentage">
                  Phần trăm giảm giá <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="discountPercentage"
                    {...register("discountPercentage", {
                      required: "Vui lòng nhập phần trăm giảm giá",
                      min: { value: 0, message: "Phần trăm giảm giá phải lớn hơn hoặc bằng 0" },
                      max: { value: 100, message: "Phần trăm giảm giá không được vượt quá 100" }
                    })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                    placeholder="Nhập phần trăm..."
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <span className="text-gray-500">%</span>
                  </div>
                </div>
                {errors.discountPercentage && <p className="mt-1 text-sm text-red-600">{errors.discountPercentage.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="maxDiscount">
                  Giảm tối đa <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="maxDiscount"
                    {...register("maxDiscount", {
                      required: "Vui lòng nhập số tiền giảm tối đa",
                      min: { value: 0, message: "Số tiền giảm tối đa phải lớn hơn hoặc bằng 0" }
                    })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                    placeholder="Nhập số tiền..."
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <span className="text-gray-500">đ</span>
                  </div>
                </div>
                {errors.maxDiscount && <p className="mt-1 text-sm text-red-600">{errors.maxDiscount.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="startDate">
                  Ngày bắt đầu <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="startDate"
                  {...register("startDate", { required: "Vui lòng chọn ngày bắt đầu" })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                />
                {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="expireDate">
                  Ngày kết thúc <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="expireDate"
                  {...register("expireDate", { required: "Vui lòng chọn ngày kết thúc" })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                />
                {errors.expireDate && <p className="mt-1 text-sm text-red-600">{errors.expireDate.message}</p>}
              </div>
            </div>
          </div>

          {/* Điều kiện áp dụng */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 mr-3 flex items-center justify-center">3</span>
              Điều kiện áp dụng
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="minTotalOrder">
                  Giá trị đơn hàng tối thiểu <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="minTotalOrder"
                    {...register("minTotalOrder", {
                      required: "Vui lòng nhập giá trị đơn hàng tối thiểu",
                      min: { value: 0, message: "Giá trị đơn hàng tối thiểu phải lớn hơn hoặc bằng 0" }
                    })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                    placeholder="Nhập số tiền..."
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <span className="text-gray-500">đ</span>
                  </div>
                </div>
                {errors.minTotalOrder && <p className="mt-1 text-sm text-red-600">{errors.minTotalOrder.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="active">
                  Trạng thái voucher <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="active"
                    {...register("active", { required: "Vui lòng chọn trạng thái voucher" })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 appearance-none bg-white cursor-pointer hover:border-blue-400"
                  >
                    <option value={true} className="py-2">Đang hoạt động</option>
                    <option value={false} className="py-2">Chưa hoạt động</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                {errors.active && <p className="mt-1 text-sm text-red-600">{errors.active.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="description">
                  Mô tả chi tiết
                </label>
                <textarea
                  id="description"
                  {...register("description")}
                  rows="4"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                  placeholder="Nhập mô tả và điều kiện áp dụng của voucher..."
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-6 border-t border-gray-200">
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit(onSubmit)}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Tạo voucher
              </button>
            </div>
          </div>
        </div>
    </div>
  )
}

export default AddVoucher