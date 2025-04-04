package com.thebugs.back_end.repository;

import java.util.ArrayList;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.thebugs.back_end.dto.FavoriteDTO;
import com.thebugs.back_end.entities.Favorite;

public interface FavoriteJPA extends JpaRepository<Favorite, Integer> {

        @Query("SELECT f FROM Favorite f WHERE f.user.id = ?1")
        ArrayList<Favorite> findByUserId(Integer userId);

        @Query("SELECT new com.thebugs.back_end.dto.FavoriteDTO(" +
                        "fa.id,p.id, p.name, p.price, " +
                        "(SELECT i.imageName FROM Image i WHERE i.product.id = p.id AND i.id = (SELECT MIN(i2.id) FROM Image i2 WHERE i2.product.id = p.id)), "
                        +
                        "COALESCE(ROUND(AVG(r.rate), 1), 0), " +
                        "pr.promotionValue) " +
                        "FROM Favorite fa " +
                        "LEFT JOIN Product p ON fa.product.id = p.id " +
                        "LEFT JOIN OrderItem o ON o.product.id = p.id " +
                        "LEFT JOIN Review r ON r.orderItem.id = o.id " +
                        "LEFT JOIN PromotionProduct pp ON p.id = pp.product.id " +
                        "LEFT JOIN Promotion pr ON pp.promotion.id = pr.id " +
                        "WHERE fa.user.id = ?1" +
                        "GROUP BY fa.id, p.id, p.name, p.price, pr.promotionValue")
        Page<FavoriteDTO> getFavoritePage(Integer userID, Pageable pageable);
}
