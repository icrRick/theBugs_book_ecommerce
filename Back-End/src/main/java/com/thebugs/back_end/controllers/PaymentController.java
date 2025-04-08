package com.thebugs.back_end.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thebugs.back_end.beans.CartBean;
import com.thebugs.back_end.beans.ShippingFreeBean;
import com.thebugs.back_end.config.PaymentConfig;
import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.services.PaymentService;
import com.thebugs.back_end.services.ShippingService;

import jakarta.servlet.http.HttpServletRequest;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/user/payment")
public class PaymentController {

        @Autowired
        private PaymentService paymentService;

        @Autowired
        private ShippingService shippingService;

        @PostMapping("/shipping-fee")
        public ResponseEntity<ResponseData> calculateShippingFee(@RequestBody ShippingFreeBean shippingFreeBean) {
                ResponseData responseData = new ResponseData();
                try {
                        responseData.setStatus(true);
                        responseData.setMessage("Lấy phí vận chuyển thành công");
                        responseData.setData(shippingService.calculateFee(shippingFreeBean.getShopId(),
                                        shippingFreeBean.getAddressUserId(), shippingFreeBean.getWeight()));
                        return ResponseEntity.ok(responseData);
                } catch (Exception e) {
                        responseData.setStatus(false);
                        responseData.setMessage("Error");
                        responseData.setData(e.getMessage());
                        System.err.println("Error: " + e.getMessage());
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
                }

        }

        @PostMapping("/payment-ordered")
        public ResponseEntity<ResponseData> payment(@RequestHeader("Authorization") String authorizationHeader,
                        @RequestBody List<CartBean> cartBeans) {
                ResponseData responseData = new ResponseData();
                try {

                        responseData.setStatus(true);
                        responseData.setMessage("Lấy phí vận chuyển thành công");
                        responseData.setData(paymentService.createOrder(authorizationHeader, cartBeans));
                        return ResponseEntity.ok(responseData);
                } catch (Exception e) {
                        responseData.setStatus(false);
                        responseData.setMessage("Error");
                        responseData.setData(e.getMessage());
                        System.err.println("Error: " + e.getMessage());
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
                }

        }

        @GetMapping("/vnpay")
        public ResponseEntity<?> createVnPayPayment(HttpServletRequest req) {
            try {
                // Initialize required parameters
                String vnp_Version = "2.1.0";
                String vnp_Command = "pay";
                String vnp_OrderInfo = req.getParameter("orderInfor");
                String orderType = "100000";
                String vnp_TxnRef = req.getParameter("orderId");
                String vnp_IpAddr = PaymentConfig.getIpAddress(req);
                String vnp_TmnCode = PaymentConfig.vnp_TmnCode;
        
                int amount = Integer.parseInt(req.getParameter("total")) * 100;
        
                // Prepare parameters map
                Map<String, String> vnp_Params = new HashMap<>();
                vnp_Params.put("vnp_Version", vnp_Version);
                vnp_Params.put("vnp_Command", vnp_Command);
                vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
                vnp_Params.put("vnp_Amount", String.valueOf(amount));
                vnp_Params.put("vnp_CurrCode", "VND");
        
                // Optional parameters
                addOptionalParam(vnp_Params, "vnp_BankCode", req.getParameter("bankcode"));
                vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
                vnp_Params.put("vnp_OrderInfo", vnp_OrderInfo);
                vnp_Params.put("vnp_OrderType", orderType);
                vnp_Params.put("vnp_Locale", req.getParameter("language") != null ? req.getParameter("language") : "vn");
                vnp_Params.put("vnp_ReturnUrl", PaymentConfig.vnp_ReturnUrl);
                vnp_Params.put("vnp_IpAddr", vnp_IpAddr);
        
                // Add timestamps
                Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
                SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
                vnp_Params.put("vnp_CreateDate", formatter.format(cld.getTime()));
                cld.add(Calendar.MINUTE, 15);
                vnp_Params.put("vnp_ExpireDate", formatter.format(cld.getTime()));
        
                // Add billing information
                addBillingInfo(vnp_Params, req);
        
                // Add invoice information
                addInvoiceInfo(vnp_Params, req);
        
                // Build query and hash data
                String queryUrl = buildQueryUrl(vnp_Params);
                String vnp_SecureHash = PaymentConfig.generateHMACSHA512(PaymentConfig.vnp_HashSecret, queryUrl);
                queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        
                // Generate payment URL
                String paymentUrl = PaymentConfig.vnp_PayUrl + "?" + queryUrl;
        
                return ResponseEntity.ok(new ResponseData(true, "Payment created", paymentUrl));
            } catch (Exception e) {
                return ResponseEntity.status(500).body(new ResponseData(false, e.getMessage(), null));
            }
        }
        
        private void addOptionalParam(Map<String, String> params, String key, String value) {
            if (value != null && !value.isEmpty()) {
                params.put(key, value);
            }
        }
        
        private void addBillingInfo(Map<String, String> params, HttpServletRequest req) {
            params.put("vnp_Bill_Mobile", req.getParameter("txt_billing_mobile"));
            params.put("vnp_Bill_Email", req.getParameter("txt_billing_email"));
        
            String fullName = req.getParameter("txt_billing_fullname");
            if (fullName != null && !fullName.isEmpty()) {
                String[] nameParts = fullName.split(" ", 2);
                params.put("vnp_Bill_FirstName", nameParts[0]);
                params.put("vnp_Bill_LastName", nameParts.length > 1 ? nameParts[1] : "");
            }
        
            params.put("vnp_Bill_Address", req.getParameter("txt_inv_addr1"));
            params.put("vnp_Bill_City", req.getParameter("txt_bill_city"));
            params.put("vnp_Bill_Country", req.getParameter("txt_bill_country"));
            addOptionalParam(params, "vnp_Bill_State", req.getParameter("txt_bill_state"));
        }
        
        private void addInvoiceInfo(Map<String, String> params, HttpServletRequest req) {
            params.put("vnp_Inv_Phone", req.getParameter("txt_inv_mobile"));
            params.put("vnp_Inv_Email", req.getParameter("txt_inv_email"));
            params.put("vnp_Inv_Customer", req.getParameter("txt_inv_customer"));
            params.put("vnp_Inv_Address", req.getParameter("txt_inv_addr1"));
            params.put("vnp_Inv_Company", req.getParameter("txt_inv_company"));
            params.put("vnp_Inv_Taxcode", req.getParameter("txt_inv_taxcode"));
            params.put("vnp_Inv_Type", req.getParameter("cbo_inv_type"));
        }
        
        private String buildQueryUrl(Map<String, String> params) throws Exception {
            List<String> fieldNames = new ArrayList<>(params.keySet());
            Collections.sort(fieldNames);
        
            StringBuilder hashData = new StringBuilder();
            StringBuilder query = new StringBuilder();
        
            for (String fieldName : fieldNames) {
                String fieldValue = params.get(fieldName);
                if (fieldValue != null && !fieldValue.isEmpty()) {
                    hashData.append(fieldName).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString())).append('&');
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString())).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString())).append('&');
                }
            }
        
            // Remove trailing '&'
            if (hashData.length() > 0) hashData.setLength(hashData.length() - 1);
            if (query.length() > 0) query.setLength(query.length() - 1);
        
            return hashData.toString();
        }

}
