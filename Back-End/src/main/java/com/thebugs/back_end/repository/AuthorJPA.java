package com.thebugs.back_end.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.thebugs.back_end.dto.HomeAuthorDTO;
import com.thebugs.back_end.entities.Author;

public interface AuthorJPA extends JpaRepository<Author, Integer> {
        @Query("SELECT a FROM  Author a WHERE : keyword IS NULL OR a.name LIKE %:keyword%")
        Page<Author> findByNameAuthor(@Param("keyword") String keyword, Pageable pageable);

        @Query("SELECT COUNT(g) FROM Author g WHERE :keyword IS NULL OR :keyword = '' OR g.name LIKE %:keyword%")
        int countFindByName(@Param("keyword") String keyword);

        @Query("SELECT g FROM Author g WHERE g.name = ?2 AND (g.id <> ?1 OR ?1 IS NULL)")
        Optional<Author> findByNameExist(Integer id, String name);

        @Query("SELECT new com.thebugs.back_end.dto.HomeAuthorDTO(" +
                        "a.id, a.name, a.urlImage, a.urlLink, CAST(COUNT(pa.product.id) AS integer)) " +
                        "FROM Author a " +
                        "LEFT JOIN ProductAuthor pa ON a.id = pa.author.id " +
                        "LEFT JOIN Product p ON pa.product.id = p.id " +
                        "WHERE (p.active = true AND p.approve = true) OR p.id IS NULL " +
                        "GROUP BY a.id, a.name, a.urlImage, a.urlLink " +
                        "ORDER BY COUNT(pa.product.id) DESC")
        List<HomeAuthorDTO> findFeaturedAuthors(Pageable pageable);

        @Query("SELECT DISTINCT a FROM Product p " +
                        "JOIN p.productAuthors pa " +
                        "JOIN pa.author a " +
                        "WHERE p.shop.shop_slug = :shopSlug")
        List<Author> findDistinctAuthorsByShopSlug(@Param("shopSlug") String shopSlug);

}
