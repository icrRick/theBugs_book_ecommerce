package com.thebugs.back_end.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.thebugs.back_end.entities.ProductGenre;

public interface ProductGenreJPA extends JpaRepository<ProductGenre, Integer> {

        @Query("SELECT COUNT(pg) > 0 FROM ProductGenre pg WHERE pg.genre.id = ?1")
        boolean existsByGenreId(int genreId);

        @Query("SELECT pg FROM ProductGenre pg WHERE pg.product.id = ?1")
        List<ProductGenre> findByProductId(int productId);

}
