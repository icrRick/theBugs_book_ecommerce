package com.thebugs.back_end.utils;

public class FormatCustomerInfo {

    public static String fullName(String customerInfo) {
        String[] parts = customerInfo.split(" - ");
        return parts.length > 0 ? parts[0].trim() : "";
    }

    public static String phone(String customerInfo) {
        String[] parts = customerInfo.split(" - ");
        return parts.length > 1 ? parts[1].trim() : "";
    }

    public static String address(String customerInfo) {
        String[] parts = customerInfo.split(" - ");
        return parts.length > 2 ? parts[2].trim() : "";
    }

}
