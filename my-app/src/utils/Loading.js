import React from 'react';

const Loading = () => {


    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-black bg-opacity-30">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mb-2"></div>
            <p className="text-white text-sm animate-pulse">Đang xử lý...</p>
        </div>
    );
};

export default Loading;
