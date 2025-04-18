package com.thebugs.back_end.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.thebugs.back_end.dto.HomeProductDTO;
import com.thebugs.back_end.entities.Product;

@Repository
public interface ProductHomeRepository extends JpaRepository<Product, Integer> {

        @Query("SELECT new com.thebugs.back_end.dto.HomeProductDTO(" +
                        "p.id, p.name, p.price, " +
                        "COALESCE((SELECT i.imageName FROM Image i WHERE i.product.id = p.id ORDER BY i.id LIMIT 1), '/placeholder.svg'), "
                        +
                        "COALESCE(ROUND(AVG(r.rate), 1), 0.0), " +
                        "COALESCE(pr.promotionValue, 0.0), " +
                        "CASE WHEN DATEDIFF(CURRENT_DATE, p.createdAt) <= 30 THEN true ELSE false END, " +
                        "COALESCE(p.price * pr.promotionValue / 100, 0.0), " +
                        "COALESCE((SELECT a.name FROM ProductAuthor pa JOIN Author a ON pa.author.id = a.id WHERE pa.product.id = p.id ORDER BY pa.id LIMIT 1), 'Unknown Author')) "
                        +
                        "FROM Product p " +
                        "LEFT JOIN OrderItem o ON o.product.id = p.id " +
                        "LEFT JOIN Review r ON r.orderItem.id = o.id " +
                        "LEFT JOIN PromotionProduct pp ON p.id = pp.product.id " +
                        "LEFT JOIN Promotion pr ON pp.promotion.id = pr.id AND pr.active = true " +
                        "LEFT JOIN ProductAuthor pa ON pa.product.id = p.id " +
                        "LEFT JOIN Author a ON pa.author.id = a.id " +
                        "WHERE p.active = true " +
                        "GROUP BY p.id, p.name, p.price, pr.promotionValue, p.createdAt")
        Page<HomeProductDTO> getHomeProducts(Pageable pageable);

        @Query("SELECT new com.thebugs.back_end.dto.HomeProductDTO(" +
                        "p.id, p.name, p.price, " +
                        "COALESCE((SELECT i.imageName FROM Image i WHERE i.product.id = p.id ORDER BY i.id LIMIT 1), '/placeholder.svg'), "
                        +
                        "COALESCE(ROUND(AVG(r.rate), 1), 0.0), " +
                        "COALESCE(pr.promotionValue, 0.0), " +
                        "CASE WHEN DATEDIFF(CURRENT_DATE, p.createdAt) <= 30 THEN true ELSE false END, " +
                        "COALESCE(p.price * pr.promotionValue / 100, 0.0), " +
                        "COALESCE((SELECT a.name FROM ProductAuthor pa JOIN Author a ON pa.author.id = a.id WHERE pa.product.id = p.id ORDER BY pa.id LIMIT 1), 'Unknown Author')) "
                        +
                        "FROM Product p " +
                        "LEFT JOIN OrderItem oi ON p.id = oi.product.id " +
                        "LEFT JOIN Review r ON r.orderItem.id = oi.id " +
                        "LEFT JOIN PromotionProduct pp ON p.id = pp.product.id " +
                        "LEFT JOIN Promotion pr ON pp.promotion.id = pr.id AND pr.active = true " +
                        "WHERE p.active = true AND p.approve = true " +
                        "AND COALESCE(SUM(oi.quantity), 0) > 0 " +
                        "GROUP BY p.id, p.name, p.price, pr.promotionValue, p.createdAt " +
                        "ORDER BY SUM(oi.quantity) DESC")
        List<HomeProductDTO> findPopularProducts(Pageable pageable);

        @Query("SELECT new com.thebugs.back_end.dto.HomeProductDTO(" +
                        "p.id, p.name, p.price, " +
                        "COALESCE((SELECT i.imageName FROM Image i WHERE i.product.id = p.id ORDER BY i.id LIMIT 1), '/placeholder.svg'), "
                        +
                        "COALESCE(ROUND(AVG(r.rate), 1), 0.0), " +
                        "COALESCE(pr.promotionValue, 0.0), " +
                        "CASE WHEN DATEDIFF(CURRENT_DATE, p.createdAt) <= 30 THEN true ELSE false END, " +
                        "COALESCE(p.price * pr.promotionValue / 100, 0.0), " +
                        "COALESCE((SELECT a.name FROM ProductAuthor pa JOIN Author a ON pa.author.id = a.id WHERE pa.product.id = p.id ORDER BY pa.id LIMIT 1), 'Unknown Author')) "
                        +
                        "FROM Product p " +
                        "LEFT JOIN OrderItem oi ON p.id = oi.product.id " +
                        "LEFT JOIN Review r ON r.orderItem.id = oi.id " +
                        "LEFT JOIN PromotionProduct pp ON p.id = pp.product.id " +
                        "LEFT JOIN Promotion pr ON pp.promotion.id = pr.id AND pr.active = true " +
                        "WHERE p.active = true AND p.approve = true " +
                        "AND DATEDIFF(CURRENT_DATE, p.createdAt) <= 30 " +
                        "GROUP BY p.id, p.name, p.price, pr.promotionValue, p.createdAt " +
                        "ORDER BY p.createdAt DESC")
        List<HomeProductDTO> findNewProducts(Pageable pageable);

        @Query("SELECT new com.thebugs.back_end.dto.HomeProductDTO(" +
                        "p.id, p.name, p.price, " +
                        "COALESCE((SELECT i.imageName FROM Image i WHERE i.product.id = p.id ORDER BY i.id LIMIT 1), '/placeholder.svg'), "
                        +
                        "COALESCE(ROUND(AVG(r.rate), 1), 0.0), " +
                        "COALESCE(pr.promotionValue, 0.0), " +
                        "CASE WHEN DATEDIFF(CURRENT_DATE, p.createdAt) <= 30 THEN true ELSE false END, " +
                        "COALESCE(p.price * pr.promotionValue / 100, 0.0), " +
                        "COALESCE((SELECT a.name FROM ProductAuthor pa JOIN Author a ON pa.author.id = a.id WHERE pa.product.id = p.id ORDER BY pa.id LIMIT 1), 'Unknown Author')) "
                        +
                        "FROM Product p " +
                        "LEFT JOIN OrderItem oi ON p.id = oi.product.id " +
                        "LEFT JOIN Review r ON r.orderItem.id = oi.id " +
                        "LEFT JOIN PromotionProduct pp ON p.id = pp.product.id " +
                        "LEFT JOIN Promotion pr ON pp.promotion.id = pr.id AND pr.active = true " +
                        "WHERE p.active = true AND p.approve = true " +
                        "AND pr.promotionValue IS NOT NULL " +
                        "GROUP BY p.id, p.name, p.price, pr.promotionValue, p.createdAt " +
                        "ORDER BY pr.promotionValue DESC")
        List<HomeProductDTO> findSaleProducts(Pageable pageable);
}
