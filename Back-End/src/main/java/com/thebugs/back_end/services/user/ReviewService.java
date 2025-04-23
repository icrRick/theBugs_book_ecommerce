package com.thebugs.back_end.services.user;

import java.util.Date;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.beans.ReviewBean;
import com.thebugs.back_end.beans.UpdateReviewBean;
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
        if (reviewBean.getOrderItemId() == null) {
            throw new IllegalArgumentException("OrderItemId không được null");
        }
        User user = userService.getUserToken(authorizationHeader);
        int userId = user.getId();
        OrderItem orderItem = orderItemService.getOrderItemById(reviewBean.getOrderItemId());

        if (orderItem.getOrder().getOrderStatus().getId() != 5) {
            throw new IllegalArgumentException("Chỉ có thể đánh giá khi đơn hàng đã được nhận");
        }

        Review review = new Review();
        review.setContent(reviewBean.getContent());
        review.setRate(reviewBean.getRating());
        review.setCreatedAt(new Date());
        review.setUpdatedAt(new Date());
        review.setUser(user);
        review.setOrderItem(orderItem);
        reviewJPA.save(review);
        return true;
    }

    public boolean updateReview(UpdateReviewBean updateReviewBean, String authorizationHeader) {
        if (updateReviewBean.getId() == null || updateReviewBean.getOrderItemId() == null) {
            throw new IllegalArgumentException("ID đánh giá hoặc OrderItemId không được null");
        }
        User user = userService.getUserToken(authorizationHeader);
        int userId = user.getId();
        Review review = findExitsReview(updateReviewBean.getId(), userId);
        if (review == null) {
            throw new IllegalArgumentException("Đánh giá không tồn tại hoặc bạn không có quyền chỉnh sửa");
        }

        if (!checkDayUpdateReview(updateReviewBean.getId())) {
            throw new IllegalArgumentException("Đã quá thời gian được thay đổi đánh giá");
        }

        review.setContent(updateReviewBean.getContent());
        review.setRate(updateReviewBean.getRating());
        review.setUpdatedAt(new Date());
        reviewJPA.save(review);
        return true;
    }

    public boolean checkDayUpdateReview(Integer reviewId) {
        if (reviewId == null) {
            return false;
        }
        Date dateNow = new Date();
        Review review = getReviewById(reviewId);
        Date dateCreateAt = review.getCreatedAt();
        long formatSecond = dateNow.getTime() - dateCreateAt.getTime();
        long checkDay = formatSecond / (1000 * 60 * 60 * 24);
        return checkDay <= 7;
    }

    public Review getReviewById(Integer id) {
        if (id == null) {
            throw new IllegalArgumentException("ID không được null");
        }
        return reviewJPA.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Đánh giá không tồn tại"));
    }

    public Review findExitsReview(Integer id, Integer userId) {
        return reviewJPA.findExitsReviewById(id, userId).orElse(null);
    }

    public boolean checkReviewExist(Integer orderItemId, Integer userId) {
        return reviewJPA.findExitsReviewByOrderItemId(orderItemId, userId).isPresent();
    }

    public Review findReviewByOrderItem(Integer orderItemId, Integer userId) {
        return reviewJPA.findExitsReviewByOrderItemId(orderItemId, userId).orElse(null);
    }
}
