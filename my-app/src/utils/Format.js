

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