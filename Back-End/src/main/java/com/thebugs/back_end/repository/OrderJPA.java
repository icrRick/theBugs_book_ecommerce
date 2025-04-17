package com.thebugs.back_end.repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.thebugs.back_end.dto.OrderSimpleDTO;
import com.thebugs.back_end.entities.Order;

public interface OrderJPA extends JpaRepository<Order, Integer> {

        // @Query("SELECT new com.thebugs.back_end.dto.UserOrderDTO(" +
        // "o.id, s.id,os.id,oi.quantity,s.name, p.name, COALESCE(i.imageName, ''),
        // os.name,oi.price, SUM(oi.quantity * oi.price)+ o.shippingFee) "
        // +
        // "FROM Order o " +
        // "LEFT JOIN OrderItem oi ON o.id = oi.order.id " +
        // "LEFT JOIN Product p ON oi.product.id = p.id " +
        // "LEFT JOIN Shop s ON o.shop.id = s.id " +
        // "LEFT JOIN OrderStatus os ON o.orderStatus.id = os.id " +
        // "LEFT JOIN Image i ON i.product.id = p.id " +
        // "WHERE i.id = (SELECT MIN(i2.id) FROM Image i2 WHERE i2.product.id = p.id) "
        // +
        // "AND o.user.id = ?1 " +
        // "GROUP BY o.id, s.id, s.name, p.name, i.imageName, os.name")
        // Page<UserOrderDTO> findOrderByUserId(Integer userId, Pageable pageable);

        @Query("SELECT new com.thebugs.back_end.dto.OrderSimpleDTO(" +
                        "o.id, o.customerInfo, o.createdAt, o.orderStatus.name, o.paymentMethod, o.paymentStatus, " +
                        "SUM(oi.quantity * oi.price) + o.shippingFee - " +
                        "CASE " +
                        "   WHEN o.voucher.discountPercentage IS NOT NULL THEN " +
                        "       LEAST(SUM(oi.quantity * oi.price) * o.voucher.discountPercentage / 100, o.voucher.maxDiscount) "
                        +
                        "   ELSE 0 " +
                        "END, o.noted) " + // Sửa để khớp với 8 tham số
                        "FROM Order o " +
                        "LEFT JOIN OrderItem oi ON o.id = oi.order.id " +
                        "WHERE o.shop.id = ?1 " +
                        "GROUP BY o.id, o.customerInfo, o.createdAt, o.orderStatus.name, o.paymentMethod, o.paymentStatus, "
                        +
                        "o.shippingFee, o.voucher.discountPercentage, o.voucher.maxDiscount, o.noted")
        Page<OrderSimpleDTO> findOrderByShopId(Integer shopId, Pageable pageable);

        // Order của User
        // @Query("SELECT new com.thebugs.back_end.dto.OrderSimpleDTO(" +
        // "o.id, o.customerInfo, o.createdAt, o.orderStatus.name, o.paymentMethod,
        // o.paymentStatus, "
        // +
        // "SUM(oi.quantity * oi.price) + o.shippingFee - " +
        // "CASE " +
        // " WHEN o.voucher.discountPercentage IS NOT NULL THEN " +
        // " LEAST(SUM(oi.quantity * oi.price) * o.voucher.discountPercentage / 100,
        // o.voucher.maxDiscount) "
        // +
        // " ELSE 0 " +
        // "END, o.noted) " +
        // "FROM Order o " +
        // "LEFT JOIN OrderItem oi ON o.id = oi.order.id " +
        // "WHERE o.user.id = ?1 " +
        // "GROUP BY o.id")
        // Page<OrderSimpleDTO> findOrderByUserId(Integer userId, Pageable pageable);

        @Query("SELECT new com.thebugs.back_end.dto.OrderSimpleDTO(" +
                        "o.id, o.customerInfo, o.createdAt, o.orderStatus.name, o.paymentMethod, o.paymentStatus, " +
                        "SUM(oi.quantity * oi.price) + o.shippingFee - " +
                        "CASE " +
                        "   WHEN o.voucher.discountPercentage IS NOT NULL THEN " +
                        "       LEAST(SUM(oi.quantity * oi.price) * o.voucher.discountPercentage / 100, o.voucher.maxDiscount) "
                        +
                        "   ELSE 0 " +
                        "END, o.noted) " + // Sửa để khớp với 8 tham số
                        "FROM Order o " +
                        "LEFT JOIN OrderItem oi ON o.id = oi.order.id " +
                        "WHERE o.user.id = ?1 " +
                        "GROUP BY o.id, o.customerInfo, o.createdAt, o.orderStatus.name, o.paymentMethod, o.paymentStatus, "
                        +
                        "o.shippingFee, o.voucher.discountPercentage, o.voucher.maxDiscount, o.noted")
        Page<OrderSimpleDTO> findOrderByUserId(Integer userId, Pageable pageable);

