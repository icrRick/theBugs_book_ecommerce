import React from "react";

export const CurrencyFormat = ({ value }) => {
    const formatValue = (val) => {
        // Kiểm tra nếu giá trị là null, undefined hoặc NaN
        if (val === null || val === undefined || isNaN(val)) {
            return "0 ₫";
        }
        
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
        }).format(val);
    };

    return <span>{formatValue(value)}</span>;
};

// Hàm hỗ trợ format tiền tệ để sử dụng trực tiếp
export const formatCurrency = (value) => {
    if (value === null || value === undefined || isNaN(value)) {
        return "0 ₫";
    }
    
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
    }).format(value);
};