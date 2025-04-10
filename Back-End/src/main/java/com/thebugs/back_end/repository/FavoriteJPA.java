package com.thebugs.back_end.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


import com.thebugs.back_end.entities.Favorite;

public interface FavoriteJPA extends JpaRepository<Favorite, Integer> {

        @Query("SELECT f FROM Favorite f WHERE f.user.id = ?1")
        List<Favorite> findByUserId(Integer userId);

        @Query("SELECT f FROM Favorite f WHERE f.user.id = ?1 AND f.product.id = ?2")
        Optional<Favorite> findByUserIdAndProductId(Integer userId, Integer productId);

}
