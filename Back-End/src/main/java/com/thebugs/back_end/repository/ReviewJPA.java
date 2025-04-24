package com.thebugs.back_end.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.thebugs.back_end.entities.Review;

public interface ReviewJPA extends JpaRepository<Review, Integer> {
    // @Query("SELECT new com.thebugs.back_end.dto.ReviewDTO(" +
    // "r.id, r.content, u.fullName, u.avatar, r.rate, r.createdAt) " +
    // "FROM Review r " +
    // "LEFT JOIN r.user u " +
    // "WHERE r.orderItem.product.id = ?1")
    // List<ReviewDTO> getReviewContentsByProductId(Integer productId);

    @Query("SELECT r FROM Review r WHERE r.orderItem.id = ?1 AND r.user.id = ?2")
    Optional<Review> findExitsReviewByOrderItemId(Integer orderItemId, Integer userId);

}
