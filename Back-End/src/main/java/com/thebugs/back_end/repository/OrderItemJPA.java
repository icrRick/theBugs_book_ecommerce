package com.thebugs.back_end.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.thebugs.back_end.entities.OrderItem;

public interface OrderItemJPA extends JpaRepository<OrderItem, Integer> {
        @Query("SELECT o FROM OrderItem o WHERE o.order.id = :orderId")
        List<OrderItem> findByOrderId(@Param("orderId") Integer orderId);

        @Query("""
                            SELECT COALESCE(SUM(oi.quantity), 0)
                            FROM OrderItem oi
                            WHERE oi.product.id = :productId
                        """)
        int countPurchasedByProductId(@Param("productId") Integer productId);

        @Query("""
                            SELECT COUNT(oi)
                            FROM OrderItem oi
                            WHERE oi.product.id = :productId
                        """)
        int countOrderItemsByProductId(@Param("productId") Integer productId);

}
