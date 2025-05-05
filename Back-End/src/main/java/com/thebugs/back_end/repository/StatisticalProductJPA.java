package com.thebugs.back_end.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.thebugs.back_end.dto.Statistical_DTO.Child_Chart_DTO;
import com.thebugs.back_end.entities.Product;

public interface StatisticalProductJPA extends JpaRepository<Product, Integer> {
    @Query("SELECT COUNT(p.product_code) FROM Product p WHERE p.shop.id = :shopId")
    int countAllProductByShopId(@Param("shopId") int shopId);

    @Query("""
            SELECT new com.thebugs.back_end.dto.Statistical_DTO.Child_Chart_DTO(g.name, COUNT(p.id) as countGenre)
            FROM Product p
            JOIN p.productGenres pg
            JOIN pg.genre g
            WHERE p.shop.id = :shopId
            GROUP BY g.name
            """)
    List<Child_Chart_DTO> getChartDataGenresProductByShopId(@Param("shopId") int shopId, Sort sort);

    @Query("""
                SELECT new com.thebugs.back_end.dto.Statistical_DTO.Child_Chart_DTO(
                    CASE
                        WHEN p.quantity > 10 THEN 'Còn hàng'
                        WHEN p.quantity = 0 THEN 'Hết hàng'
                        ELSE 'Sắp hết hàng'
                    END,
                    COUNT(p.id)
                )
                FROM Product p
                WHERE p.shop.id = :shopId
                GROUP BY
                    CASE
                        WHEN p.quantity > 10 THEN 'Còn hàng'
                        WHEN p.quantity = 0 THEN 'Hết hàng'
                        ELSE 'Sắp hết hàng'
                    END
            """)
    List<Child_Chart_DTO> getChartDataProductStatusByShopId(@Param("shopId") int shopId);

    // new com.thebugs.back_end.dto.Statistical_DTO.Child_Table_DTO(
    @Query("""
                SELECT
                    p.name,
                    p.product_code,
                    GROUP_CONCAT(DISTINCT g.name),
                    COALESCE(SUM(oi.quantity)/2, 0) as soldProduct,
                    p.quantity,
                    COALESCE(SUM(oi.quantity * oi.price)/2, 0)
                FROM Product p
                LEFT JOIN p.orderItems oi
                LEFT JOIN p.productGenres pg
                LEFT JOIN pg.genre g
                WHERE p.shop.id = :shopId
                  AND oi.order.orderStatus.id = 6
                  AND (oi.order.createdAt BETWEEN :startDate AND :endDate)
                GROUP BY p.id, p.name
            """)
    List<Object[]> getProductSummaryByShopId(
            @Param("shopId") int shopId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            Sort sort);

}
