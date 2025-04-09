package com.thebugs.back_end.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.thebugs.back_end.entities.ProductAuthor;

public interface ProductAuthorJPA extends JpaRepository<ProductAuthor, Integer> {
    // @Query("SELECT new com.thebugs.back_end.dto.AuthorDTO(a.id, a.name) " +
    // "FROM ProductAuthor pa JOIN pa.author a " +
    // "WHERE pa.product.id = :productId")

    // List<AuthorDTO> findByProductId(Integer productId);

    // @Query("SELECT pa FROM ProductAuthor pa " +
    // "JOIN pa.author a " +
    // "WHERE pa.product.id = :productId")
    // List<AuthorDTO> findByProductIdIn(Integer productId);
}
