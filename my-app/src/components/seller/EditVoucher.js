import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance';
import { useForm } from 'react-hook-form';
import { showErrorToast, showSuccessToast } from '../../utils/Toast';

const EditVoucher = () => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      id: '',
      codeVoucher: '',
      description: '',
      quantity: '',
      startDate: '',
      expireDate: '',
      minTotalOrder: '',
      maxDiscount: '',
      discountPercentage: '',
      active: true
    }
  })
  const navigate = useNavigate();
  const { voucherId } = useParams();
  const [voucher, setVoucher] = useState(null);
  const fetchVoucher = async (voucherId) => {
    try {
      const response = await axiosInstance.get(`/seller/voucher/getvoucherId?id=${voucherId}`);
      if (response.data.status === true) {
        setVoucher(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (voucher) {
      setValue('id', voucher.id);
      setValue('codeVoucher', voucher.codeVoucher);
      setValue('description', voucher.description);
      setValue('quantity', voucher.quantity);
      setValue('startDate', voucher.startDate);
      setValue('expireDate', voucher.expireDate);
      setValue('minTotalOrder', voucher.minTotalOrder);
      setValue('maxDiscount', voucher.maxDiscount);
      setValue('discountPercentage', voucher.discountPercentage);
      setValue('active', voucher.active);
    }
  }, [voucher, setValue])

  useEffect(() => {
    fetchVoucher(voucherId)
  }, [voucherId])


  const onSubmit = async (data) => {

    try {
      const response = await axiosInstance.post('/seller/voucher/update', data);

      if (response.data.status === true) {
        showSuccessToast(response.data.message);
        navigate('/seller/vouchers');
      }


    } catch (error) {
      showErrorToast(error.response.data.message);
    }

  }


  return (
    <div className="my-6">
         <div className="bg-white rounded-t-xl border border-b-0 border-gray-200 p-6 shadow-md">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Cập nhật Voucher</h1>
              <p className="text-sm text-gray-500 mt-1">Điền thông tin bên dưới để cập nhật voucher mới</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-b-xl border border-gray-200 p-6 space-y-8 shadow-md">
          {/* Thông tin cơ bản */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 mr-3 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </span>
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
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase transition duration-150 hover:border-blue-400"
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
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase transition duration-150 hover:border-blue-400"
                placeholder="VD: 100"
              />
              {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>}
            </div>
          </div>

          {/* Giá trị và thời gian */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 mr-3 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                </svg>
              </span>
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
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 hover:border-blue-400"
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
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 hover:border-blue-400"
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
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 hover:border-blue-400"
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
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 hover:border-blue-400"
                />
                {errors.expireDate && <p className="mt-1 text-sm text-red-600">{errors.expireDate.message}</p>}
              </div>
            </div>
          </div>

          {/* Điều kiện áp dụng */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 mr-3 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </span>
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
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 hover:border-blue-400"
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
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 hover:border-blue-400"
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
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Cập nhật voucher
              </button>
            </div>
          </div>
        </div>
    </div>
  )
}

export default EditVoucher