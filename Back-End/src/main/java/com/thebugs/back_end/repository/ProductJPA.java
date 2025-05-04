package com.thebugs.back_end.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.thebugs.back_end.dto.ProItemDTO;
import com.thebugs.back_end.dto.ProductDetailDTO;
import com.thebugs.back_end.dto.RelatedProductDTO;
import com.thebugs.back_end.dto.SearchProductDTO;
import com.thebugs.back_end.dto.Seller_ProductPromotionDTO;
import com.thebugs.back_end.entities.Genre;
import com.thebugs.back_end.entities.Product;

public interface ProductJPA extends JpaRepository<Product, Integer> {

    @Query("SELECT g FROM Product g WHERE :keyword IS NULL OR g.name LIKE %:keyword% ")
    Page<Product> findByName(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT COUNT(g) FROM Product g WHERE :keyword IS NULL OR :keyword = '' OR g.name LIKE %:keyword%")
    int countfindByName(@Param("keyword") String keyword);

    @Query("SELECT g FROM Product g WHERE g.active = ?1")
    Page<Product> PageProductAllByActive(boolean active, Pageable pageable);

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
    Optional<Product> findProductByShopId(@Param("shopId") Integer shopId,
            @Param("productId") Integer productId);

    @Query("SELECT p FROM Product p WHERE p.product_code = ?1 ")
    Optional<Product> findProductByProductCode(String productCode);

    @Query("SELECT p FROM Product p WHERE p.product_code = ?1 ")
    Optional<Product> getProductByProductCode(String productCode);

    @Query("SELECT new com.thebugs.back_end.dto.ProItemDTO(p.id, p.name, p.price, " +
            "COALESCE(i.imageName, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'), "
            +
            "COALESCE(pr.promotionValue, 0), p.weight, " +
            "COALESCE(ROUND(AVG(r.rate), 1), 0), p.product_code) " +
            "FROM Product p " +
            "LEFT JOIN OrderItem o ON o.product.id = p.id " +
            "LEFT JOIN Review r ON r.orderItem.id = o.id " +
            "LEFT JOIN PromotionProduct pp ON pp.product.id = p.id " +
            "LEFT JOIN Promotion pr ON pr.id = pp.promotion.id " +
            "LEFT JOIN Image i ON i.product.id = p.id " +
            "WHERE p.active = true AND p.approve = true " +
            "AND (i.id = (SELECT MAX(i2.id) FROM Image i2 WHERE i2.product.id = p.id) OR i.imageName IS NULL) "
            +
            "GROUP BY p.id, p.name, p.price, pr.promotionValue, p.weight, i.imageName, p.product_code")
    List<ProItemDTO> getAllProItemDTO();

    @Query("""
                SELECT new com.thebugs.back_end.dto.Seller_ProductPromotionDTO(
                    p.id, p.name, p.price,
                        promo.promotionValue, promo.startDate, promo.expireDate, promo.active
                )
                FROM Product p
                LEFT JOIN p.promotionProducts pp
                LEFT JOIN pp.promotion promo
                JOIN p.shop s
                WHERE s.id = ?1 AND (promo.active = true OR promo IS NULL)
            """)
    Page<Seller_ProductPromotionDTO> getPromotions(Integer shopId, Pageable pageable);

    // search product by code tam

    @Query("""
                SELECT new com.thebugs.back_end.dto.SearchProductDTO(
                    p.id,
                    p.name,
                    p.price,
                    i.imageName,
                    COALESCE(AVG(r.rate), 0.0),
                     CAST(COALESCE(COUNT(r.id), 0) AS INTEGER),
                    COALESCE(SUM(oi.quantity), 0),
                    pr.promotionValue,
                    COALESCE((p.price - (p.price * pr.promotionValue / 100)), 0.0),
                    p.product_code,
                    s.id,
                    s.name

                )
                FROM Product p
                LEFT JOIN p.images i
                LEFT JOIN p.promotionProducts pp
               LEFT JOIN pp.promotion pr ON pr.id = pp.promotion.id
                    AND pr.active = true
                    AND pr.startDate <= CURRENT_DATE
                    AND pr.expireDate >= CURRENT_DATE
                LEFT JOIN p.productGenres pg
                LEFT JOIN p.shop s
                LEFT JOIN p.orderItems oi
                LEFT JOIN oi.reviews r
                WHERE p.active = true
                  AND p.approve = true
                  AND (p.status IS NULL OR p.status = false)
                  AND (i.id = (SELECT MIN(i2.id) FROM Image i2 WHERE i2.product.id = p.id))
                  AND (:productName IS NULL OR LOWER(p.name) LIKE LOWER(:productName) OR LOWER(p.product_code) = LOWER(:productName))
                  AND (:minPrice IS NULL OR (p.price - (p.price * pr.promotionValue / 100)) >= :minPrice)
                  AND (:maxPrice IS NULL OR (p.price - (p.price * pr.promotionValue / 100)) <= :maxPrice)
                  AND (:genresIds IS NULL OR pg.genre.id IN :genresIds)
                GROUP BY p.id, p.name, p.price, i.imageName, pr.promotionValue, p.product_code, s.id, s.name
                ORDER BY
                    CASE :sortBy
                        WHEN 'price-asc' THEN COALESCE((p.price - (p.price * pr.promotionValue / 100)), p.price)
                        ELSE 0
                    END ASC,
                    CASE :sortBy
                        WHEN 'price-desc' THEN COALESCE((p.price - (p.price * pr.promotionValue / 100)), p.price)
                        ELSE 0
                    END DESC,
                    CASE :sortBy
                        WHEN 'rating' THEN COALESCE(AVG(r.rate), 0.0)
                        ELSE 0
                    END DESC,
                    CASE :sortBy
                        WHEN 'bestseller' THEN COALESCE(SUM(oi.quantity), 0)
                        ELSE 0
                    END DESC,
                    CASE WHEN :sortBy = 'relevance' OR :sortBy IS NULL THEN p.id END DESC
            """)
    Page<SearchProductDTO> searchProducts(
            @Param("productName") String productName,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            @Param("genresIds") List<Integer> genresIds,
            @Param("sortBy") String sortBy,
            Pageable pageable);

    // @Query("""
    // SELECT COUNT(DISTINCT p.id)
    // FROM Product p
    // LEFT JOIN p.productGenres pg
    // WHERE p.active = true
    // AND p.approve = true
    // AND (:productName IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%',
    // :productName, '%')))
    // AND (:minPrice IS NULL OR (p.price - COALESCE((p.price * (SELECT
    // pr.promotionValue FROM p.promotionProducts pp JOIN pp.promotion pr WHERE
    // pr.id = pp.promotion.id), 0) / 100)) >= :minPrice)
    // AND (:maxPrice IS NULL OR (p.price - COALESCE((p.price * (SELECT
    // pr.promotionValue FROM p.promotionProducts pp JOIN pp.promotion pr WHERE
    // pr.id = pp.promotion.id), 0) / 100)) <= :maxPrice)
    // AND (:genresIds IS NULL OR pg.genre.id IN :genresIds)
    // """)
    // long countProductSearch(
    // @Param("productName") String productName,
    // @Param("minPrice") Double minPrice,
    // @Param("maxPrice") Double maxPrice,
    // @Param("genresIds") List<Integer> genresIds);

    @Query("SELECT COUNT(s) FROM Product s WHERE s.active = true")
    int countProductByActiveTrue();

    @Query("SELECT COUNT(s) FROM Product s WHERE s.status IS NOT NULL AND s.status = true")
    int countProductByStatusTrue();

    @Query("SELECT COUNT(s) FROM Product s WHERE s.approve IS NULL")
    int countProductByApproveNull();

    @Query("SELECT new com.thebugs.back_end.dto.ProductDetailDTO(" +
            "p.id, " +
            "p.name, " +
            "p.product_code, " +
            "p.price, " +
            "(p.price - COALESCE((p.price * pr.promotionValue / 100), 0.0)), " +
            "COALESCE(pr.promotionValue, 0.0), " +
            "p.weight, " +
            "p.createdAt, " +
            "p.description, " +
            "COALESCE(ROUND(AVG(r.rate), 1), 0.0), " +
            "CAST(COALESCE(COUNT(r.id), 0) AS INTEGER), " +
            "CAST(COALESCE(SUM(oi.quantity), 0) AS INTEGER), " +
            "p.quantity, " +
            "COALESCE(p.publisher.name, '')) " +
            "FROM Product p " +
            "LEFT JOIN PromotionProduct pp ON p.id = pp.product.id " +
            "LEFT JOIN Promotion pr ON pp.promotion.id = pr.id AND pr.active = true " +
            "LEFT JOIN p.orderItems oi " +
            "LEFT JOIN oi.reviews r " +
            "WHERE p.id = :productId AND p.active = true AND p.approve = true " +
            "GROUP BY p.id, p.name, p.product_code, p.price, pr.promotionValue, p.weight, p.createdAt, p.description, p.quantity, p.publisher.name")
    ProductDetailDTO findProductDetailById(@Param("productId") Integer productId);

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

    @Query("SELECT g FROM Genre g WHERE ?1 IS NULL OR g.name LIKE %?1%")
    Page<Genre> findProductByName(String keyword, Pageable pageable);

    @Query("SELECT COUNT(g) FROM Genre g WHERE ?1 IS NULL OR ?1 = '' OR g.name LIKE %?1%")
    int countfindProductByName(String keyword);

    @Query("SELECT new com.thebugs.back_end.dto.RelatedProductDTO(" +
            "p.id, " +
            "p.product_code, " +
            "p.name, " +
            "p.price, " +
            "(p.price * (1 - COALESCE(pr.promotionValue, 0) / 100)), " +
            "COALESCE(pr.promotionValue, 0), " +
            "COALESCE(AVG(r.rate), 0)) " +
            "FROM Product p " +
            "LEFT JOIN p.productGenres pg " +
            "LEFT JOIN p.promotionProducts pp " +
            "LEFT JOIN pp.promotion pr " +
            "LEFT JOIN p.orderItems oi " +
            "LEFT JOIN oi.reviews r " +
            "WHERE (pr.active = true AND pr.startDate <= CURRENT_DATE AND pr.expireDate >= CURRENT_DATE OR pr.id IS NULL) "
            +
            "AND pg.genre.id IN (SELECT pg2.genre.id FROM ProductGenre pg2 WHERE pg2.product.product_code = :productCode) "
            +
            "AND p.product_code != :productCode " +
            "GROUP BY p.id, p.product_code, p.name, p.price, pr.promotionValue " +
            "ORDER BY (p.price * (1 - COALESCE(pr.promotionValue, 0) / 100)) DESC")
    List<RelatedProductDTO> findRelatedProducts(@Param("productCode") String productCode);

    @Query("SELECT p.product_code FROM Product p WHERE p.id = :productId")
    String findProductCodeById(@Param("productId") Integer productId);

    @Query("SELECT new com.thebugs.back_end.dto.ProductDetailDTO$ShopDTO(s.id, s.image, s.name, u.verify) " +
            "FROM Shop s " +
            "JOIN Product p ON s.id = p.shop.id " +
            "JOIN User u ON s.user.id = u.id " +
            "WHERE p.id = :productId")
    ProductDetailDTO.ShopDTO findShopByProductId(@Param("productId") Integer productId);

}
