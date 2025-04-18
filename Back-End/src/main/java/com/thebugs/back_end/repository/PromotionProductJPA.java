package com.thebugs.back_end.repository;

import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.thebugs.back_end.dto.HomePromotionDTO;
import com.thebugs.back_end.entities.PromotionProduct;

public interface PromotionProductJPA extends JpaRepository<PromotionProduct, Integer> {
        @Query("SELECT pp FROM PromotionProduct pp " +
                        "WHERE pp.product.id = :productId ")
        Optional<PromotionProduct> findByPromotionProductByProductId(
                        @Param("productId") Integer productId);

        @Query("SELECT new com.thebugs.back_end.dto.HomePromotionDTO(" +
                        "p.id, p.promotionValue, p.startDate, p.expireDate, s.name) " +
                        "FROM Promotion p " +
                        "JOIN Shop s ON p.shop.id = s.id " +
                        "WHERE p.active = true " +
                        "AND p.startDate <= CURRENT_DATE " +
                        "AND p.expireDate >= CURRENT_DATE")
        List<HomePromotionDTO> getActivePromotions();
}
