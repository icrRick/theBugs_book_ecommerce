package com.thebugs.back_end.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.thebugs.back_end.dto.GenreDTO;
import com.thebugs.back_end.dto.HomeGenreDTO;
import com.thebugs.back_end.entities.Genre;

public interface GenreJPA extends JpaRepository<Genre, Integer> {
        @Query("SELECT g FROM Genre g WHERE ?1 IS NULL OR g.name LIKE %?1%")
        Page<Genre> findByName(String keyword, Pageable pageable);

        @Query("SELECT COUNT(g) FROM Genre g WHERE ?1 IS NULL OR ?1 = '' OR g.name LIKE %?1%")
        int countfindByName(String keyword);

        @Query("SELECT g FROM Genre g WHERE g.name = ?2 AND (g.id <> ?1 OR ?1 IS NULL)")
        Optional<Genre> findByNameExist(Integer id, String name);

        @Query("SELECT new com.thebugs.back_end.dto.GenreDTO(g.id, g.name) " +
                        "FROM Genre g JOIN ProductGenre pg ON g.id = pg.genre.id " +
                        "WHERE pg.product.id = ?1")
        List<GenreDTO> findGenresByProductId(Integer productId);

        @Query("SELECT new com.thebugs.back_end.dto.HomeGenreDTO(" +
                        "g.id, g.name, g.urlImage, " +
                        "CAST(COUNT(pg.product.id) AS integer)) " +
                        "FROM Genre g " +
                        "LEFT JOIN ProductGenre pg ON g.id = pg.genre.id " +
                        "GROUP BY g.id, g.name, g.urlImage " +
                        "ORDER BY COUNT(pg.product.id) DESC")
        List<HomeGenreDTO> findTopGenres(Pageable pageable);

        @Query("SELECT DISTINCT g FROM Product p " +
                        "JOIN p.productGenres pg " +
                        "JOIN pg.genre g " +
                        "WHERE p.shop.shop_slug = :shopSlug")
        List<Genre> findDistinctGenresByShopSlug(@Param("shopSlug") String shopSlug);

}
