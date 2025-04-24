import React, { useState, useEffect } from 'react';

import axiosInstance from '../../utils/axiosInstance';
import Pagination from './Pagination';
import { showErrorToast, showSuccessToast } from '../../utils/Toast';
import { useForm } from "react-hook-form";
import Loading from '../../utils/Loading';

const Publishers = () => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [items, setItems] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [keyword, setKeyword] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);


    const [isLoading, setIsLoading] = useState(false);
    const itemsPerPage = 10;
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
        defaultValues: {
            name: '',
            image: null
        }
    });

    const getQueryParams = () => {
        const params = new URLSearchParams(window.location.search);
        const keyword = params.get("keyword") || "";
        const page = parseInt(params.get("page")) || 1;
        return { keyword, page };
    };

    const fetchItems = async (keyword, currentPage) => {
        try {
            const response = await axiosInstance.get('/admin/publisher/list', {
                params: {
                    keyword: keyword || '',
                    page: currentPage || 1,
                }
            });
            if (response.data.status === true) {
                setItems(response.data.data.arrayList);
                setTotalItems(response.data.data.totalItems);
            }
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    useEffect(() => {
        const { keyword, page } = getQueryParams();
        fetchItems(keyword, page);
    }, [keyword, currentPage]);

    const handleSearch = (value) => {
        setKeyword(value);
        setCurrentPage(1);
        const params = new URLSearchParams(window.location.search);
        params.set('keyword', value);
        params.set('page', 1);
        window.history.pushState(null, '', "?" + params.toString());
    }

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        const params = new URLSearchParams(window.location.search);
        params.set('keyword', keyword || '');
        params.set('page', newPage);
        window.history.pushState(null, '', "?" + params.toString());
    };

    const openDeleteModal = (item) => {
        setSelectedItem(item);
        setShowDeleteModal(true);
    };

    const handleAdd = () => {
        setIsEditing(false);
        setShowModal(true);
        reset();
     

    };

    const handleEdit = (item) => {
        setSelectedItem(item);
        setIsEditing(true);
        setShowModal(true);
        setValue('id', item.id);
        setValue('name', item.name);
       

    };

    const handleDelete = async (id) => {
        try {
            const response = await axiosInstance.post(`/admin/publisher/delete?id=${id}`);
            if (response.data.status === true) {
                showSuccessToast(response.data.message);
                setShowDeleteModal(false);
                fetchItems(keyword, currentPage);
            }
        } catch (error) {
            console.error('Error:', error);
            showErrorToast(error.response.data.message);
        }
    };


    const handleCloseModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setSelectedItem(null);
        reset();

    };

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
          
            const response = await axiosInstance.post("/admin/publisher/save", data);

            if (response.data.status === true) {
                showSuccessToast(response.data.message || (isEditing ? 'Cập nhật thể loại thành công' : 'Thêm thể loại thành công'));
                handleCloseModal();
                fetchItems(keyword, currentPage);
            } else {
                throw new Error(response.data.message || (isEditing ? 'Cập nhật thể loại thất bại' : 'Thêm thể loại thất bại'));
            }
        } catch (error) {
            console.error('Submit error:', error);
            const errorMessage = error.response?.data?.message || error.message || (isEditing ? 'Có lỗi xảy ra khi cập nhật thể loại' : 'Có lỗi xảy ra khi thêm thể loại');
            showErrorToast(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

 
    return (
       <>
       {isLoading && <Loading />}
        <div className="my-4 bg-white">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="p-4 ">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center text-sm text-gray-500 mb-1">
                                <a href="#" className="hover:text-gray-700 transition-colors duration-200">Trang chủ</a>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 mx-2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                                <span className="text-gray-900 font-medium">Quản lý nhà xuất bản</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 truncate">Quản lý nhà xuất bản</h1>
                                    <p className="mt-1 text-sm text-gray-500">Quản lý danh sách các nhà xuất bản trong hệ thống</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-shrink-0">
                            <button
                                onClick={handleAdd}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                            >
                                <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Thêm nhà xuất bản mới
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className=" p-4">
                {/* Search Box */}
                <div className="mb-6">
                    <div className="max-w-md w-full">
                        <label htmlFor="search" className="sr-only">Tìm kiếm</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                id="search"
                                placeholder="Tìm kiếm nhà xuất bản..."
                                value={keyword}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
                            />

                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap justify-between items-center mb-4">
                                    <div className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-0">
                                          <span className="hidden sm:inline">Hiển thị</span>{" "}
                                          <span className="font-medium">{items.length > 0 ? startItem : 0}-{items.length > 0 ? endItem : 0}</span>{" "}
                                          <span className="hidden sm:inline">trên</span>{" "}
                                          <span className="font-medium">{totalItems}</span> sản phẩm{" "}
                                          <span className="inline sm:hidden">• Trang {currentPage}</span>
                                    </div>
                              </div>
                {/* Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="min-w-full">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr className="bg-gray-50">

                                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tên nhà xuất bản
                                    </th>
                                    <th scope="col" className="relative px-6 py-4 w-[180px]">
                                        <span className="sr-only">Thao tác</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {
                                    items.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{item?.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button
                                                        onClick={() => handleEdit(item)}
                                                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                                                    >
                                                        <svg className="w-4 h-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                        </svg>
                                                        Sửa
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(item)}
                                                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-red-600 bg-white hover:bg-red-50 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                                                    >
                                                        <svg className="w-4 h-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                        Xóa
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {items.length > 0 && (
                        <Pagination currentPage={currentPage} totalPages={Math.ceil(totalItems / 10)} setCurrentPage={handlePageChange} />
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
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
                                        {isEditing ? 'Cập nhật nhà xuất bản' : 'Thêm nhà xuất bản mới'}
                                    </h3>
                                    <div className="mb-6">
                                    <input
                                            type="hidden"
                                            {...register("id")}
                                            className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.name ? "border-red-300" : "border-gray-300"}`}
                                        />
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                            Tên nhà xuất bản <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            {...register("name", {
                                                required: "Tên nhà xuất bản là bắt buộc",
                                                minLength: {
                                                    value: 2,
                                                    message: "Tên nhà xuất bản phải có ít nhất 2 ký tự"
                                                }
                                            })}
                                            className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.name ? "border-red-300" : "border-gray-300"}`}
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                                        )}
                                    </div>


                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={handleSubmit(onSubmit)}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
                                >
                                    {isEditing ? 'Cập nhật' : 'Thêm mới'}
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
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 overflow-y-auto z-50">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            Xác nhận xóa
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Bạn có chắc chắn muốn xóa thể loại <span className="font-bold text-red-500">{selectedItem?.name}</span> này? Hành động này không thể hoàn tác.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={() => handleDelete(selectedItem.id)}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Xóa
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setSelectedItem(null);
                                    }}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
       </>
    );
};

export default Publishers;