        @Query("SELECT COUNT(o) FROM Order o WHERE o.user.id = ?1")
        int countOrderByUserId(Integer userId);

        @Query("SELECT new com.thebugs.back_end.dto.OrderSimpleDTO(" +
                        "o.id, o.customerInfo, o.createdAt, o.orderStatus.name, o.paymentMethod, o.paymentStatus,  "
                        +
                        "COALESCE(SUM(oi.quantity * oi.price), 0) + o.shippingFee - " +
                        "CASE WHEN o.voucher.discountPercentage IS NOT NULL THEN " +
                        "LEAST(COALESCE(SUM(oi.quantity * oi.price), 0) * o.voucher.discountPercentage / 100, o.voucher.maxDiscount) "
                        +
                        "ELSE 0 END, o.noted) " +
                        "FROM Order o " +
                        "LEFT JOIN OrderItem oi ON o.id = oi.order.id " +
                        "WHERE o.user.id = ?1 " +
                        "AND ((?2 IS NULL OR ?3 IS NULL) OR o.createdAt BETWEEN ?2 AND ?3) " +
                        "AND (?4 IS NULL OR o.orderStatus.id = ?4) " +
                        "AND (?5 IS NULL OR o.customerInfo LIKE CONCAT('%', ?5, '%')) " +
                        "GROUP BY o.id, o.customerInfo, o.createdAt, o.orderStatus.id, o.paymentMethod, o.paymentStatus, "
                        +
                        "o.shippingFee, o.voucher.discountPercentage, o.voucher.maxDiscount, o.noted")

        Page<OrderSimpleDTO> findOrderUserByDateAndKeyWordAndStatus(
                        Integer userId,
                        Date startDate,
                        Date endDate,
                        Integer orderStatusName,
                        String keyword,
                        Pageable pageable);

        @Query("SELECT COUNT(o) FROM Order o " +
                        "WHERE o.user.id = ?1 " +
                        "AND ((?2 IS NULL OR ?3 IS NULL) OR o.createdAt BETWEEN ?2 AND ?3) " +
                        "AND (?4 IS NULL OR o.orderStatus.id = ?4) " +
                        "AND (?5 IS NULL OR o.customerInfo LIKE CONCAT('%', ?5, '%'))")

        int countBySearchOrderUser(Integer userId, Date startDate, Date endDate, Integer orderStatusName,
                        String keyword);

        @Query("SELECT o FROM Order o WHERE o.id = ?1 AND o.user.id = ?2 ")
        Optional<Order> getOrderByUserId(Integer orderId, Integer userId);

        // code cua tam

        @Query("SELECT o FROM Order o WHERE o.id = ?1 AND o.shop.id = ?2 ")
        Optional<Order> getOrderByShopId(Integer orderId, Integer shopId);

        // @Query("SELECT new com.thebugs.back_end.dto.OrderSimpleDTO(" +
        // "o.id, o.customerInfo, o.createdAt, o.orderStatus.name, o.paymentMethod,
        // o.paymentStatus, " +
        // "COALESCE(SUM(oi.quantity * oi.price), 0) + o.shippingFee - " +
        // "CASE WHEN o.voucher.discountPercentage IS NOT NULL THEN " +
        // "LEAST(COALESCE(SUM(oi.quantity * oi.price), 0) *
        // o.voucher.discountPercentage / 100, o.voucher.maxDiscount) "
        // +
        // "ELSE 0 END) " +
        // "FROM Order o " +
        // "LEFT JOIN OrderItem oi ON o.id = oi.order.id " +
        // "WHERE o.shop.id = ?1 " +
        // "AND ((?2 IS NULL OR ?3 IS NULL) OR o.createdAt BETWEEN ?2 AND ?3) " +
        // "AND (?4 IS NULL OR o.orderStatus.id = ?4) " +
        // "AND (?5 IS NULL OR o.customerInfo LIKE CONCAT('%', ?5, '%')) " +
        // "GROUP BY o.id, o.customerInfo, o.createdAt, o.orderStatus.id,
        // o.paymentMethod, o.paymentStatus, "
        // +
        // "o.shippingFee, o.voucher.discountPercentage, o.voucher.maxDiscount")

