package com.thebugs.back_end.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.thebugs.back_end.entities.Image;

public interface ImageJPA extends JpaRepository<Image, Integer> {
  // @Query("""
  //         SELECT i.imageName
  //         FROM Image i
  //         WHERE i.product.id = :productId
  //         ORDER BY i.id ASC
  //         LIMIT 1
  //     """)
  // String findImageForProduct(@Param("productId") int productId);

}
