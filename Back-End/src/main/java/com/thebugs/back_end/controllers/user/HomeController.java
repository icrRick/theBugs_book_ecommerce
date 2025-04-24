package com.thebugs.back_end.controllers.user;

import org.springframework.web.bind.annotation.RestController;

import com.thebugs.back_end.repository.ProductJPA;
import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.services.user.ProductHomeService;
import com.thebugs.back_end.utils.ResponseEntityUtil;

import lombok.Getter;

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
        private ProductJPA g_ProductJPA; // Thêm ProductJPA`

        // @Autowired
        // private ReviewService reviewService; // Thêm ReviewService

        // @GetMapping("/home")
        // public ResponseEntity<ResponseData> getPageHome1(@RequestParam(defaultValue =
        // "1") int page) {
        // ResponseData responseData = new ResponseData();
        // Pageable pageable = PageRequest.of(page - 1, 12,
        // Sort.by(Sort.Order.desc("id")));
        // try {
        // responseData.setStatus(true);
        // responseData.setMessage("Load thành công");
        // List<HomeProductDTO> homeProductDTOs =
        // productHomeService.getProducts("defaultCategory",
        // pageable);
        // responseData.setData(homeProductDTOs);
        // return ResponseEntity.ok(responseData);
        // } catch (Exception e) {
        // responseData.setStatus(false);
        // responseData.setMessage("Lỗi " + e.getMessage());
        // responseData.setData(null);
        // return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
        // }
        // }
        @Autowired
        private ProductHomeService homeService;

        @GetMapping("/home/products")
        public ResponseEntity<ResponseData> getHomeProducts(
                        @RequestParam(defaultValue = "1") int page,
                        @RequestParam(defaultValue = "") String filter) {
                ResponseData responseData = new ResponseData();
                Pageable pageable = PageRequest.of(page - 1, 12, Sort.by(Sort.Order.desc("id")));
                try {
                        responseData.setStatus(true);
                        responseData.setMessage("Load sản phẩm thành công");
                        responseData.setData(homeService.getProducts(filter, pageable));
                        return ResponseEntity.ok(responseData);
                } catch (IllegalArgumentException e) {
                        responseData.setStatus(false);
                        responseData.setMessage("Lỗi: " + e.getMessage());
                        responseData.setData(null);
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
                }
        }

        @GetMapping("/home/allProducts")
        public ResponseEntity<ResponseData> getAllActiveProduct() {
                try {
                        return ResponseEntityUtil.OK("OK", g_ProductJPA.getAllProItemDTO());
                } catch (Exception e) {
                        return ResponseEntityUtil.badRequest(e.getMessage());
                }
        }

        @GetMapping("/home/authors")
        public ResponseEntity<ResponseData> getFeaturedAuthors() {
                ResponseData responseData = new ResponseData();
                try {
                        responseData.setStatus(true);
                        responseData.setMessage("Load tác giả thành công");
                        responseData.setData(homeService.getFeaturedAuthors());
                        return ResponseEntity.ok(responseData);
                } catch (IllegalArgumentException e) {
                        responseData.setStatus(false);
                        responseData.setMessage("Lỗi: " + e.getMessage());
                        responseData.setData(null);
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
                }
        }

        @GetMapping("/home/genres")
        public ResponseEntity<ResponseData> getGenres() {
                ResponseData responseData = new ResponseData();
                try {
                        responseData.setStatus(true);
                        responseData.setMessage("Load danh mục thành công");
                        responseData.setData(homeService.getGenres());
                        return ResponseEntity.ok(responseData);
                } catch (IllegalArgumentException e) {
                        responseData.setStatus(false);
                        responseData.setMessage("Lỗi: " + e.getMessage());
                        responseData.setData(null);
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
                }
        }

        // @GetMapping("/home/promotions")
        // public ResponseEntity<ResponseData> getActivePromotions() {
        // ResponseData responseData = new ResponseData();
        // try {
        // responseData.setStatus(true);
        // responseData.setMessage("Load khuyến mãi thành công");
        // responseData.setData(homeService.getActivePromotions());
        // return ResponseEntity.ok(responseData);
        // } catch (IllegalArgumentException e) {
        // responseData.setStatus(false);
        // responseData.setMessage("Lỗi: " + e.getMessage());
        // responseData.setData(null);
        // return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
        // }
        // }

        @GetMapping("/home/shops/flash-sale")
        public ResponseEntity<ResponseData> getFlashSaleShops() {
                ResponseData responseData = new ResponseData();
                try {
                        responseData.setStatus(true);
                        responseData.setMessage("Load cửa hàng flash sale thành công");
                        responseData.setData(homeService.getFlashSaleShops());
                        return ResponseEntity.ok(responseData);
                } catch (IllegalArgumentException e) {
                        responseData.setStatus(false);
                        responseData.setMessage("Lỗi: " + e.getMessage());
                        responseData.setData(null);
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
                }
        }
        // @GetMapping("/genre/list")
        // public ResponseEntity<ResponseData> getAllGenre() {
        // ResponseData responseData = new ResponseData();
        // try {
        // responseData.setStatus(true);
        // responseData.setMessage("Load thành công");
        // responseData.setData(genreService.getAllGenreDTOs());
        // return ResponseEntity.ok(responseData);
        // } catch (Exception e) {
        // responseData.setStatus(false);
        // responseData.setMessage("Lỗi " + e.getMessage());
        // responseData.setData(null);
        // return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
        // }
        // }

        // // Endpoint mới để lấy review theo productId
        // @GetMapping("/reviews")
        // public ResponseEntity<ResponseData>
        // getReviewsByProductId(@RequestParam("productId") Integer productId) {
        // ResponseData responseData = new ResponseData();
        // try {
        // List<ReviewDTO> reviews = reviewService.getReviewDTOsByProductId(productId);
        // responseData.setStatus(true);
        // responseData.setMessage("Load reviews thành công");
        // responseData.setData(reviews);
        // return ResponseEntity.ok(responseData);
        // } catch (Exception e) {
        // responseData.setStatus(false);
        // responseData.setMessage("Lỗi " + e.getMessage());
        // responseData.setData(null);
        // return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
        // }
        // }
}