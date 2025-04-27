package com.thebugs.back_end.services.user;

import java.util.Date;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.beans.ReviewBean;

import com.thebugs.back_end.entities.OrderItem;
import com.thebugs.back_end.entities.Review;
import com.thebugs.back_end.entities.User;
import com.thebugs.back_end.repository.ReviewJPA;

@Service
public class ReviewService { // Không cần abstract nếu là service cụ thể
    @Autowired
    private ReviewJPA reviewJPA;
    @Autowired
    private UserService userService;
    @Autowired
    private OrderItemService orderItemService;

    // // Trả về danh sách ReviewDTO theo productId
    // public List<ReviewDTO> getReviewDTOsByProductId(Integer productId) {
    // return reviewJPA.getReviewContentsByProductId(productId);
    // }

    // // Nếu bạn muốn trả về một ReviewDTO duy nhất (ví dụ: review đầu tiên)
    // public ReviewDTO getFirstReviewDTO(Integer productId) {
    // List<ReviewDTO> reviewContents =
    // reviewJPA.getReviewContentsByProductId(productId);
    // return reviewContents.isEmpty() ? null : reviewContents.get(0);
    // }




    // createReview product by Tam
    public boolean createReview(ReviewBean reviewBean, String authorizationHeader) {
        OrderItem orderItem = orderItemService.getOrderItemById(reviewBean.getOrderItemId());
        User user = userService.getUserToken(authorizationHeader);
        int userId = user.getId();
        Optional<Review> reviewOptional = reviewJPA.findExitsReviewByOrderItemId(reviewBean.getOrderItemId(), userId);
        if (reviewOptional.isPresent()) {
            throw new IllegalArgumentException("Đã có đánh giá của bạn cho sản phẩm này");
        }
        if (orderItem.getOrder().getOrderStatus().getId() != 6) {
            throw new IllegalArgumentException("Chỉ có thể đánh giá khi đơn hàng đã nhận được hàng");
        }
        if (reviewBean.getRating() < 1 || reviewBean.getRating() > 5) {
            throw new IllegalArgumentException("Chỉ có thể đánh giá từ 1 đến 5 sao");
        }
        Review review = new Review();
        review.setOrderItem(orderItem);
        review.setContent(reviewBean.getContent());
        review.setRate(reviewBean.getRating());
        review.setCreatedAt(new Date());
        review.setUpdatedAt(new Date());
        review.setUser(user);
        reviewJPA.save(review);
        return true;
    }

    public boolean checkReviewExist(Integer orderItemId, Integer userId) {
        return reviewJPA.findExitsReviewByOrderItemId(orderItemId,
                userId).isPresent();
    }



    public double getAverageRateByProductId(Integer productId) {
        return reviewJPA.getAverageRateByProductId(productId);
    }

    public double getAverageRatingByShopId(Integer shopId) {
        return reviewJPA.getAverageRatingByShop(shopId);
    }

    public int countReviewByProductId(Integer productId) {
        return reviewJPA.countReviewByProductId(productId);
    }
    public int countReviewByShopId(Integer shopId) {
        return reviewJPA.countReviewByShopId(shopId);
    }



}
