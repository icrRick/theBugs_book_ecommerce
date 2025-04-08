package com.thebugs.back_end.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.thebugs.back_end.entities.Product;

public interface Seller_ProductJPA extends JpaRepository<Product, Integer> {
    @Query("SELECT DISTINCT g FROM Product g " +
            "LEFT JOIN g.productAuthors pa " +
            "LEFT JOIN g.productGenres pg " +
            "LEFT JOIN g.publisher pp " +
            "WHERE g.shop.id = ?1 " +
            "AND (?2 = '' OR g.name LIKE %?2% " +
            "OR pa.author.name LIKE %?2% " +
            "OR pg.genre.name LIKE %?2% " +
            "OR pp.name LIKE %?2%) ")
    Page<Product> findAllByShopIdAndKeyword(int shopId, String keyword, Pageable pageable);

    @Query("SELECT g FROM Product g WHERE g.shop.id = ?1 and g.id = ?2")
    Product findProductByIdAndShopId(int shopId, int productId);

    @Query("SELECT g FROM Product g WHERE g.shop.id = ?1 and g.product_code = ?2")
    Product findProductByProductCodeAndShopId(int shopId, String product_code);

    @Query("SELECT MAX(g.product_code) FROM Product g WHERE g.shop.id = ?1")
    String findMaxProductCodeByShopId(int shopId);

}
