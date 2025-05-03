package com.thebugs.back_end.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.thebugs.back_end.entities.ReportShop;

public interface ReportShopJPA extends JpaRepository<ReportShop, Integer> {
    @Query("SELECT r FROM ReportShop r WHERE (:active IS NULL AND r.active IS NULL) OR (:active IS NOT NULL AND r.active = :active)")
    Page<ReportShop> findReportShopsByActive(@Param("active") Boolean active, Pageable pageable);

    @Query("SELECT COUNT(r) FROM ReportShop r WHERE (:active IS NULL AND r.active IS NULL) OR (:active IS NOT NULL AND r.active = :active)")
    int countByActive(@Param("active") Boolean active);

    @Query("SELECT r FROM ReportShop r WHERE r.shop.id =:shopId AND (:active IS NULL AND r.active IS NULL) OR (:active IS NOT NULL AND r.active = :active)")
    List<ReportShop> findReportShopsByshopAndActive(@Param("shopId") Integer shopId,
            @Param("active") Boolean active);


            

}
