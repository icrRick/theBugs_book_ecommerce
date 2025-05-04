package com.thebugs.back_end.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.thebugs.back_end.entities.ReportShop;
import com.thebugs.back_end.entities.ReportShop;

public interface ReportShopJPA extends JpaRepository<ReportShop, Integer> {
    @Query("SELECT r FROM ReportShop r WHERE (:active IS NULL AND r.active IS NULL) OR (:active IS NOT NULL AND r.active = :active)")
    Page<ReportShop> findReportShopsByActive(@Param("active") Boolean active, Pageable pageable);

    @Query("SELECT COUNT(r) FROM ReportShop r WHERE (:active IS NULL AND r.active IS NULL) OR (:active IS NOT NULL AND r.active = :active)")
    int countByActive(@Param("active") Boolean active);

    @Query("SELECT r FROM ReportShop r WHERE r.shop.id =:shopId AND (:active IS NULL AND r.active IS NULL) OR (:active IS NOT NULL AND r.active = :active)")
    List<ReportShop> findReportShopsByshopAndActive(@Param("shopId") Integer shopId,
            @Param("active") Boolean active);

    @Query("""
                SELECT r FROM ReportShop r
                WHERE r.user.id = :userId
                  AND (
                       (:active IS NULL AND r.active IS NULL)
                    OR (:active IS NOT NULL AND r.active = :active)
                  )
            """)
    Page<ReportShop> findReportShopsByActiveByUser(
            @Param("active") Boolean active,
            @Param("userId") Integer userId,
            Pageable pageable);

    @Query("""
                SELECT COUNT(r) FROM ReportShop r
                WHERE r.user.id = :userId
                  AND (
                       (:active IS NULL AND r.active IS NULL)
                    OR (:active IS NOT NULL AND r.active = :active)
                  )
            """)
    int countByActiveByUser(
            @Param("active") Boolean active,
            @Param("userId") Integer userId);

    @Query("SELECT r FROM ReportShop r WHERE r.user.id = :userId ")
    Page<ReportShop> findAllByUserId(@Param("userId") Integer userId, Pageable pageable);

    @Query("""
                SELECT COUNT(r) FROM ReportShop r
                WHERE r.user.id = :userId

            """)
    int countByActiveByUserId(
            @Param("userId") Integer userId);

    @Query("""
                SELECT COUNT(r) FROM ReportShop r
                WHERE r.user.id = :userId AND r.shop.shop_slug=:shopSlug

            """)
    int checkReportShopByUser(@Param("shopSlug") String shopSlug, @Param("userId") Integer userId);

}
