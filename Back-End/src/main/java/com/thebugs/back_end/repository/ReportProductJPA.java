package com.thebugs.back_end.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.thebugs.back_end.entities.ReportProduct;

public interface ReportProductJPA extends JpaRepository<ReportProduct, Integer> {

  @Query("SELECT r FROM ReportProduct r WHERE (:active IS NULL AND r.active IS NULL) OR (:active IS NOT NULL AND r.active = :active)")
  Page<ReportProduct> findReportProductsByActive(@Param("active") Boolean active, Pageable pageable);

  @Query("SELECT COUNT(r) FROM ReportProduct r WHERE (:active IS NULL AND r.active IS NULL) OR (:active IS NOT NULL AND r.active = :active)")
  int countByActive(@Param("active") Boolean active);

  @Query("SELECT r FROM ReportProduct r WHERE r.product.id =:productId AND (:active IS NULL AND r.active IS NULL) OR (:active IS NOT NULL AND r.active = :active)")
  List<ReportProduct> findReportProductsByProductAndActive(@Param("productId") Integer productId,
      @Param("active") Boolean active);

      
  @Query("""
          SELECT r FROM ReportProduct r
          WHERE r.user.id = :userId
            AND (
                 (:active IS NULL AND r.active IS NULL)
              OR (:active IS NOT NULL AND r.active = :active)
            )
      """)
  Page<ReportProduct> findReportProductsByActiveByUser(
      @Param("active") Boolean active,
      @Param("userId") Integer userId,
      Pageable pageable);

  @Query("""
          SELECT COUNT(r) FROM ReportProduct r
          WHERE r.user.id = :userId
            AND (
                 (:active IS NULL AND r.active IS NULL)
              OR (:active IS NOT NULL AND r.active = :active)
            )
      """)
  int countByActiveByUser(
      @Param("active") Boolean active,
      @Param("userId") Integer userId);

  @Query("SELECT r FROM ReportProduct r WHERE r.user.id = :userId ")
  Page<ReportProduct> findAllByUserId(@Param("userId") Integer userId, Pageable pageable);

  @Query("""
          SELECT COUNT(r) FROM ReportProduct r
          WHERE r.user.id = :userId

      """)
  int countByActiveByUserId(
      @Param("userId") Integer userId);

  @Query("""
          SELECT COUNT(r) FROM ReportProduct r
          WHERE r.user.id = :userId AND r.product.product_code=:productCode

      """)
  int checkReportProductByUser(@Param("productCode") String productCode, @Param("userId") Integer userId);

}
