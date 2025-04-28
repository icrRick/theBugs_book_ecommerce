package com.thebugs.back_end.controllers.seller;

import org.springframework.web.bind.annotation.RestController;

import com.thebugs.back_end.beans.PromotionBean;
import com.thebugs.back_end.dto.PromotionDTO;
import com.thebugs.back_end.resp.ResponseData;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.Map;

import com.thebugs.back_end.services.seller.PromotionService;
import com.thebugs.back_end.services.user.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/seller/promotion")
public class PromotionController {
        @Autowired
        private UserService g_UserService;
        @Autowired
        private PromotionService promotionService;

        @GetMapping("/list")
        public ResponseEntity<ResponseData> getList(
                        @RequestHeader("Authorization") String authorizationHeader,
                        @RequestParam(value = "startDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
                        @RequestParam(value = "expireDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date expireDate,
                        @RequestParam(defaultValue = "1") int page) throws ParseException {
                ResponseData responseData = new ResponseData();
                try {
                        Pageable pageable = PageRequest.of(page - 1, 9, Sort.by(Sort.Order.desc("id")));
                        ArrayList<PromotionDTO> promotions = promotionService.findByShopAndDateRange(
                                        authorizationHeader, startDate, expireDate, pageable);
                        int total = promotionService.total(authorizationHeader, startDate, expireDate);
                        Map<String, Object> response = Map.of(
                                        "arrayList", promotions,
                                        "totalItems", total);
                        responseData.setStatus(true);
                        responseData.setMessage("Lấy danh sách thành công");
                        responseData.setData(response);
                        return ResponseEntity.ok(responseData);
                } catch (IllegalArgumentException e) {
                        responseData.setStatus(false);
                        responseData.setMessage("Lỗi " + e.getMessage());
                        responseData.setData(null);
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
                }
        }

        @GetMapping("/{id}")
        public ResponseEntity<PromotionDTO> getPromotionById(@PathVariable Integer id) {
                try {
                        System.out.println("PromotionControllerID: " + id);
                        PromotionDTO promotion = promotionService.getPromotionById(id);
                        return ResponseEntity.ok(promotion);
                } catch (IllegalArgumentException e) {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
                }
        }

        @PostMapping("/delete")
        public ResponseEntity<ResponseData> deletePromotion(@RequestParam Integer id) {
                ResponseData responseData = new ResponseData();
                try {
                        boolean delete = promotionService.deletePromotion(id);
                        if (delete) {
                                responseData.setStatus(true);
                                responseData.setMessage("Xóa thành công");
                                responseData.setData(null);
                                return ResponseEntity.ok(responseData);
                        } else {
                                responseData.setStatus(false);
                                responseData.setMessage("Xóa thất bại");
                                responseData.setData(null);
                                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
                        }

                } catch (Exception e) {
                        responseData.setStatus(false);
                        responseData.setMessage("Lỗi " + e.getMessage());
                        responseData.setData(null);
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
                }
        }

        @PostMapping("/create")
        public ResponseEntity<ResponseData> createPromotion(
                        @RequestHeader("Authorization") String authorizationHeader,
                        @RequestBody PromotionBean promotion) {
                ResponseData responseData = promotionService.createPromotion(promotion, authorizationHeader);
                ResponseEntity<ResponseData> responseEntity = ResponseEntity
                                .status(HttpStatus.valueOf(responseData.getStatusCode()))
                                .body(responseData);
                return responseEntity;
        }

        @PutMapping("/update/{promotionId}")
        public ResponseEntity<ResponseData> updatePromotion(
                        @PathVariable Integer promotionId,
                        @RequestHeader("Authorization") String authorizationHeader,
                        @RequestBody PromotionBean promotion) {
                System.out.println("PromotionControllerUpdateID: " + promotionId);
                ResponseData responseData = promotionService.updatePromotion(promotionId, promotion, authorizationHeader);
                ResponseEntity<ResponseData> responseEntity = ResponseEntity
                                .status(HttpStatus.valueOf(responseData.getStatusCode()))
                                .body(responseData);
                return responseEntity;
        }

        @DeleteMapping("/delete/{promotionId}")
        public ResponseEntity<ResponseData> deletePromotion(
                        @PathVariable Integer promotionId,
                        @RequestHeader("Authorization") String authorizationHeader) {
                System.out.println("PromotionControllerDeleteID: " + promotionId);
                ResponseData responseData = promotionService.deletePromotion(promotionId, authorizationHeader);
                ResponseEntity<ResponseData> responseEntity = ResponseEntity
                                .status(HttpStatus.valueOf(responseData.getStatusCode()))
                                .body(responseData);
                return responseEntity;
        }

        @GetMapping("/products")
        public ResponseEntity<ResponseData> getListProduct(
                        @RequestHeader("Authorization") String authorizationHeader,
                        @RequestParam(defaultValue = "1") int pageNumber) {
                int shopId = g_UserService.getUserToken(authorizationHeader).getShop().getId();
                ResponseData responseData = promotionService.getProductAndPromotion(shopId,
                                PageRequest.of(pageNumber - 1, 10));
                return ResponseEntity.status(HttpStatus.valueOf(responseData.getStatusCode())).body(responseData);
        }

}
