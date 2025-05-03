package com.thebugs.back_end.controllers.user;

import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thebugs.back_end.beans.ReviewBean;

import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.services.user.ReviewService;
import com.thebugs.back_end.utils.ResponseEntityUtil;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/user/review")
public class ReviewController {
    @Autowired
    ReviewService reviewService;

    @PostMapping("/create")
    public ResponseEntity<ResponseData> createReview(@RequestHeader("Authorization") String authorizationHeader,
            @Valid @RequestBody ReviewBean reviewBean, BindingResult result) {
        try {
            if (result.hasErrors()) {
                String errorMessages = result.getAllErrors().stream()
                        .map(DefaultMessageSourceResolvable::getDefaultMessage)
                        .collect(Collectors.joining(", "));
                return ResponseEntityUtil.badRequest(errorMessages);
            }
            boolean isCreated = reviewService.createReview(reviewBean, authorizationHeader);
            if (isCreated) {
                return ResponseEntityUtil.OK("Thêm đánh giá thành công", null);
            } else {
                return ResponseEntityUtil.badRequest("Thêm đánh giá thất bại");
            }
        } catch (Exception e) {
            return ResponseEntityUtil.badRequest(e.getMessage());
        }
    }

}
