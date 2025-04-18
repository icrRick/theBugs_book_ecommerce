import React, { useState } from 'react';

const OtpInput = () => {
    const [otp, setOtp] = useState(new Array(6).fill(""));

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Focus next input if current input is filled
        if (element.value && element.nextSibling) {
            element.nextSibling.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        // Handle Backspace
        if (e.key === 'Backspace') {
            e.preventDefault();
            const newOtp = [...otp];
            
            // If current input is empty and not first input, move to previous input
            if (!newOtp[index] && index > 0) {
                newOtp[index - 1] = '';
                setOtp(newOtp);
                e.target.previousSibling.focus();
            } else {
                // Clear current input
                newOtp[index] = '';
                setOtp(newOtp);
            }
        }
        // Handle Left Arrow
        else if (e.key === 'ArrowLeft' && index > 0) {
            e.target.previousSibling.focus();
        }
        // Handle Right Arrow
        else if (e.key === 'ArrowRight' && index < 5) {
            e.target.nextSibling.focus();
        }
    };

    return (
        <div className="flex items-center justify-center h-auto bg-gray-100 p-4">
            <div className="max-w-3xl w-full space-y-8">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                        <div
                            className="hidden md:block w-full md:w-1/2 bg-cover bg-center"
                            style={{
                                backgroundImage:
                                    "url('https://images.unsplash.com/photo-1495446815901-a7297e633e8d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80')",
                                backgroundSize: "cover",
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center",
                            }}
                        >
                            <div className="h-full w-full bg-gradient-to-r from-emerald-800/90 to-emerald-900/90 flex items-center justify-center p-8">
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold text-white mb-2">E-Com Books</h2>
                                    <p className="text-emerald-100 text-sm">Khám phá thế giới qua từng trang sách</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 px-8 py-12">
                            <div className="text-center mb-6">
                                <h2 className="text-3xl font-bold text-gray-800 mb-2">Nhập mã OTP</h2>
                                <p className="text-gray-600 text-sm">Chào mừng bạn quay trở lại</p>
                            </div>
                            <div className="grid grid-cols-6 gap-4 justify-center">
                                {otp.map((data, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        maxLength="1"
                                        className="w-12 h-12 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out transform hover:scale-105"
                                        value={data}
                                        onChange={e => handleChange(e.target, index)}
                                        onKeyDown={e => handleKeyDown(e, index)}
                                    />
                                ))}
                            </div>
                            <button
                                className="mt-6 w-full py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
                                onClick={() => alert(`OTP Entered: ${otp.join('')}`)}
                            >
                                Xác nhận
                            </button>
                            <p className="text-center text-gray-500 mt-4">Vui lòng nhập mã OTP được gửi đến số email của bạn.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OtpInput;
