package com.thebugs.back_end.controllers.seller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.thebugs.back_end.beans.Seller_ReviewBean;
import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.services.seller.Seller_RateProductService;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

@RestController
@RequestMapping("/api/seller/reviews")
public class Seller_RateProductController {
    @Autowired
    Seller_RateProductService g_RateProductService;

    @GetMapping()
    public ResponseEntity<ResponseData> getReviewProduct(@RequestHeader("Authorization") String authorizationHeader,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer byRate,
            @RequestParam(required = false) Boolean isReply,
            @RequestParam(required = false, defaultValue = "DESC") String sort,
            @RequestParam(required = false, defaultValue = "rate") String sortBy) {
        // prepare for search
        keyword = keyword == null ? "" : keyword;
        System.out.println("SORT");
        System.out.println(sort);
        System.out.println(sortBy);
        String cleaned = keyword.replaceAll("\\s+", "");
        String keywordPattern = Arrays.stream(cleaned.split(""))
                .map(ch -> "%" + ch)
                .collect(Collectors.joining("")) + "%";
        Sort finalSort = sort.equalsIgnoreCase("DESC") ? Sort.by(Sort.Order.desc(sortBy))
                : Sort.by(Sort.Order.asc(sortBy));
                System.out.println("KEYWORD: ");
                System.out.println(keywordPattern);
        // prepare for page
        int pageNumber = (page == null || page < 1) ? 1 : page;
        Pageable pageable = PageRequest.of(pageNumber - 1, 10, finalSort);

        // call service get data
        ResponseData responseData = g_RateProductService.getReviewProduct(authorizationHeader,
                byRate == null ? 0 : byRate,
                keywordPattern, isReply,
                pageable);
        return ResponseEntity.status(HttpStatus.valueOf(responseData.getStatusCode())).body(responseData);
    }

    @PostMapping("/reply")
    public ResponseEntity<ResponseData> replyReview(@RequestHeader("Authorization") String authorizationHeader,
           @RequestBody Seller_ReviewBean reviewBean,
            BindingResult bindingResult) {
                System.out.println("REPLYNE");
        ResponseData responseData;
        if (bindingResult.hasFieldErrors()) {
            Map<String, String> errorMap = new HashMap<>();
            if (bindingResult.hasErrors()) {
                for (FieldError fieldError : bindingResult.getFieldErrors()) {
                    errorMap.put(fieldError.getField(), fieldError.getDefaultMessage());
                }
            }
            responseData = new ResponseData(true, "Thất bại", errorMap, 400);
        } else {
            responseData = g_RateProductService.replyReview(reviewBean);
        }
        return ResponseEntity.status(HttpStatus.valueOf(responseData.getStatusCode())).body(responseData);
    }
}
