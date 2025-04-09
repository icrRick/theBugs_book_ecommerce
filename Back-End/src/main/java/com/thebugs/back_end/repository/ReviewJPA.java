package com.thebugs.back_end.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.thebugs.back_end.dto.ReviewDTO;
import com.thebugs.back_end.entities.Review;

public interface ReviewJPA extends JpaRepository<Review, Integer> {
    @Query("SELECT new com.thebugs.back_end.dto.ReviewDTO(" +
            "r.id, r.content, u.fullName, u.avatar, r.rate, r.createdAt) " +
            "FROM Review r " +
            "LEFT JOIN r.user u " +
            "WHERE r.orderItem.product.id = ?1")
    List<ReviewDTO> getReviewContentsByProductId(Integer productId);
}
