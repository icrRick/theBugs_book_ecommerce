package com.thebugs.back_end.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.thebugs.back_end.dto.ShopDetailDTO;
import com.thebugs.back_end.entities.Shop;

public interface ShopJPA extends JpaRepository<Shop, Integer> {
        @Query("SELECT new com.thebugs.back_end.dto.ShopDetailDTO(" +
                        "s.id, s.image, s.name, u.verify) " +
                        "FROM Shop s " +
                        "LEFT JOIN User u ON s.user.id = u.id " +
                        "WHERE s.active = true AND s.id = ?1")
        Optional<ShopDetailDTO> getShopDetail(Integer shopId);
}
