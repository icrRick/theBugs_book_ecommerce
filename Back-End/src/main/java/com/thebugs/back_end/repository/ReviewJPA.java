package com.thebugs.back_end.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.thebugs.back_end.dto.Seller_ReviewDTO;
import com.thebugs.back_end.entities.Review;

public interface ReviewJPA extends JpaRepository<Review, Integer> {
    // @Query("SELECT new com.thebugs.back_end.dto.ReviewDTO(" +
    // "r.id, r.content, u.fullName, u.avatar, r.rate, r.createdAt) " +
    // "FROM Review r " +
    // "LEFT JOIN r.user u " +
    // "WHERE r.orderItem.product.id = ?1")
    // List<ReviewDTO> getReviewContentsByProductId(Integer productId);
    @Query("SELECT new com.thebugs.back_end.dto.Seller_ReviewDTO(" +
            "r.id, r.rate, r.content, r.reply, r.createdAt, r.replyAt, r.updatedAt, " +
            "u.fullName, u.avatar, " +
            "p.product_code, p.name, " +
            "(SELECT i.imageName FROM Image i WHERE i.product.id = p.id ORDER BY i.id ASC LIMIT 1)) " +
            "FROM Review r " +
            "JOIN r.user u " +
            "JOIN r.orderItem oi " +
            "JOIN oi.product p " +
            "JOIN p.shop s " +
            "WHERE s.id = ?1 " +
            "AND (?2 = 0 OR r.rate = ?2) " +
            "AND (?3 = '' OR (p.name like ?3 OR p.product_code like ?3OR u.fullName like ?3)) " +
            "AND (?4 IS NULL OR (?4 = true AND r.reply IS NOT NULL) OR (?4 = false AND r.reply IS NULL))")
    Page<Seller_ReviewDTO> getFullReviewByShopId(Integer shopId, Integer rate, String keyword, Boolean isReply,
            Pageable pageable);

    @Query("SELECT " + "r.rate " +
            "FROM Review r " +
            "JOIN r.orderItem oi " +
            "JOIN oi.product p " +
            "JOIN p.shop s " +
            "WHERE s.id = ?1")
    List<Integer> getAllReviewByShopId(Integer shopId);
    // @Query("SELECT new com.thebugs.back_end.dto.ReviewDTO(" +
    // "r.id, r.content, u.fullName, u.avatar, r.rate, r.createdAt) " +
    // "FROM Review r " +
    // "LEFT JOIN r.user u " +
    // "WHERE r.orderItem.product.id = ?1")
    // List<ReviewDTO> getReviewContentsByProductId(Integer productId);

    @Query("SELECT r FROM Review r WHERE r.orderItem.id = ?1 AND r.user.id = ?2")
    Optional<Review> findExitsReviewByOrderItemId(Integer orderItemId, Integer userId);
   
    @Query("""
        SELECT 
           COALESCE(AVG(r.rate), 0) 
        FROM Review r
        WHERE r.orderItem.product.id = :productId
    """)
    double getAverageRateByProductId(@Param("productId") Integer productId);
    
    

    @Query("""
                SELECT COUNT(r)
                FROM Review r
                WHERE r.orderItem.product.id = :productId
            """)
    int countReviewByProductId(@Param("productId") Integer productId);




    @Query("""
        SELECT AVG(r.rate)
        FROM Review r
        WHERE r.orderItem.product.shop.id = :shopId
    """)
    double getAverageRateByShopId(@Param("shopId") Integer shopId);
    
    @Query("""
        SELECT COUNT(r)
        FROM Review r
        WHERE r.orderItem.product.shop.id = :shopId
    """)
    int countReviewByShopId(@Param("shopId") Integer shopId);


    
}
