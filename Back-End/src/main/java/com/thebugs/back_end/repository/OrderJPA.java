package com.thebugs.back_end.repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.thebugs.back_end.dto.AdminRevenueShopDTO;

import com.thebugs.back_end.dto.OrderSimpleDTO;
import com.thebugs.back_end.entities.Order;

public interface OrderJPA extends JpaRepository<Order, Integer> {
        // code cua tam

        @Query("SELECT new com.thebugs.back_end.dto.OrderSimpleDTO(" +
                        "o.shop.shop_slug, o.shop.name, o.orderPayment.id , o.id, o.customerInfo, o.createdAt, o.orderStatus.name, op.paymentMethod, op.paymentStatus, "
                        +
                        "COALESCE(SUM(oi.quantity * oi.price), 0) + o.shippingFee - " +
                        "COALESCE(" +
                        "CASE WHEN v.id IS NOT NULL THEN " +
                        "LEAST(COALESCE(SUM(oi.quantity * oi.price), 0) * v.discountPercentage / 100, v.maxDiscount) " +
                        "ELSE 0 END, 0), o.noted) " +
                        "FROM Order o " +
                        "LEFT JOIN o.orderPayment op " +
                        "LEFT JOIN o.orderItems oi " +
                        "LEFT JOIN o.voucher v " +
                        "WHERE o.shop.id = ?1 " +
                        "GROUP BY o.shop.shop_slug, o.shop.name, o.orderPayment.id, o.id,  o.customerInfo, o.createdAt, o.orderStatus.name, op.paymentMethod, op.paymentStatus, "
                        +
                        "o.shippingFee, v.id, v.discountPercentage, v.maxDiscount, o.noted")
        Page<OrderSimpleDTO> findOrderByShopId(Integer shopId, Pageable pageable);

        // Order của User
        @Query("SELECT new com.thebugs.back_end.dto.OrderSimpleDTO(" +
                        "o.shop.shop_slug, o.shop.name, o.orderPayment.id, o.id, o.customerInfo, o.createdAt, o.orderStatus.name, op.paymentMethod, op.paymentStatus, "
                        +
                        "COALESCE(SUM(oi.quantity * oi.price), 0) + o.shippingFee - " +
                        "CASE WHEN o.voucher.discountPercentage IS NOT NULL THEN " +
                        "LEAST(COALESCE(SUM(oi.quantity * oi.price), 0) * o.voucher.discountPercentage / 100, o.voucher.maxDiscount) "
                        +
                        "ELSE 0 END, o.noted) " +
                        "FROM Order o " +
                        "LEFT JOIN o.orderPayment op " +
                        "LEFT JOIN o.orderItems oi " +
                        "LEFT JOIN o.voucher v " +
                        "WHERE o.user.id = ?1 " +
                        "GROUP BY o.shop.shop_slug, o.shop.name,o.orderPayment.id, o.id, o.customerInfo, o.createdAt, o.orderStatus.name, op.paymentMethod, op.paymentStatus, "
                        +
                        "o.shippingFee, v.discountPercentage, v.maxDiscount, o.noted")
        Page<OrderSimpleDTO> findOrderByUserId(Integer userId, Pageable pageable);

        @Query("SELECT COUNT(o) FROM Order o WHERE o.user.id = ?1")
        int countOrderByUserId(Integer userId);

