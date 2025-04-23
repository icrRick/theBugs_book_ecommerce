package com.thebugs.back_end.repository;

import java.util.Date;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.thebugs.back_end.dto.Seller_ProductPromotionDTO;
import com.thebugs.back_end.entities.Promotion;

public interface PromotionJPA extends JpaRepository<Promotion, Integer> {

       @Query("SELECT p FROM Promotion p WHERE " +
                     "p.shop.id = ?1 AND " +
                     "(?2 IS NULL OR p.startDate >= ?2) AND " +
                     "(?3 IS NULL OR p.expireDate <= ?3)")
       Page<Promotion> findByShopAndDateRange(Integer shopId, Date startDate, Date expireDate, Pageable pageable);

       @Query("SELECT COUNT(p) FROM Promotion p WHERE " +
                     "p.shop.id = ?1 AND " +
                     "(?2 IS NULL OR p.startDate >= ?2) AND " +
                     "(?3 IS NULL OR p.expireDate <= ?3)")
       int countByShopAndDateRange(Integer shopId, Date startDate, Date expireDate);

       @Query("""
                         SELECT new com.thebugs.back_end.dto.Seller_ProductPromotionDTO(
                             p.id, p.name, p.price,
                             promo.promotionValue,
                             promo.startDate, promo.expireDate
                         )
                         FROM PromotionProduct pp
                         JOIN pp.product p
                         JOIN pp.promotion promo
                         JOIN p.shop s
                         WHERE s.id = ?1 AND promo.active = true
                     """)
       Page<Seller_ProductPromotionDTO> getPromotions(Integer shopId, Pageable pageable);
}