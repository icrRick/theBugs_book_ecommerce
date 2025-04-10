package com.thebugs.back_end.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.thebugs.back_end.entities.PromotionProduct;

public interface PromotionProductJPA extends JpaRepository<PromotionProduct, Integer> {
        @Query("SELECT pp FROM PromotionProduct pp " +
                        "WHERE pp.product.id = :productId ")
        PromotionProduct findByPromotionProductByProductId(
                        @Param("productId") Integer productId);
}
