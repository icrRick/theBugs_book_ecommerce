package com.thebugs.back_end.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.thebugs.back_end.entities.ProductGenre;

public interface ProductGenreJPA extends JpaRepository<ProductGenre, Integer> {

        @Query("SELECT COUNT(pg) > 0 FROM ProductGenre pg WHERE pg.genre.id = ?1")
        boolean existsByGenreId(int genreId);
        
       
}
