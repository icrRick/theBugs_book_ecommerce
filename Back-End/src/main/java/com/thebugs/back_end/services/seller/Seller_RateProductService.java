package com.thebugs.back_end.services.seller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.dto.Seller_ReviewDTO;
import com.thebugs.back_end.repository.ReviewJPA;
import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.services.user.UserService;

@Service
public class Seller_RateProductService {
    @Autowired
    private ReviewJPA g_ReviewJPA;

    @Autowired
    private UserService g_UserService;

    public ResponseData getReviewProduct(String jwt) {
        try {
            int shopId = g_UserService.getUserToken(jwt).getShop().getId();
            List<Seller_ReviewDTO> review = g_ReviewJPA.getFullReviewByShopId(shopId);
            return new ResponseData(true, "Lấy thông tin đánh giá thành công", review, 200);
        } catch (Exception e) {
            return new ResponseData(false, "Lấy thông tin thất bại", null, 400);
        }
    }
}
