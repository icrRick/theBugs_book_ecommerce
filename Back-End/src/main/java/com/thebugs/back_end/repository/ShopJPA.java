package com.thebugs.back_end.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.thebugs.back_end.dto.FlashSaleShopDTO;
import com.thebugs.back_end.dto.ShopDetailDTO;
import com.thebugs.back_end.entities.Shop;

public interface ShopJPA extends JpaRepository<Shop, Integer> {
        @Query("SELECT new com.thebugs.back_end.dto.ShopDetailDTO(" +
                        "s.id, s.image, s.name, u.verify) " +
                        "FROM Shop s " +
                        "LEFT JOIN User u ON s.user.id = u.id " +
                        "WHERE s.active = true AND s.id = ?1")
        Optional<ShopDetailDTO> getShopDetail(Integer shopId);

        @Query("SELECT new com.thebugs.back_end.dto.FlashSaleShopDTO(" +
                        "s.id, s.name, s.image, " +
                        "CAST(COUNT(p.id) AS integer), " +
                        "MAX(pr.promotionValue), " +
                        "(SELECT i.imageName FROM Image i JOIN Product p2 ON i.product.id = p2.id WHERE p2.shop.id = s.id ORDER BY i.id ASC LIMIT 1)) "
                        +
                        "FROM Shop s " +
                        "JOIN Product p ON s.id = p.shop.id " +
                        "JOIN PromotionProduct pp ON p.id = pp.product.id " +
                        "JOIN Promotion pr ON pp.promotion.id = pr.id " +
                        "WHERE pr.active = true AND pr.flashSale = true " +
                        "AND pr.startDate <= CURRENT_DATE " +
                        "AND pr.expireDate >= CURRENT_DATE " +
                        "GROUP BY s.id, s.name, s.image")
        List<FlashSaleShopDTO> findFlashSaleShops();
}
