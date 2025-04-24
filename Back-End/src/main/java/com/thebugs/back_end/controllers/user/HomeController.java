package com.thebugs.back_end.controllers.user;

import org.springframework.web.bind.annotation.RestController;

import com.thebugs.back_end.dto.HomeAuthorDTO;
import com.thebugs.back_end.dto.HomeProductDTO;
import com.thebugs.back_end.repository.AuthorJPA;
import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.services.user.ProductHomeService;

import java.util.List;

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
        private ProductHomeService homeService;
        @Autowired
        private AuthorJPA authorRepository;

        @GetMapping("/home/products")
        public ResponseEntity<ResponseData> getHomeProducts(
                        @RequestParam(defaultValue = "1") int page,
                        @RequestParam(defaultValue = "") String filter) {
                ResponseData responseData = new ResponseData();
                Pageable pageable = PageRequest.of(page - 1, 50, Sort.by(Sort.Order.desc("id")));
                try {
                        List<HomeProductDTO> products = homeService.getProducts(filter, pageable);
                        responseData.setStatus(true);
                        responseData.setMessage(products.isEmpty() ? "Không có sản phẩm cho bộ lọc: " + filter
                                        : "Load sản phẩm thành công");
                        responseData.setData(products);
                        return ResponseEntity.ok(responseData);
                } catch (Exception e) {
                        responseData.setStatus(false);
                        responseData.setMessage("Lỗi: " + e.getMessage());
                        responseData.setData(null);
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseData);
                }
        }

        @GetMapping("/home/authors")
        public ResponseEntity<ResponseData> getFeaturedAuthors(@RequestParam(defaultValue = "6") int limit) {
                ResponseData responseData = new ResponseData();
                Pageable pageable = PageRequest.of(0, limit);
                List<HomeAuthorDTO> authors = authorRepository.findFeaturedAuthors(pageable);
                responseData.setStatus(true);
                responseData.setMessage(authors.isEmpty() ? "Không có tác giả nổi bật hiện tại"
                                : "Load tác giả nổi bật thành công");
                responseData.setData(authors);
                return ResponseEntity.ok(responseData);
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
}