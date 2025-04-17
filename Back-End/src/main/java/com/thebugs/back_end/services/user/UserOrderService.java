package com.thebugs.back_end.services.user;

import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.dto.OrderDTO;
import com.thebugs.back_end.dto.OrderSimpleDTO;
import com.thebugs.back_end.dto.ProductOrderDTO;
import com.thebugs.back_end.entities.Order;
import com.thebugs.back_end.entities.OrderStatus;
import com.thebugs.back_end.mappers.OrderMapper;
import com.thebugs.back_end.repository.OrderJPA;
import com.thebugs.back_end.repository.OrderStatusJPA;
import com.thebugs.back_end.utils.ColorUtil;
import com.thebugs.back_end.utils.FormatCustomerInfo;

@Service
public class UserOrderService {
    @Autowired
    UserService userService;
    @Autowired
    OrderJPA orderJPA;
    @Autowired
    OrderStatusJPA orderStatusJPA;
    @Autowired
    OrderMapper orderMapper;

    public ArrayList<OrderSimpleDTO> getAll(String token, int page, int size) {
        int userId = userService.getUserToken(token).getId();
        Pageable pageable2 = PageRequest.of(page - 1, size, Sort.Direction.DESC, "id");
        Page<OrderSimpleDTO> order = orderJPA.findOrderByUserId(userId, pageable2);
        return order.stream()
                .collect(Collectors.toCollection(ArrayList::new));
    }

    public int getTotalItemsOrderByUserId(String token) {
        int userId = userService.getUserToken(token).getId();
        return orderJPA.countOrderByUserId(userId);
    }

    public ArrayList<OrderSimpleDTO> findOrders(String token, Date startDate, Date endDate,
            Integer orderStatusName, // Đảm bảo là Integer
            String nameUser, Pageable pageable) {
        int userId = userService.getUserToken(token).getId();
        Page<OrderSimpleDTO> page;
        if (startDate == null && endDate == null && orderStatusName == null
                && (nameUser == null || nameUser.trim().isEmpty())) {
            ColorUtil.print(ColorUtil.RED, "ServiceOrder");
            page = orderJPA.findOrderByUserId(userId, pageable);
            ColorUtil.print(ColorUtil.RED, page.toString());
        } else {
            page = orderJPA.findOrderUserByDateAndKeyWordAndStatus(userId, startDate, endDate,
                    orderStatusName,
                    nameUser, pageable);
        }
        return page.stream()
                .collect(Collectors.toCollection(ArrayList::new));
    }

    public int countOrders(String token, Date startDate, Date endDate, Integer orderStatusName,
            String nameUser) {
        int userId = userService.getUserToken(token).getId();
        if (startDate == null && endDate == null && orderStatusName == null
                && (nameUser == null || nameUser.trim().isEmpty())) {
                    System.out.println("USER ID");
                    System.out.println(userId);
            return orderJPA.countOrderByUserId(userId);
        }

        return orderJPA.countBySearchOrderUser(userId, startDate, endDate, orderStatusName, nameUser);
    }

    public OrderDTO updateStatusOrder(String token, int orderId, int orderStatusId, String cancelReason) {
        int userId = userService.getUserToken(token).getId();

        Order checkShopId = getByUserId(orderId, userId);
        boolean checkStatusId = isAllowedTransition(orderId, orderStatusId);
        Optional<Order> orderOptional = orderJPA.findById(orderId);
        int currentStatus = orderOptional.get().getOrderStatus().getId();

        if (currentStatus == orderStatusId) {
            return orderMapper.toDTO(orderJPA.save(checkShopId));
        }
        if (!checkStatusId) {
            throw new IllegalArgumentException(
                    "Không thể cập nhật trạng thái từ " + currentStatus + " sang " + orderStatusId);
        }
        if (orderStatusId == 2 && (cancelReason == null || cancelReason.trim().isEmpty())) {
            throw new IllegalArgumentException("Lý do hủy không được để trống khi hủy đơn hàng");
        } else {
            checkShopId.setNoted(cancelReason);
        }
        if (orderStatusId == 4) {
            checkShopId.setDeliveredAt(new Date());
        }

        checkShopId.setOrderStatus(getByStatusToOrder(orderStatusId));
        return orderMapper.toDTO(orderJPA.save(checkShopId));
    }

