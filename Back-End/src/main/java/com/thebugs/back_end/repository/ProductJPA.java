package com.thebugs.back_end.repository;

import java.time.LocalDate;
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
                    s.shop_slug,
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
            "(p.price - COALESCE((p.price * COALESCE(pr.promotionValue, 0) / 100), 0.0)), " +
            "COALESCE(pr.promotionValue, 0.0), " +
            "p.weight, " +
            "p.createdAt, " +
            "p.description, " +
            "COALESCE(ROUND(AVG(r.rate), 1), 0.0), " +
            "CAST(COALESCE(COUNT(r.id), 0) AS INTEGER), " +
            "CAST(COALESCE(SUM(oi.quantity), 0) AS INTEGER), " +
            "p.quantity, " +
            "COALESCE(p.publisher.name, ''), " +
            "CASE WHEN COALESCE(pr.flashSale, false) = true AND COALESCE(pr.active, false) = true AND pr.startDate <= CURRENT_DATE AND pr.expireDate >= CURRENT_DATE THEN true ELSE false END, "
            +
            "CASE WHEN COALESCE(pr.flashSale, false) = true THEN COALESCE(pp.quantity, 0) ELSE 0 END, " +
            "CASE WHEN COALESCE(pr.flashSale, false) = true THEN COALESCE(pp.soldQuantity, 0) ELSE 0 END) " +
            "FROM Product p " +
            "LEFT JOIN p.promotionProducts pp " +
            "LEFT JOIN pp.promotion pr " +
            "LEFT JOIN p.orderItems oi " +
            "LEFT JOIN oi.reviews r " +
            "LEFT JOIN p.publisher pub " +
            "WHERE p.id = :productId AND p.active = true AND p.approve = true " +
            "GROUP BY p.id, p.name, p.product_code, p.price, COALESCE(pr.promotionValue, 0.0), COALESCE(pr.flashSale, false), COALESCE(pr.active, false), COALESCE(pr.startDate, CURRENT_DATE), COALESCE(pr.expireDate, CURRENT_DATE), COALESCE(pp.quantity, 0), COALESCE(pp.soldQuantity, 0), p.weight, p.createdAt, p.description, p.quantity, COALESCE(pub.name, '')")
    ProductDetailDTO findProductDetailById(@Param("productId") Integer productId);

    @Query("SELECT new com.thebugs.back_end.dto.ProductDetailDTO$ShopDTO(" +
            "s.id, " +
            "s.image, " +
            "s.name, " +
            "u.verify, " +
            "COALESCE(ROUND(AVG(r.rate), 1), 0.0), " +
            "CAST(COALESCE(COUNT(r.id), 0) AS INTEGER), " + // Đếm số lượng đánh giá từ reviews
            "CAST(COALESCE((SELECT COUNT(sp.id) FROM Product sp WHERE sp.shop.id = s.id AND sp.active = true AND sp.approve = true), 0) AS INTEGER), "
            +
            "s.shop_slug) " +
            "FROM Shop s " +
            "JOIN User u ON s.user.id = u.id " +
            "LEFT JOIN s.products p2 " + // Nối với tất cả sản phẩm của cửa hàng
            "LEFT JOIN p2.orderItems oi " +
            "LEFT JOIN oi.reviews r " +
            "WHERE s.id = (SELECT p.shop.id FROM Product p WHERE p.id = :productId) " +
            "GROUP BY s.id, s.image, s.name, u.verify, s.shop_slug")
    ProductDetailDTO.ShopDTO findShopDetailsByProductIdWithRatings(@Param("productId") Integer productId);

    @Query("SELECT i.imageName FROM Image i WHERE i.product.id = :productId")
    List<String> findImageNamesByProductId(@Param("productId") Integer productId);

    @Query("SELECT a.name FROM Author a JOIN a.productAuthors pa WHERE pa.product.id = :productId")
    List<String> findAuthorNamesByProductId(@Param("productId") Integer productId);

    @Query("SELECT g.name FROM Genre g JOIN g.productGenres pg WHERE pg.product.id = :productId")
    List<String> findGenreNamesByProductId(@Param("productId") Integer productId);

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
            "WHERE (pr IS NULL OR (pr.active = true AND pr.startDate <= CURRENT_DATE AND pr.expireDate >= CURRENT_DATE)) "
            +
            "AND pg.genre.id IN (" +
            "   SELECT pg2.genre.id FROM ProductGenre pg2 WHERE pg2.product.product_code = :productCode" +
            ") " +
            "AND p.product_code != :productCode " +
            "GROUP BY p.id, p.product_code, p.name, p.price, pr.promotionValue " +
            "ORDER BY (p.price * (1 - COALESCE(pr.promotionValue, 0) / 100)) DESC")
    List<RelatedProductDTO> findRelatedProducts(@Param("productCode") String productCode);

    @Query("SELECT p FROM Product p WHERE p.product_code = :product_code")
    Optional<Product> findProductCodeById(@Param("product_code") String product_code);

    @Query("SELECT new com.thebugs.back_end.dto.ProductDetailDTO$ShopDTO(s.id, s.image, s.name, u.verify) " +
            "FROM Shop s " +
            "JOIN Product p ON s.id = p.shop.id " +
            "JOIN User u ON s.user.id = u.id " +
            "WHERE p.id = :productId")
    ProductDetailDTO.ShopDTO findShopByProductId(@Param("productId") Integer productId);

    @Query("""
                SELECT p
                FROM Product p
                LEFT JOIN p.promotionProducts pp
                LEFT JOIN pp.promotion promo
                LEFT JOIN p.orderItems o
                WHERE p.shop.shop_slug = :shopSlug
                AND p.active = true AND p.approve = true AND (p.status IS NULL OR (p.status IS NOT NULL AND p.status = false))
                AND (:productName IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :productName, '%')))
                AND (:genresIntegers IS NULL OR EXISTS (
                    SELECT 1 FROM ProductGenre pg WHERE pg.product = p AND pg.genre.id IN :genresIntegers
                ))
                AND (:authorsIntegers IS NULL OR EXISTS (
                    SELECT 1 FROM ProductAuthor pa WHERE pa.product = p AND pa.author.id IN :authorsIntegers
                ))
                AND (:minPrice IS NULL OR p.price >= :minPrice)
                AND (:maxPrice IS NULL OR p.price <= :maxPrice)
                   AND (:filterDate IS NULL OR p.createdAt >= :filterDate)
                GROUP BY p.id
                ORDER BY
                    CASE WHEN :sortType = 'popular' THEN COALESCE(SUM(o.quantity), 0) ELSE 0 END DESC,
                    CASE WHEN :sortType = 'price_asc' THEN
                        CASE
                            WHEN COALESCE(promo.promotionValue, 0) > 0
                                 AND (promo.startDate IS NULL OR promo.startDate <= CURRENT_DATE)
                                 AND (promo.expireDate IS NULL OR promo.expireDate >= CURRENT_DATE)
                            THEN p.price * (1 - promo.promotionValue / 100.0)
                            ELSE p.price
                        END
                    ELSE 0 END ASC,
                    CASE WHEN :sortType = 'price_desc' THEN
                        CASE
                            WHEN COALESCE(promo.promotionValue, 0) > 0
                                 AND (promo.startDate IS NULL OR promo.startDate <= CURRENT_DATE)
                                 AND (promo.expireDate IS NULL OR promo.expireDate >= CURRENT_DATE)
                            THEN p.price * (1 - promo.promotionValue / 100.0)
                            ELSE p.price
                        END
                    ELSE 0 END DESC
            """)
    Page<Product> filterProductsWithSort(
            @Param("shopSlug") String shopSlug,
            @Param("productName") String productName,
            @Param("genresIntegers") List<Integer> genresIntegers,
            @Param("authorsIntegers") List<Integer> authorsIntegers,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            @Param("filterDate") LocalDate filterDate,
            @Param("sortType") String sortType,
            Pageable pageable);

    @Query("""
                SELECT COUNT(DISTINCT p) FROM Product p
                LEFT JOIN p.promotionProducts pp
                LEFT JOIN pp.promotion promo
                LEFT JOIN p.orderItems o
                WHERE p.shop.shop_slug = :shopSlug
                AND p.active = true AND p.approve = true AND (p.status IS NULL OR (p.status IS NOT NULL AND p.status = false))
                AND (:productName IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :productName, '%')))
                AND (:genreIds IS NULL OR EXISTS (
                    SELECT 1 FROM ProductGenre pg WHERE pg.product = p AND pg.genre.id IN :genreIds
                ))
                AND (:authorIds IS NULL OR EXISTS (
                    SELECT 1 FROM ProductAuthor pa WHERE pa.product = p AND pa.author.id IN :authorIds
                ))
                AND (:minPrice IS NULL OR p.price >= :minPrice)
                AND (:maxPrice IS NULL OR p.price <= :maxPrice)
               AND (:filterDate IS NULL OR p.createdAt >= :filterDate)
            """)
    int countFilteredProducts(
            @Param("shopSlug") String shopSlug,
            @Param("productName") String productName,
            @Param("genreIds") List<Integer> genreIds,
            @Param("authorIds") List<Integer> authorIds,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            @Param("sortType") String sortType,
            @Param("filterDate") LocalDate filterDate);

    @Query("SELECT p FROM Product p WHERE p.shop.id = :shopId   AND p.active = true AND p.approve = true AND (p.status IS NULL OR (p.status IS NOT NULL AND p.status = false))")
    List<Product> findAllByShopId(@Param("shopId") Integer shopId);

    @Query("SELECT p FROM Product p WHERE p.shop.shop_slug = :shopSlug   AND p.active = true AND p.approve = true AND (p.status IS NULL OR (p.status IS NOT NULL AND p.status = false)) ")
    List<Product> getAllByShop(@Param("shopSlug") String shopSlug);

}
