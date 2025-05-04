package com.thebugs.back_end.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.thebugs.back_end.dto.HomeProductDTO;
import com.thebugs.back_end.entities.Product;

@Repository
public interface ProductHomeRepository extends JpaRepository<Product, Integer> {

        @Query(value = """
                            SELECT new com.thebugs.back_end.dto.HomeProductDTO(
                                p.id,
                                p.name,
                                p.price,
                                i.imageName,
                                COALESCE((SELECT AVG(r.rate) FROM Review r WHERE r.orderItem.id IN (SELECT oi.id FROM OrderItem oi WHERE oi.product.id = p.id)), 0.0),
                                COALESCE((SELECT COUNT(r) FROM Review r WHERE r.orderItem.id IN (SELECT oi.id FROM OrderItem oi WHERE oi.product.id = p.id)), 0),
                                COALESCE(pr.promotionValue, 0.0),
                                CASE WHEN p.createdAt >= :thirtyDaysAgo THEN true ELSE false END,
                                CASE WHEN pr.flashSale = true AND COALESCE(pr.active, false) = true AND pr.startDate <= CURRENT_DATE AND pr.expireDate >= CURRENT_DATE
                                THEN COALESCE((p.price * pr.promotionValue / 100), 0.0) ELSE 0.0 END,
                                p.product_code,
                                CASE WHEN pr.flashSale = true AND COALESCE(pr.active, false) = true AND pr.startDate <= CURRENT_DATE AND pr.expireDate >= CURRENT_DATE THEN true ELSE false END
                            )
                            FROM Product p
                            LEFT JOIN p.images i
                            LEFT JOIN p.promotionProducts pp
                            LEFT JOIN pp.promotion pr
                            WHERE p.active = true AND (p.approve is not null and p.approve = true) AND (p.status is null or (p.status is not null and p.status = false))
                            AND (i.id = (SELECT MIN(i2.id) FROM Image i2 WHERE i2.product.id = p.id))
                            ORDER BY p.id DESC
                        """)
        Page<HomeProductDTO> getHomeProducts(Pageable pageable, @Param("thirtyDaysAgo") LocalDate thirtyDaysAgo);

        @Query("SELECT new com.thebugs.back_end.dto.HomeProductDTO(" +
                        "p.id, p.name, p.price, " +
                        "COALESCE((SELECT i.imageName FROM Image i WHERE i.product.id = p.id ORDER BY i.id LIMIT 1), '/placeholder.svg'), "
                        +
                        "COALESCE((SELECT ROUND(AVG(r.rate), 1) FROM Review r WHERE r.orderItem.id IN (SELECT oi.id FROM OrderItem oi WHERE oi.product.id = p.id)), 0.0), "
                        +
                        "COALESCE((SELECT COUNT(r) FROM Review r WHERE r.orderItem.id IN (SELECT oi.id FROM OrderItem oi WHERE oi.product.id = p.id)), 0), "
                        +
                        "COALESCE(pr.promotionValue, 0.0), " +
                        "CASE WHEN p.createdAt >= :thirtyDaysAgo THEN true ELSE false END, " +
                        "CASE WHEN pr.flashSale = true AND COALESCE(pr.active, false) = true AND pr.startDate <= CURRENT_DATE AND pr.expireDate >= CURRENT_DATE "
                        +
                        "THEN COALESCE(p.price * pr.promotionValue / 100, 0.0) ELSE 0.0 END, " +
                        "p.product_code, " +
                        "CASE WHEN pr.flashSale = true AND COALESCE(pr.active, false) = true AND pr.startDate <= CURRENT_DATE AND pr.expireDate >= CURRENT_DATE THEN true ELSE false END"
                        +
                        ") " +
                        "FROM Product p " +
                        "LEFT JOIN PromotionProduct pp ON p.id = pp.product.id " +
                        "LEFT JOIN Promotion pr ON pp.promotion.id = pr.id AND pr.active = true " +
                        "WHERE p.active = true AND (p.approve is not null and p.approve = true) AND (p.status is null or (p.status is not null and p.status = false)) "
                        +
                        "AND EXISTS (SELECT oi FROM OrderItem oi WHERE oi.product.id = p.id) " +
                        "AND COALESCE((SELECT ROUND(AVG(r.rate), 1) FROM Review r WHERE r.orderItem.id IN (SELECT oi.id FROM OrderItem oi WHERE oi.product.id = p.id)), 0.0) >= 4.0 "
                        +
                        "ORDER BY (SELECT COALESCE(SUM(oi.quantity), 0) FROM OrderItem oi WHERE oi.product.id = p.id) DESC")
        List<HomeProductDTO> findPopularProducts(Pageable pageable, @Param("thirtyDaysAgo") LocalDate thirtyDaysAgo);

