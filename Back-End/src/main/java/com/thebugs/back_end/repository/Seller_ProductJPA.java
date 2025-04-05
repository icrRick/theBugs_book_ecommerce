package com.thebugs.back_end.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.thebugs.back_end.entities.Product;

public interface Seller_ProductJPA extends JpaRepository<Product, Integer> {
    @Query("SELECT g FROM Product g WHERE g.shop.id = ?1")
    Page<Product> findAllByShopId(int shopId, Pageable pageable);

    @Query("SELECT g FROM Product g WHERE g.shop.id = ?1 and g.id = ?2")
    Product findProductByIdAndShopId(int shopId, int productId);
}