    @Scheduled(cron = "0 0 0 * * ?")
    public void autoConfirmReceived() {
        Date now = new Date();
        List<Order> orders = orderJPA.findDeliveredOrdersByStatus(4);

        for (Order order : orders) {
            if (order.getDeliveredAt() == null) {
                long formatSecond = (now.getTime() - order.getDeliveredAt().getTime());
                long checkDay = formatSecond / (1000 * 60 * 60 * 24);
                if (checkDay >= 7) {
                    OrderStatus status = orderStatusJPA.findById(5)
                            .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy trạng thái 'Đã nhận'"));
                    order.setOrderStatus(status);
                    orderJPA.save(order);
                    System.out.println(" Order ID " + order.getId() + " tự chuyển sang 'Đã nhận'");
                }
            }

        }
    }

    public Order getById(int id) {
        Order order = orderJPA.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy id order"));
        return order;
    }

    public Order getByUserId(int orderId, int userId) {
        Order order = orderJPA.getOrderByUserId(orderId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy id user"));
        return order;
    }

    public OrderStatus getByStatusToOrder(int id) {
        OrderStatus orderStatus = orderStatusJPA.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy id status"));
        return orderStatus;
    }

    public Boolean isAllowedTransition(int id, int newOrderStatusId) {
        Optional<Order> orderStatus = orderJPA.findById(id);
        int currentStatus = orderStatus.get().getOrderStatus().getId();

        if (currentStatus == 1) {
            if (newOrderStatusId == 2) {

                return true;

            }
        } else if (currentStatus == 4) {
            if (newOrderStatusId == 5) {
                return true;
            }
        } else {
            return false;
        }

        return false;
    }

    public Object getOrderDetail(int orderId, String token) {
        int userId = userService.getUserToken(token).getId();
        Order order = getByUserId(orderId, userId);
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("orderId", order.getId());
        map.put("fullName", FormatCustomerInfo.fullName(order.getCustomerInfo()));
        map.put("phone", FormatCustomerInfo.phone(order.getCustomerInfo()));
        map.put("address", FormatCustomerInfo.address(order.getCustomerInfo()));
        map.put("paymentMethod", order.getPaymentMethod());
        map.put("paymentStatus", order.getPaymentStatus());
        map.put("shippingFee", order.getShippingFee());
        map.put("createdAt", order.getCreatedAt());
        map.put("orderStatusName", order.getOrderStatus().getName());
        map.put("noted", order.getNoted());
        // map.put("shopId", order.getShop().getId());
        // map.put("shopName", order.getShop().getName());
        map.put("orderItems", order.getOrderItems().stream()
                .map(item -> {
                    ProductOrderDTO productOrderDTO = new ProductOrderDTO();
                    productOrderDTO.setProductId(item.getProduct().getId());
                    productOrderDTO.setProductName(item.getProduct().getName());
                    productOrderDTO.setProductImage(
                            item.getProduct().getImages().get(0).getImageName());// lấy ảnh
                                                                                 // đầu
                                                                                   // tiên
                    productOrderDTO.setPriceProduct(item.getPrice());
                    productOrderDTO.setQuantityProduct(item.getQuantity());
                    productOrderDTO.setTotalPriceProduct(item.getPrice() * item.getQuantity());
                    productOrderDTO.setShopId(item.getProduct().getShop().getId());
                    productOrderDTO.setShopName(item.getProduct().getShop().getName());
                    return productOrderDTO;
                })
                .collect(Collectors.toList()));

        double total = order.getOrderItems().stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity()).sum();
        double discount = order.getVoucher() != null ? order.getVoucher().getDiscountPercentage() : 0;
        double maxDiscount = order.getVoucher() != null ? order.getVoucher().getMaxDiscount() : 0;
        double shippingFee = order.getShippingFee();
        double totalDiscount = order.getOrderItems().stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity()).sum() * discount / 100;

        double min = Math.min(totalDiscount, maxDiscount);
        double totalPrice = total - min + shippingFee;
        map.put("totalPrice", total);
        map.put("totalDiscount", min);
        map.put("shippingMethod", shippingFee);
        map.put("total", totalPrice);
        return map;

    }
}
