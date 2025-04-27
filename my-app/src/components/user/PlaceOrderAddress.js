import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { showErrorToast, showSuccessToast } from "../../utils/Toast";
import axiosInstance from "../../utils/axiosInstance";
import StreetApiAddress from "./StreetApiAddress";
import { setAddressId } from "../../utils/cookie";

const PlaceOrderAddress = () => {
    const [addresses, setAddresses] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get("/user/address/list");
            if (response.data.status) {
                setAddresses(response.data.data);
            }
        } catch (error) {
            console.error("Lỗi load địa chỉ:", error);
            showErrorToast("Không thể tải danh sách địa chỉ");
        } finally {
            setLoading(false);
        }
    };

    const navigate = useNavigate();
    useEffect(() => {
        fetchData();
    }, []);

    const handleSetAddress = (item) => {
        setAddressId(item.id);
        navigate("/payment");
    }

    const handleDeleteClick = (item) => {
        setSelectedItem(item)
        setShowDeleteModal(true)
    }

    const handleDelete = async (id) => {
        try {
            const response = await axiosInstance.post(`/user/address/delete?id=${id}`);
            if (response.data.status === true) {
                showSuccessToast(response.data.message);
                setShowDeleteModal(false);
                setSelectedItem(null);
                fetchData();
            }
        } catch (error) {
            console.error('Error:', error);
            showErrorToast(error.response.data.message);
        }
    };

    return (
        <div className="w-full min-h-[calc(100vh-300px)]">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Chọn địa chỉ giao hàng</h2>
                <Link
                    to="/account/address/add"
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Thêm địa chỉ mới
                </Link>
            </div>

            {addresses.length > 0 ? (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {addresses.map((address) => (
                            <div key={address.id} className="col-span-1">
                                <div className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border-l-4 ${address.isDefault ? "border-emerald-500" : "border-transparent"} hover:border-l-emerald-500 transform hover:-translate-y-1`}>
                                    <div className="p-6">
                                        <div className="flex justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center mb-3">
                                                    <h3 className="font-bold text-lg text-gray-800">{address?.fullName}</h3>
                                                    {address.isDefault && (
                                                        <span className="ml-3 px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-medium rounded-full">
                                                            Mặc định
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-gray-600 mb-2 text-lg">{address?.phone}</p>
                                                <p className="text-gray-600 text-lg">
                                                    <StreetApiAddress 
                                                        provinceId={address?.provinceId} 
                                                        districtId={address?.districtId} 
                                                        wardId={address?.wardId} 
                                                        street={address?.street} 
                                                    />
                                                </p>
                                            </div>

                                            <div className="flex flex-col space-y-3 ml-6">
                                                <div className="flex space-x-3">
                                                    <Link
                                                        to={`/account/address/edit/${address.id}`}
                                                        className="p-2.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-300"
                                                        title="Chỉnh sửa"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                        </svg>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDeleteClick(address)}
                                                        className="p-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300"
                                                        title="Xóa"
                                                        disabled={address.isDefault}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => handleSetAddress(address)}
                                                    className="px-4 py-2 text-sm font-medium border-2 border-emerald-500 rounded-xl text-emerald-600 hover:bg-emerald-500 hover:text-white cursor-pointer transition-all duration-300"
                                                >
                                                    Chọn địa chỉ này
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                    <div className="w-24 h-24 mx-auto mb-6 bg-emerald-50 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">Chưa có địa chỉ nào</h3>
                    <p className="text-gray-600 mb-8 text-lg">Bạn chưa thêm địa chỉ giao hàng nào</p>
                    <Link
                        to="/account/address/add"
                        className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 inline-flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Thêm địa chỉ mới
                    </Link>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 overflow-y-auto z-50">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-6 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-xl leading-6 font-bold text-gray-900">
                                            Xác nhận xóa
                                        </h3>
                                        <div className="mt-3">
                                            <p className="text-base text-gray-600">
                                                Bạn có chắc chắn muốn xóa địa chỉ <span className="font-bold text-red-500"><StreetApiAddress provinceId={selectedItem?.provinceId} districtId={selectedItem?.districtId} wardId={selectedItem?.wardId} street={selectedItem?.street} /></span> này? Hành động này không thể hoàn tác.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-6 py-4 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={() => handleDelete(selectedItem.id)}
                                    className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-6 py-3 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-300"
                                >
                                    Xóa
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setSelectedItem(null);
                                    }}
                                    className="mt-3 w-full inline-flex justify-center rounded-xl border border-gray-300 shadow-sm px-6 py-3 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-300"
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PlaceOrderAddress;