        // Page<OrderSimpleDTO> findOrderbyDateOrStatusOrName(
        // Integer shopId,
        // Date startDate,
        // Date endDate,
        // Integer orderStatusName,
        // String keyword,
        // Pageable pageable);

        @Query("SELECT new com.thebugs.back_end.dto.OrderSimpleDTO(" +
                        "o.id, o.customerInfo, o.createdAt, o.orderStatus.name, o.paymentMethod, o.paymentStatus, " +
                        "COALESCE(SUM(oi.quantity * oi.price), 0) + o.shippingFee - " +
                        "CASE WHEN o.voucher.discountPercentage IS NOT NULL THEN " +
                        "LEAST(COALESCE(SUM(oi.quantity * oi.price), 0) * o.voucher.discountPercentage / 100, o.voucher.maxDiscount) "
                        +
                        "ELSE 0 END, o.noted) " + // Thêm o.noted
                        "FROM Order o " +
                        "LEFT JOIN OrderItem oi ON o.id = oi.order.id " +
                        "WHERE o.shop.id = ?1 " +
                        "AND ((?2 IS NULL OR ?3 IS NULL) OR o.createdAt BETWEEN ?2 AND ?3) " +
                        "AND (?4 IS NULL OR o.orderStatus.id = ?4) " +
                        "AND (?5 IS NULL OR o.customerInfo LIKE CONCAT('%', ?5, '%')) " +
                        "GROUP BY o.id, o.customerInfo, o.createdAt, o.orderStatus.id, o.paymentMethod, o.paymentStatus, "
                        +
                        "o.shippingFee, o.voucher.discountPercentage, o.voucher.maxDiscount, o.noted") // Thêm o.noted
                                                                                                       // vào GROUP BY
        Page<OrderSimpleDTO> findOrderbyDateOrStatusOrName(
                        Integer shopId,
                        Date startDate,
                        Date endDate,
                        Integer orderStatusName,
                        String keyword,
                        Pageable pageable);

        // @Query("SELECT new com.thebugs.back_end.dto.SellerOrderDTO(" +
        // "o.id, o.customerInfo, o.createdAt, o.orderStatus.name, o.paymentMethod,
        // o.paymentStatus, " +
        // "SUM(oi.quantity * oi.price) + o.shippingFee - " +
        // "CASE WHEN o.voucher.discountPercentage IS NOT NULL THEN " +
        // "LEAST(SUM(oi.quantity * oi.price) * o.voucher.discountPercentage / 100,
        // o.voucher.maxDiscount) "
        // +
        // "ELSE 0 END) " +
        // "FROM Order o " +
        // "LEFT JOIN OrderItem oi ON o.id = oi.order.id " +
        // "WHERE o.shop.id = ?1 " +
        // "GROUP BY o.id, o.customerInfo, o.createdAt, o.orderStatus.name,
        // o.paymentMethod, o.paymentStatus, o.shippingFee,
        // o.voucher.discountPercentage, o.voucher.maxDiscount");

        @Query("SELECT COUNT(o) FROM Order o WHERE o.shop.id = ?1")
        int countByShopId(int shopId);

        // @Query("SELECT COUNT(o) FROM Order o WHERE o.shop.id = ?1 AND ((?2 IS NULL OR
        // ?3 IS NULL) AND o.createdAt BETWEEN ?2 AND ?3) AND (?4 IS NULL OR
        // o.orderStatus.name = ?4) OR (?5 IS NULL OR o.customerInfo LIKE CONCAT('%',
        // ?5, '%')) ")
        @Query("SELECT COUNT(o) FROM Order o " +
                        "WHERE o.shop.id = ?1 " +
                        "AND ((?2 IS NULL OR ?3 IS NULL) OR o.createdAt BETWEEN ?2 AND ?3) " +
                        "AND (?4 IS NULL OR o.orderStatus.id = ?4) " +
                        "AND (?5 IS NULL OR o.customerInfo LIKE CONCAT('%', ?5, '%'))")

        int countBySearch(int shopId, Date startDate, Date endDate, Integer orderStatusName, String keyword);