        @Query("SELECT new com.thebugs.back_end.dto.OrderSimpleDTO(" +
                        "o.shop.shop_slug, o.shop.name,o.orderPayment.id, o.id, o.customerInfo, o.createdAt, o.orderStatus.name, op.paymentMethod, op.paymentStatus, "
                        +
                        "COALESCE(SUM(oi.quantity * oi.price), 0) + o.shippingFee - " +
                        "CASE WHEN o.voucher.discountPercentage IS NOT NULL THEN " +
                        " LEAST(COALESCE(SUM(oi.quantity * oi.price), 0) * o.voucher.discountPercentage / 100, o.voucher.maxDiscount) "
                        +
                        "ELSE 0 END, o.noted) " +
                        "FROM Order o " +
                        "LEFT JOIN o.orderPayment op " +
                        "LEFT JOIN o.orderItems oi " +
                        "LEFT JOIN o.voucher v " +
                        "WHERE o.user.id = ?1 " +
                        "AND (:startDate IS NULL OR o.createdAt >= :startDate) " +
                        "AND (:endDate IS NULL OR o.createdAt <= :endDate) " +
                        "AND (:orderStatusId IS NULL OR o.orderStatus.id = :orderStatusId) " +
                        "AND (:keyword IS NULL OR LOWER(o.customerInfo) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
                        "GROUP BY o.id, o.customerInfo, o.createdAt, o.orderStatus.name, op.paymentMethod, op.paymentStatus, "
                        +
                        "o.shippingFee, o.voucher.discountPercentage, o.voucher.maxDiscount, o.noted")
        Page<OrderSimpleDTO> findOrderUserByDateAndKeyWordAndStatus(
                        @Param("userId") Integer userId,
                        @Param("startDate") Date startDate,
                        @Param("endDate") Date endDate,
                        @Param("orderStatusId") Integer orderStatusId,
                        @Param("keyword") String keyword,
                        Pageable pageable);

        @Query("SELECT COUNT(o) FROM Order o " +
                        "WHERE o.user.id = :userId " +
                        "AND (:startDate IS NULL OR :endDate IS NULL OR o.createdAt BETWEEN :startDate AND :endDate) " +
                        "AND (:orderStatusId IS NULL OR o.orderStatus.id = :orderStatusId) " +
                        "AND (:keyword IS NULL OR o.customerInfo LIKE CONCAT('%', :keyword, '%'))")
        int countBySearchOrderUser(@Param("userId") Integer userId,
                        @Param("startDate") Date startDate,
                        @Param("endDate") Date endDate,
                        @Param("orderStatusId") Integer orderStatusId,
                        @Param("keyword") String keyword);

        @Query("SELECT o FROM Order o WHERE o.id = ?1 AND o.user.id = ?2 ")
        Optional<Order> getOrderByUserId(Integer orderId, Integer userId);

        @Query("SELECT o FROM Order o WHERE o.id = ?1 AND o.shop.id = ?2 ")
        Optional<Order> getOrderByShopId(Integer orderId, Integer shopId);

        // Tìm kiếm seller
        @Query("SELECT new com.thebugs.back_end.dto.OrderSimpleDTO("
                        + "o.shop.shop_slug, o.shop.name,o.orderPayment.id ,o.id, o.customerInfo, o.createdAt, o.orderStatus.name, op.paymentMethod, op.paymentStatus, "
                        + "COALESCE(SUM(oi.quantity * oi.price), 0) + o.shippingFee - "
                        + "CASE WHEN o.voucher.discountPercentage IS NOT NULL THEN "
                        + " LEAST(COALESCE(SUM(oi.quantity * oi.price), 0) * o.voucher.discountPercentage / 100, o.voucher.maxDiscount) "
                        + "ELSE 0 END, o.noted) " // Added o.noted
                        + "FROM Order o "
                        + "LEFT JOIN o.orderPayment op "
                        + "LEFT JOIN o.orderItems oi "
                        + "LEFT JOIN o.voucher v "
                        + "WHERE o.shop.id = ?1 "
                        + "AND ((?2 IS NULL OR ?3 IS NULL) OR o.createdAt BETWEEN ?2 AND ?3) "
                        + "AND (?4 IS NULL OR o.orderStatus.id = ?4) "
                        + "AND (?5 IS NULL OR o.customerInfo LIKE CONCAT('%', ?5, '%')) "
                        + "GROUP BY o.shop.shop_slug, o.shop.name,o.orderPayment.id, o.id, o.customerInfo, o.createdAt, o.orderStatus.name, op.paymentMethod, op.paymentStatus, "
                        + "o.shippingFee, o.voucher.discountPercentage, o.voucher.maxDiscount, o.noted")
        Page<OrderSimpleDTO> findOrderbyDateOrStatusOrName(Integer shopId, Date startDate, Date endDate,
                        Integer orderStatusId, String keyword, Pageable pageable);

        @Query("SELECT COUNT(o) FROM Order o WHERE o.shop.id = ?1")
        int countByShopId(int shopId);

