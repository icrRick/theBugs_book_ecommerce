package com.thebugs.back_end.controllers.user;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thebugs.back_end.beans.CartBean;
import com.thebugs.back_end.beans.PaymentBean;
import com.thebugs.back_end.beans.ShippingFreeBean;

import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.services.user.ApiGHNService;

import com.thebugs.back_end.services.user.PaymentService;
import com.thebugs.back_end.utils.ResponseEntityUtil;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

@RestController
@RequestMapping("/user/payment")
public class PaymentController {

        @Autowired
        private PaymentService paymentService;

        @Autowired
        private ApiGHNService apiGHNService;

        @PostMapping("/shipping-fee")
        public ResponseEntity<ResponseData> calculateShippingFee(@RequestBody ShippingFreeBean shippingFreeBean) {
                ResponseData responseData = new ResponseData();
                try {
                        responseData.setStatus(true);
                        responseData.setMessage("Lấy phí vận chuyển thành công");
                        responseData.setData(apiGHNService.calculateFee(shippingFreeBean.getShopId(),
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
                try {
                        System.out.println("Dữ liệu nhận được: " + cartBeans);
                        List<Integer> orderIdIntegers = paymentService.createOrder(authorizationHeader, cartBeans);
                        System.out.println("List " + orderIdIntegers);
                        return ResponseEntityUtil.OK("Thành công", orderIdIntegers);
                } catch (Exception e) {
                        return ResponseEntityUtil.badRequest(e.getMessage());
                }

        }

        @PostMapping("/list")
        public ResponseEntity<ResponseData> list(@RequestHeader("Authorization") String authorizationHeader,
                        @RequestBody PaymentBean paymentBean) {
                ResponseData responseData = new ResponseData();
                try {
                        responseData.setStatus(true);
                        responseData.setMessage("Lấy dữ liệu thành công");
                        responseData.setData(paymentService.list(authorizationHeader, paymentBean));
                        return ResponseEntity.ok(responseData);
                } catch (Exception e) {
                        responseData.setStatus(false);
                        responseData.setMessage("Lỗi " + e.getMessage());
                        responseData.setData(null);
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
                }

        }

}
