package com.thebugs.back_end.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.thebugs.back_end.dto.Statistical_DTO.Child_Product_DTO;
import com.thebugs.back_end.entities.Order;

public interface StatisticalRevenueJPA extends JpaRepository<Order, Integer> {
        @Query("""
                            SELECT COUNT(oi.id)
                            FROM Order o
                            JOIN o.orderItems oi
                            WHERE o.shop.id = :shopId
                              AND o.orderStatus.id = 6
                              AND o.createdAt BETWEEN :startDate AND :endDate
                        """)
        int countSoldProductByShopId(
                        @Param("shopId") int shopId,
                        @Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate);

        @Query("""
                            SELECT new com.thebugs.back_end.dto.Statistical_DTO.Child_Product_DTO(
                                p.name,
                                MIN(i.imageName),
                                COALESCE(SUM(oi.quantity), 0) as countSold
                            )
                            FROM Order o
                            JOIN o.orderItems oi
                            JOIN oi.product p
                            JOIN p.images i
                            WHERE o.shop.id = :shopId
                              AND o.orderStatus.id = 6
                              AND o.createdAt BETWEEN :startDate AND :endDate
                            GROUP BY p.id, p.name
                        """)
        List<Child_Product_DTO> findSellingProductWithImage(
                        @Param("shopId") int shopId,
                        @Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate,
                        Sort sort);

}