        // @Query("SELECT new com.thebugs.back_end.dto.OrderDetailSellerDTO(" +
        // "o.id, o.customerInfo, o.createdAt, os.name, o.paymentMethod,
        // o.paymentStatus, " +
        // "SUM(oi.quantity * oi.price), oi.quantity, p.name, COALESCE(i.imageName, ''),
        // oi.price, " +
        // "COALESCE(LEAST(SUM(oi.quantity * oi.price) * v.discountPercentage / 100,
        // v.maxDiscount), 0)) "
        // +
        // "FROM Order o " +
        // "LEFT JOIN OrderItem oi ON o.id = oi.order.id " +
        // "LEFT JOIN Product p ON oi.product.id = p.id " +
        // "LEFT JOIN OrderStatus os ON o.orderStatus.id = os.id " +
        // "LEFT JOIN Voucher v ON o.voucher.id = v.id " +
        // "LEFT JOIN Image i ON i.product.id = p.id " +
        // "WHERE o.id = ?1 AND o.shop.id = ?2 " +
        // "GROUP BY o.id, o.customerInfo, o.createdAt, os.name, o.paymentMethod,
        // o.paymentStatus, " +
        // "oi.quantity, p.name, i.imageName, oi.price")
        // Optional<OrderDetailSellerDTO> findOrderDetailByIdAndShopId(Integer orderId,
        // Integer shopId);

        // grok3
        // @Query("SELECT new com.thebugs.back_end.dto.OrderDetailSellerDTO(" +
        // "o.id, o.customerInfo, o.createdAt, os.name, o.paymentMethod,
        // o.paymentStatus, " +
        // "SUM(oi.quantity * oi.price), oi.quantity, p.name, COALESCE(i.imageName, ''),
        // oi.price, " +
        // "COALESCE(LEAST(SUM(oi.quantity * oi.price) * v.discountPercentage / 100,
        // v.maxDiscount), 0), "
        // +
        // "SUBSTRING(o.customerInfo, LOCATE(',', o.customerInfo, LOCATE(',',
        // o.customerInfo) + 1) + 1), "
        // +
        // "o.shippingFee) " +
        // "FROM Order o " +
        // "LEFT JOIN OrderItem oi ON o.id = oi.order.id " +
        // "LEFT JOIN Product p ON oi.product.id = p.id " +
        // "LEFT JOIN OrderStatus os ON o.orderStatus.id = os.id " +
        // "LEFT JOIN Voucher v ON o.voucher.id = v.id " +
        // "LEFT JOIN Image i ON i.product.id = p.id " +
        // "WHERE o.id = ?1 AND o.shop.id = ?2 " +
        // "GROUP BY o.id, o.customerInfo, o.createdAt, os.name, o.paymentMethod,
        // o.paymentStatus, " +
        // "oi.quantity, p.name, i.imageName, oi.price, o.shippingFee")
        // List<OrderDetailSellerDTO> findOrderDetailByIdAndShopId(Integer orderId,
        // Integer shopId);

        // @Query("SELECT new com.thebugs.back_end.dto.OrderDetailSellerDTO(" +
        // "o.id, o.customerInfo, o.createdAt, os.name, " +
        // "o.paymentMethod, o.paymentStatus, SUM(oi.quantity * oi.price), " +
        // "o.customerInfo, o.shippingFee, o.shippingMethod, " +
        // "COALESCE(LEAST(SUM(oi.quantity * oi.price) * v.discountPercentage / 100,
        // v.maxDiscount), 0)) "
        // +
        // "FROM Order o " +
        // "LEFT JOIN o.orderItems oi " +
        // "LEFT JOIN o.orderStatus os " +
        // "LEFT JOIN o.voucher v " +
        // "WHERE o.id = ?1 AND o.shop.id = ?2 " +
        // "GROUP BY o.id, o.customerInfo, o.createdAt, os.name, o.paymentMethod,
        // o.paymentStatus, o.shippingFee, o.shippingMethod")
        // List<OrderDetailSellerDTO> findOrderDetailByIdAndShopId(Integer orderId,
        // Integer shopId);
        @Query("SELECT o FROM Order o WHERE o.orderStatus.id = ?1 AND o.deliveredAt IS NOT NULL")
        List<Order> findDeliveredOrdersByStatus(@Param("statusId") int statusId);
}
