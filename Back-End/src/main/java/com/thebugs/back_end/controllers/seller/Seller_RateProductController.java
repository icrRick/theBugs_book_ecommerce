package com.thebugs.back_end.controllers.seller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.services.seller.Seller_RateProductService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@RestController
@RequestMapping("/api/seller/")
public class Seller_RateProductController {
    @Autowired
    Seller_RateProductService g_RateProductService;

    @GetMapping("reviews")
    public ResponseEntity<ResponseData> getReviewProduct(@RequestHeader("Authorization") String authorizationHeader) {
        ResponseData responseData = g_RateProductService.getReviewProduct(authorizationHeader);
        return ResponseEntity.status(HttpStatus.valueOf(responseData.getStatusCode())).body(responseData);
    }

}
