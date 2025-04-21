package com.thebugs.back_end.services.seller;

import java.util.Date;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.beans.Seller_ReviewBean;
import com.thebugs.back_end.dto.Seller_ReviewDTO;
import com.thebugs.back_end.entities.Review;
import com.thebugs.back_end.repository.ReviewJPA;
import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.services.user.UserService;

@Service
public class Seller_RateProductService {
    @Autowired
    private ReviewJPA g_ReviewJPA;

    @Autowired
    private UserService g_UserService;

    public ResponseData getReviewProduct(String jwt, int rate, String keyword, Boolean isReply, Pageable pageable) {
        try {
            int shopId = g_UserService.getUserToken(jwt).getShop().getId();
            Page<Seller_ReviewDTO> review = g_ReviewJPA.getFullReviewByShopId(shopId, rate, keyword, isReply, pageable);
            return new ResponseData(true, "Lấy thông tin đánh giá thành công", review.getContent(), 200);
        } catch (Exception e) {
            return new ResponseData(false, "Lấy thông tin thất bại", null, 400);
        }
    }

    public ResponseData replyReview(Seller_ReviewBean reviewBean) {
        Optional<Review> review = g_ReviewJPA.findById(reviewBean.getId());
        if (review.isPresent()) {
            review.get().setReply(reviewBean.getReply());
            review.get().setReplyAt(new Date());
        } else {
            return new ResponseData(false, "Không tìm thấy đánh giá", null, 400);
        }
        return new ResponseData(true, "Phản hồi đánh giá thành công", null, 201);
    }
}
