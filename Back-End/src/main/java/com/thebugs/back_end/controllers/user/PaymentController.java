package com.thebugs.back_end.controllers.user;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thebugs.back_end.services.user.ShippingService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/user/payment")
public class PaymentController {

        @Autowired
        private ShippingService shippingService;

        @GetMapping("/test")
        public Integer calculateShippingFee(
                        @RequestParam(required = false) Integer fromDistrictId,
                        @RequestParam(required = false) String fromWardCode,
                        @RequestParam Integer toDistrictId,
                        @RequestParam String toWardCode,
                        @RequestParam Integer weight) {
                return shippingService.calculateFee(fromDistrictId, fromWardCode, toDistrictId, toWardCode,
                                weight);

        }

}
