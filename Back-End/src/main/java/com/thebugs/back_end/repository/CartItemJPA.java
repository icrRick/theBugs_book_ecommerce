package com.thebugs.back_end.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.thebugs.back_end.entities.CartItem;

public interface CartItemJPA extends JpaRepository<CartItem, Integer> {

    @Query("SELECT c FROM CartItem c WHERE c.product.id=?1 AND c.user.id=?2")
    Optional<CartItem> findProductByUserId(Integer productId, Integer userId);
}
