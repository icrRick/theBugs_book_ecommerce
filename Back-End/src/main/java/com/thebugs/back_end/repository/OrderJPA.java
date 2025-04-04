package com.thebugs.back_end.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.thebugs.back_end.dto.OrderSimpleDTO;
import com.thebugs.back_end.dto.UserOrderDTO;
import com.thebugs.back_end.entities.Order;

public interface OrderJPA extends JpaRepository<Order, Integer> {

        @Query("SELECT new com.thebugs.back_end.dto.UserOrderDTO(" +
                        "o.id, s.id,os.id,oi.quantity,s.name, p.name, COALESCE(i.imageName, ''), os.name,oi.price, SUM(oi.quantity * oi.price)+ o.shippingFee) "
                        +
                        "FROM Order o " +
                        "LEFT JOIN OrderItem oi ON o.id = oi.order.id " +
                        "LEFT JOIN Product p ON oi.product.id = p.id " +
                        "LEFT JOIN Shop s ON o.shop.id = s.id " +
                        "LEFT JOIN OrderStatus os ON o.orderStatus.id = os.id " +
                        "LEFT JOIN Image i ON i.product.id = p.id " +
                        "WHERE i.id = (SELECT MIN(i2.id) FROM Image i2 WHERE i2.product.id = p.id) " +
                        "AND o.user.id = ?1 " +
                        "GROUP BY o.id, s.id, s.name, p.name, i.imageName, os.name")
        Page<UserOrderDTO> findOrderByUserId(Integer userId, Pageable pageable);

        @Query("SELECT new com.thebugs.back_end.dto.OrderSimpleDTO(" +
                        "o.id, o.customerInfo, o.createdAt, o.orderStatus.name, o.paymentMethod, o.paymentStatus, " +
                        "SUM(oi.quantity * oi.price) + o.shippingFee - " +
                        "CASE " +
                        "   WHEN o.voucher.discountPercentage IS NOT NULL THEN " +
                        "       LEAST(SUM(oi.quantity * oi.price) * o.voucher.discountPercentage / 100, o.voucher.maxDiscount) "
                        +
                        "   ELSE 0 " +
                        "END) " +
                        "FROM Order o " +
                        "LEFT JOIN OrderItem oi ON o.id = oi.order.id " +
                        "WHERE o.shop.id = ?1 " +
                        "GROUP BY o.id")
        Page<OrderSimpleDTO> findOrderByShopId(Integer shopId, Pageable pageable);

        @Query("SELECT o FROM Order o WHERE o.id = ?1 AND o.shop.id = ?2 ")
        Optional<Order> getOrderByShopId(Integer orderId, Integer shopId);

}