        @Query("SELECT new com.thebugs.back_end.dto.HomeProductDTO(" +
                        "p.id, p.name, p.price, " +
                        "COALESCE((SELECT i.imageName FROM Image i WHERE i.product.id = p.id ORDER BY i.id LIMIT 1), '/placeholder.svg'), "
                        +
                        "COALESCE(ROUND(AVG(r.rate), 1), 0.0), " +
                        "COALESCE((SELECT COUNT(r) FROM Review r WHERE r.orderItem.id = oi.id), 0), " +
                        "COALESCE(pr.promotionValue, 0.0), " +
                        "CASE WHEN p.createdAt >= :thirtyDaysAgo THEN true ELSE false END, " +
                        "CASE WHEN pr.flashSale = true AND COALESCE(pr.active, false) = true AND pr.startDate <= CURRENT_DATE AND pr.expireDate >= CURRENT_DATE "
                        +
                        "THEN COALESCE(p.price * pr.promotionValue / 100, 0.0) ELSE 0.0 END, " +
                        "p.product_code, " +
                        "CASE WHEN pr.flashSale = true AND COALESCE(pr.active, false) = true AND pr.startDate <= CURRENT_DATE AND pr.expireDate >= CURRENT_DATE THEN true ELSE false END"
                        +
                        ") " +
                        "FROM Product p " +
                        "LEFT JOIN OrderItem oi ON p.id = oi.product.id " +
                        "LEFT JOIN Review r ON r.orderItem.id = oi.id " +
                        "LEFT JOIN PromotionProduct pp ON p.id = pp.product.id " +
                        "LEFT JOIN Promotion pr ON pp.promotion.id = pr.id AND pr.active = true " +
                        "WHERE p.active = true AND (p.approve is not null and p.approve = true) AND (p.status is null or (p.status is not null and p.status = false)) "
                        +
                        "AND p.createdAt >= :thirtyDaysAgo " +
                        "GROUP BY p.id, p.name, p.price, COALESCE(pr.promotionValue, 0.0), p.createdAt " +
                        "ORDER BY p.createdAt DESC")
        List<HomeProductDTO> findNewProducts(Pageable pageable, @Param("thirtyDaysAgo") LocalDate thirtyDaysAgo);

        @Query("SELECT new com.thebugs.back_end.dto.HomeProductDTO(" +
                        "p.id, p.name, p.price, " +
                        "COALESCE((SELECT i.imageName FROM Image i WHERE i.product.id = p.id ORDER BY i.id LIMIT 1), '/placeholder.svg'), "
                        +
                        "COALESCE(ROUND(AVG(r.rate), 1), 0.0), " +
                        "COALESCE((SELECT COUNT(r) FROM Review r WHERE r.orderItem.id = oi.id), 0), " +
                        "COALESCE(pr.promotionValue, 0.0), " +
                        "CASE WHEN p.createdAt >= :thirtyDaysAgo THEN true ELSE false END, " +
                        "CASE WHEN pr.flashSale = true AND COALESCE(pr.active, false) = true AND pr.startDate <= CURRENT_DATE AND pr.expireDate >= CURRENT_DATE "
                        +
                        "THEN COALESCE(p.price * pr.promotionValue / 100, 0.0) ELSE 0.0 END, " +
                        "p.product_code, " +
                        "CASE WHEN pr.flashSale = true AND COALESCE(pr.active, false) = true AND pr.startDate <= CURRENT_DATE AND pr.expireDate >= CURRENT_DATE THEN true ELSE false END"
                        +
                        ") " +
                        "FROM Product p " +
                        "LEFT JOIN OrderItem oi ON p.id = oi.product.id " +
                        "LEFT JOIN Review r ON r.orderItem.id = oi.id " +
                        "LEFT JOIN PromotionProduct pp ON p.id = pp.product.id " +
                        "LEFT JOIN Promotion pr ON pp.promotion.id = pr.id AND pr.active = true " +
                        "WHERE p.active = true AND (p.approve is not null and p.approve = true) AND (p.status is null or (p.status is not null and p.status = false)) "
                        +
                        "AND pr.promotionValue IS NOT NULL " +
                        "AND pr.flashSale = true " +
                        "AND COALESCE(pr.active, false) = true AND pr.startDate <= CURRENT_DATE AND pr.expireDate >= CURRENT_DATE "
                        +
                        "GROUP BY p.id, p.name, p.price, pr.promotionValue, p.createdAt " +
                        "ORDER BY pr.promotionValue DESC")
        List<HomeProductDTO> findSaleProducts(Pageable pageable, @Param("thirtyDaysAgo") LocalDate thirtyDaysAgo);

        @Query("SELECT a.name " +
                        "FROM Product p " +
                        "JOIN p.productAuthors pa " +
                        "JOIN pa.author a " +
                        "WHERE p.id = :productId")
        List<String> findAuthorNamesByProductId(@Param("productId") Integer productId);

        @Query("SELECT g.name " +
                        "FROM Product p " +
                        "JOIN p.productGenres pg " +
                        "JOIN pg.genre g " +
                        "WHERE p.id = :productId")
        List<String> findGenreNamesByProductId(@Param("productId") Integer productId);

        @Query("SELECT i.imageName " +
                        "FROM Product p " +
                        "JOIN p.images i " +
                        "WHERE p.id = :productId " +
                        "ORDER BY i.id")
        List<String> findImageNamesByProductId(@Param("productId") Integer productId);
}