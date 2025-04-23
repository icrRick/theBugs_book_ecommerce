// package com.thebugs.back_end.controllers.user;

// import org.hibernate.query.Page;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.data.domain.PageRequest;
// import org.springframework.data.domain.Pageable;
// import org.springframework.data.domain.Sort;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RequestParam;
// import org.springframework.web.bind.annotation.RestController;

// import com.thebugs.back_end.resp.ResponseData;
// import com.thebugs.back_end.services.user.SearchProductService;

// @RestController
// @RequestMapping("/search")
// public class SearchProductController {
// @Autowired
// private SearchProductService searchProductService;

// @GetMapping("")
// public ResponseEntity<ResponseData> searchProduct(
// @RequestParam(required = false) String keyword,
// @RequestParam(required = false) String category,
// @RequestParam(required = false) double ratings,
// @RequestParam(required = false) double minPrice,
// @RequestParam(required = false) double maxPrice,
// @RequestParam(required = false) String sortBy,
// int page, int size) {
// try {
// ResponseData responseData = new ResponseData();
// Pageable pageable = PageRequest.of(page - 1, size,
// Sort.by(Sort.Order.desc("id")));
// responseData.setStatus(true);
// responseData.setMessage("Tìm kiếm danh sách thành công");
// responseData.setData(searchProductService.searchProduct(keyword, category,
// ratings, minPrice, maxPrice,
// sortBy, pageable));

// return ResponseEntity.ok().body(responseData);
// } catch (Exception e) {
// return ResponseEntity.badRequest()
// .body(new ResponseData(false, "Tìm kiếm thất bại" + e.getMessage(), null));
// }
// }
// }
