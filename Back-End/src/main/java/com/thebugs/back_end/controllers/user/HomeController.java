package com.thebugs.back_end.controllers.user;

import org.springframework.web.bind.annotation.RestController;

import com.thebugs.back_end.dto.HomeProductDTO;
import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.services.super_admin.GenreService;
import com.thebugs.back_end.services.user.ProductHomeService;

import java.util.ArrayList;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
public class HomeController {

        @Autowired
        private ProductHomeService productHomeService;

        @Autowired
        private GenreService genreService;

        // @Autowired
        // private ReviewService reviewService; // Thêm ReviewService

        @GetMapping("/home")
        public ResponseEntity<ResponseData> getPageHome1(@RequestParam(defaultValue = "1") int page) {
                ResponseData responseData = new ResponseData();
                Pageable pageable = PageRequest.of(page - 1, 12, Sort.by(Sort.Order.desc("id")));
                try {
                        responseData.setStatus(true);
                        responseData.setMessage("Load thành công");
                        ArrayList<HomeProductDTO> homeProductDTOs = productHomeService.AllProduct(pageable);
                        responseData.setData(homeProductDTOs);
                        return ResponseEntity.ok(responseData);
                } catch (Exception e) {
                        responseData.setStatus(false);
                        responseData.setMessage("Lỗi " + e.getMessage());
                        responseData.setData(null);
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
                }
        }

        @GetMapping("/genre/list")
        public ResponseEntity<ResponseData> getAllGenre() {
                ResponseData responseData = new ResponseData();
                try {
                        responseData.setStatus(true);
                        responseData.setMessage("Load thành công");
                        responseData.setData(genreService.getAllGenreDTOs());
                        return ResponseEntity.ok(responseData);
                } catch (Exception e) {
                        responseData.setStatus(false);
                        responseData.setMessage("Lỗi " + e.getMessage());
                        responseData.setData(null);
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
                }
        }

        // // Endpoint mới để lấy review theo productId
        // @GetMapping("/reviews")
        // public ResponseEntity<ResponseData> getReviewsByProductId(@RequestParam("productId") Integer productId) {
        //         ResponseData responseData = new ResponseData();
        //         try {
        //                 List<ReviewDTO> reviews = reviewService.getReviewDTOsByProductId(productId);
        //                 responseData.setStatus(true);
        //                 responseData.setMessage("Load reviews thành công");
        //                 responseData.setData(reviews);
        //                 return ResponseEntity.ok(responseData);
        //         } catch (Exception e) {
        //                 responseData.setStatus(false);
        //                 responseData.setMessage("Lỗi " + e.getMessage());
        //                 responseData.setData(null);
        //                 return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
        //         }
        // }
}