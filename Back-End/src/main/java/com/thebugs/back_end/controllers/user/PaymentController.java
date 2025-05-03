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
                try {
                        return ResponseEntityUtil.OK("Lấy phí vận chuyển thành công",
                                        apiGHNService.calculateFee(shippingFreeBean.getShopId(),
                                                        shippingFreeBean.getAddressUserId(), shippingFreeBean.getWeight()));
                } catch (Exception e) {
                        return ResponseEntityUtil.badRequest(e.getMessage());
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
                try {
                        return ResponseEntityUtil.OK("Lấy dữ liệu thành công",
                                        paymentService.list(authorizationHeader, paymentBean));
                } catch (Exception e) {
                        return ResponseEntityUtil.badRequest("Lỗi " + e.getMessage());
                }

        }

}
