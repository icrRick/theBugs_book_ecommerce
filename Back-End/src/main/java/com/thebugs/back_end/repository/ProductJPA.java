package com.thebugs.back_end.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.thebugs.back_end.dto.HomeProductDTO;
import com.thebugs.back_end.dto.ProItemDTO;
import com.thebugs.back_end.dto.ProductDetailDTO;
import com.thebugs.back_end.entities.Product;

public interface ProductJPA extends JpaRepository<Product, Integer> {
        
        @Query("SELECT g FROM Product g WHERE :keyword IS NULL OR g.name LIKE %:keyword% ")
        Page<Product> findByName(@Param("keyword") String keyword, Pageable pageable);

        @Query("SELECT COUNT(g) FROM Product g WHERE :keyword IS NULL OR :keyword = '' OR g.name LIKE %:keyword%")
        int countfindByName(@Param("keyword") String keyword);

        @Query("SELECT g FROM Product g WHERE g.active = ?1")
        Page<Product> PageProductAllByActive(boolean active, Pageable pageable);

        @Query("SELECT new com.thebugs.back_end.dto.HomeProductDTO(" +
                        "p.id, p.name, p.price, " +
                        "(SELECT i.imageName FROM Image i WHERE i.product.id = p.id AND i.id = (SELECT MIN(i2.id) FROM Image i2 WHERE i2.product.id = p.id)), "
                        +
                        "COALESCE(ROUND(AVG(r.rate), 1), 0), " +
                        "pr.promotionValue) " +
                        "FROM Product p " +
                        "LEFT JOIN OrderItem o ON o.product.id = p.id " +
                        "LEFT JOIN Review r ON r.orderItem.id = o.id " +
                        "LEFT JOIN PromotionProduct pp ON p.id = pp.product.id " +
                        "LEFT JOIN Promotion pr ON pp.promotion.id = pr.id " +
                        "WHERE p.active = true " +
                        "GROUP BY p.id, p.name, p.price, pr.promotionValue")
        Page<HomeProductDTO> getHomeProducts(Pageable pageable);

        @Query("SELECT new com.thebugs.back_end.dto.ProductDetailDTO(" +
                        "p.id, p.name, p.weight ," +
                        "COALESCE(ROUND(AVG(r.rate), 1), 0), " +
                        "p.price, " +
                        "pr.promotionValue, " +
                        "CAST(COUNT(DISTINCT r.id) AS integer), " +
                        "CAST(COUNT(DISTINCT o.id) AS integer), " +
                        "p.description) " +
                        "FROM Product p " +
                        "LEFT JOIN OrderItem o ON o.product.id = p.id " +
                        "LEFT JOIN Review r ON r.orderItem.id = o.id " +
                        "LEFT JOIN PromotionProduct pp ON p.id = pp.product.id " +
                        "LEFT JOIN Promotion pr ON pp.promotion.id = pr.id " +
                        "WHERE p.active = true AND p.id = ?1 " +
                        "GROUP BY p.id, p.name, p.price, pr.promotionValue, p.description")
        Optional<ProductDetailDTO> getProductDetail(Integer productId);


        @Query("SELECT new com.thebugs.back_end.dto.ProItemDTO(p.id, p.name, p.price, " +
                        "COALESCE(i.imageName, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'), "
                        +
                        "COALESCE(pr.promotionValue, 0), p.weight, " +
                        "COALESCE(ROUND(AVG(r.rate), 1), 0)) " +
                        "FROM Product p " +
                        "LEFT JOIN OrderItem o ON o.product.id = p.id " +
                        "LEFT JOIN Review r ON r.orderItem.id = o.id " +
                        "LEFT JOIN PromotionProduct pp ON pp.product.id = p.id " +
                        "LEFT JOIN Promotion pr ON pr.id = pp.promotion.id " +
                        "LEFT JOIN Image i ON i.product.id = p.id " +
                        "WHERE p.active = true " +
                        "AND p.id = ?1 " +
                        "AND (i.id = (SELECT MAX(i2.id) FROM Image i2 WHERE i2.product.id = p.id) OR i.imageName IS NULL) "
                        +
                        "GROUP BY p.id, p.name, p.price, pr.promotionValue, p.weight, i.imageName")
        Optional<ProItemDTO> getProItemDTO(Integer productId);

        // code cua tam
        @Query("SELECT p FROM Product p WHERE p.shop.id = :shopId AND p.id = :productId")
        Product findProductByShopId(@Param("shopId") Integer shopId,
                        @Param("productId") Integer productId);




        @Query("SELECT p FROM Product p WHERE p.product_code = ?1 ")
        Optional<Product> findProductByProductCode(String productCode);               

}