        @Query("SELECT COUNT(o) FROM Order o " +
                        "WHERE o.shop.id = ?1 " +
                        "AND ((?2 IS NULL OR ?3 IS NULL) OR o.createdAt BETWEEN ?2 AND ?3) " +
                        "AND (?4 IS NULL OR o.orderStatus.id = ?4) " +
                        "AND (?5 IS NULL OR o.customerInfo LIKE CONCAT('%', ?5, '%'))")

        int countBySearch(int shopId, Date startDate, Date endDate, Integer orderStatusName, String keyword);

        @Query("SELECT o FROM Order o WHERE o.orderStatus.id = ?1 AND o.deliveredAt IS NOT NULL")
        List<Order> findDeliveredOrdersByStatus(@Param("statusId") int statusId);

        @Query("SELECT o FROM Order o " +
                        "LEFT JOIN o.orderItems oi " +
                        "WHERE o.orderStatus.id >= 4 " +
                        "AND o.orderPayment.id IN (2, 3) " +
                        "AND (:startDate IS NULL OR o.createdAt >= :startDate) " +
                        "AND (:endDate IS NULL OR o.createdAt <= :endDate)")
        Page<Order> getShopRevenuePage(@Param("startDate") Date startDate,
                        @Param("endDate") Date endDate,
                        Pageable pageable);

        @Query("SELECT o FROM Order o " +
                        "LEFT JOIN o.orderItems oi " +
                        "WHERE o.orderStatus.id >= 4 " +
                        "AND o.orderPayment.id IN (2, 3) " +
                        "AND (:startDate IS NULL OR o.createdAt >= :startDate) " +
                        "AND (:endDate IS NULL OR o.createdAt <= :endDate)")
        List<Order> getShopRevenue(@Param("startDate") Date startDate,
                        @Param("endDate") Date endDate);

        @Query("SELECT COUNT(DISTINCT o.shop.id) " +
                        "FROM Order o " +
                        "LEFT JOIN o.orderItems oi " +
                        "WHERE o.orderStatus.id  >= 4  " +
                        "AND o.orderPayment.id IN (2, 3) " +
                        "AND (:startDate IS NULL OR o.createdAt >= :startDate) " +
                        "AND (:endDate IS NULL OR o.createdAt <= :endDate)")
        int countRevenueShops(@Param("startDate") Date startDate,
                        @Param("endDate") Date endDate);





















                        @Query("SELECT o FROM Order o " +
                        "LEFT JOIN o.orderItems oi " +
                        "WHERE o.orderStatus.id >= 4 " +
                        "AND o.shop.id =:shopId "+
                        "AND o.orderPayment.id IN (2, 3) " +
                        "AND (:startDate IS NULL OR o.createdAt >= :startDate) " +
                        "AND (:endDate IS NULL OR o.createdAt <= :endDate)")
        Page<Order> getShopRevenuePageShopId(@Param("startDate") Date startDate,
                        @Param("endDate") Date endDate,
                        @Param("shopId") Integer shopId,
                        Pageable pageable);

        @Query("SELECT o FROM Order o " +
                        "LEFT JOIN o.orderItems oi " +
                        "WHERE o.orderStatus.id >= 4 " +
                        "AND o.shop.id =:shopId "+
                        "AND o.orderPayment.id IN (2, 3) " +
                        "AND (:startDate IS NULL OR o.createdAt >= :startDate) " +
                        "AND (:endDate IS NULL OR o.createdAt <= :endDate)")
        List<Order> getShopRevenueShopId(@Param("startDate") Date startDate,
                        @Param("endDate") Date endDate , @Param("shopId") Integer shopId);

        @Query("SELECT COUNT(DISTINCT o.shop.id) " +
                        "FROM Order o " +
                        "LEFT JOIN o.orderItems oi " +
                        "WHERE o.orderStatus.id  >= 4  " +
                        "AND o.shop.id =:shopId "+
                        "AND o.orderPayment.id IN (2, 3) " +
                        "AND (:startDate IS NULL OR o.createdAt >= :startDate) " +
                        "AND (:endDate IS NULL OR o.createdAt <= :endDate)")
        int countRevenueShopId(@Param("startDate") Date startDate,
                        @Param("endDate") Date endDate, @Param("shopId") Integer shopId);                

}
