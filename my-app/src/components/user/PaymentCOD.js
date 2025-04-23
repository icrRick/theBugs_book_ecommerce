import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const PaymentCOD = () => {
    const [countDown, setCountDown] = useState(5);
    const navigate = useNavigate();


    useEffect(() => {
        if (countDown === 0) {
            navigate("/home");
        } else {
            const intervalId = setInterval(() => {
                setCountDown((prevCountDown) => {
                    if (prevCountDown > 0) {
                        return prevCountDown - 1;
                    } else {
                        clearInterval(intervalId);
                        return 0;
                    }
                });
            }, 1000);
            return () => clearInterval(intervalId);
        }
    }, [countDown, navigate]);
    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1495446815901-a7297e633e8d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80')`
            }}
        >
            <div className="max-w-3xl w-full mx-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
                    <div className="px-6 py-8">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Đặt hàng thành công!</h2>
                            <p className="text-gray-600 mb-6">Cảm ơn bạn đã mua hàng tại cửa hàng của chúng tôi</p>

                            <div className="mt-8 text-center">
                                <p className="text-gray-600 mb-4">
                                    Bạn sẽ được chuyển về trang chủ sau {countDown} giây
                                </p>
                                <div className="flex justify-center space-x-4">
                                    <Link
                                        to="/home"
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Về trang chủ
                                    </Link>
                                    <Link
                                        to="/account/ordered"
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Xem đơn hàng
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PaymentCOD;