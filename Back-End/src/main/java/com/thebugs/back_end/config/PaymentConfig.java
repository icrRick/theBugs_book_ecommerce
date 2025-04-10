package com.thebugs.back_end.config;

import java.text.SimpleDateFormat;
import java.util.Calendar;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import jakarta.servlet.http.HttpServletRequest;
public class PaymentConfig {

    public static String vnp_PayUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    public static String vnp_ReturnUrl = "http://localhost:3000/user/payment-status";

    public static String vnp_TmnCode = "LWXUFIL3";
    public static String vnp_HashSecret = "FQ7OS1P4HK8016WQO50F3S5U3BV8H9GH";

    public static String getIpAddress(HttpServletRequest request) {
        String ipAddress = request.getRemoteAddr();
        if ("0:0:0:0:0:0:0:1".equals(ipAddress)) {
            ipAddress = "27.69.236.46";
        }
        System.out.println("IP address: " + ipAddress);
        return ipAddress;
    }

    public static String generateTimeBasedID(boolean addMinutes) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
        Calendar calendar = Calendar.getInstance();
        if (addMinutes) {
            calendar.add(Calendar.MINUTE, 15);
        }
        return dateFormat.format(calendar.getTime());
    }

    public static String generateHMACSHA512(String key, String data) throws Exception {
        SecretKeySpec secretKey = new SecretKeySpec(key.getBytes("UTF-8"), "HmacSHA512");
        Mac mac = Mac.getInstance("HmacSHA512");
        mac.init(secretKey);
        byte[] hmacBytes = mac.doFinal(data.getBytes("UTF-8"));
        StringBuilder sb = new StringBuilder();
        for (byte b : hmacBytes) {
            sb.append(String.format("%02x", b)); 
        }
        return sb.toString();
    }
}
