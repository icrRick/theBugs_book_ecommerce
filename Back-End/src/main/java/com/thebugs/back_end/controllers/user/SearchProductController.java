package com.thebugs.back_end.controllers.user;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.services.user.SearchProductService;

@RestController
@RequestMapping("/search")
public class SearchProductController {
    @Autowired
    private SearchProductService searchProductService;

    @GetMapping("")
    public ResponseEntity<ResponseData> searchProduct(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) List<Integer> genresID,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false, defaultValue = "relevance") String sortBy,
            @RequestParam(required = false, defaultValue = "1") Integer page) {
        try {
            ResponseData responseData = new ResponseData();
            responseData.setStatus(true);
            responseData.setMessage("Tìm kiếm danh sách thành công");
            responseData
                    .setData(searchProductService.searchProduct(keyword, genresID, minPrice, maxPrice, sortBy, page));
            return ResponseEntity.ok().body(responseData);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ResponseData(false, e.getMessage(), null));
        }
    }
}
