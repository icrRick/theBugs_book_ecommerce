package com.thebugs.back_end.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.thebugs.back_end.entities.ProductAuthor;

public interface ProductAuthorJPA extends JpaRepository<ProductAuthor, Integer> {

    // Tìm kiếm danh sách tác giả theo id sản phẩm
    @Query("SELECT pa FROM ProductAuthor pa WHERE pa.product.id = ?1")
    List<ProductAuthor> findByProductId(Integer productId);

    // danh sách tác giả theo id tác giả
    @Query("SELECT pa FROM ProductAuthor pa WHERE pa.author.id= ?1")
    List<ProductAuthor> findByAuthorId(Integer authorId);

}
