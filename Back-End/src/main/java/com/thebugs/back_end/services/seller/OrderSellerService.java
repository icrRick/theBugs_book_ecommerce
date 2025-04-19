package com.thebugs.back_end.services.seller;

import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.dto.OrderDTO;
import com.thebugs.back_end.dto.OrderSimpleDTO;
import com.thebugs.back_end.dto.ProductOrderDTO;
import com.thebugs.back_end.entities.Order;
import com.thebugs.back_end.entities.OrderItem;
import com.thebugs.back_end.entities.OrderStatus;
import com.thebugs.back_end.entities.Product;
import com.thebugs.back_end.entities.PromotionProduct;
import com.thebugs.back_end.entities.User;
import com.thebugs.back_end.mappers.OrderMapper;
import com.thebugs.back_end.repository.OrderItemJPA;
import com.thebugs.back_end.repository.OrderJPA;
import com.thebugs.back_end.repository.OrderStatusJPA;
import com.thebugs.back_end.repository.ProductJPA;
import com.thebugs.back_end.repository.PromotionProductJPA;
import com.thebugs.back_end.services.user.UserService;
import com.thebugs.back_end.utils.EmailUtil;
import com.thebugs.back_end.utils.FormatCustomerInfo;

@Service
public class OrderSellerService {

        @Autowired
        private OrderMapper orderMapper;
        @Autowired
        UserService userService;
        @Autowired
        private OrderJPA orderJPA;

        @Autowired
        private OrderStatusJPA orderStatusJPA;

        @Autowired
        private OrderItemJPA orderItemJPA;
        @Autowired
        private ProductJPA productJPA;
        @Autowired
        private PromotionProductJPA promotionProductJPA;
        @Autowired
        private EmailUtil emailUtil;

        public ArrayList<OrderSimpleDTO> findOrderByShopId(Integer shopId, Pageable pageable) {
                // Page<OrderSimpleDTO> order = orderJPA.findOrderByShopId(shopId, pageable);
                // return order.stream()
                //                 .collect(Collectors.toCollection(ArrayList::new));
                return null;
        }

        public Integer getTotalOrder() {
                return null;
        }

        // code cua tam
        // public ArrayList<OrderSimpleDTO> findOrders(String token, Date startDate, Date endDate,
        //                 Integer orderStatusName, // Đảm bảo là Integer
        //                 String nameUser, Pageable pageable) {
        //         User user = userService.getUserToken(token);
        //         int shopId = user.getShop().getId();
        //         Page<OrderSimpleDTO> orderPage =null;
        //         // if (startDate == null && endDate == null && orderStatusName == null
        //         //                 && (nameUser == null || nameUser.trim().isEmpty())) {

        //         //        // orderPage = orderJPA.findOrderByShopId(shopId, pageable);
        //         // } else {

        //         //       //  orderPage = orderJPA.findOrderbyDateOrStatusOrName(shopId, startDate, endDate, orderStatusName,
        //         //       //                  nameUser, pageable);
        //         // }
        //         // return orderPage.stream()
        //         //                 .collect(Collectors.toCollection(ArrayList::new));
        //         return null;
        //                 orderPage = orderJPA.findOrderbyDateOrStatusOrName(shopId, startDate, endDate, orderStatusName,
        //                                 nameUser, pageable);
        //                 System.out.printf(
        //                                 "==============================================================================="
        //                                                 + orderPage);
        //         }
        //         return orderPage.stream()
        //                         .collect(Collectors.toCollection(ArrayList::new));
        // }
        

        public int countOrders(String token, Date startDate, Date endDate, Integer orderStatusName, String nameUser) {
                User user = userService.getUserToken(token);
                int shopId = user.getShop().getId();

                if (startDate == null && endDate == null && orderStatusName == null
                                && (nameUser == null || nameUser.trim().isEmpty())) {
                        return orderJPA.countByShopId(shopId);
                } else {
                        return orderJPA.countBySearch(shopId, startDate, endDate, orderStatusName, nameUser);
                }
        }

        public Object getOrderDetail(int orderId, String token) {
                int shopId = userService.getUserToken(token).getShop().getId();
                Order order = getByShopId(orderId, shopId);
                Map<String, Object> map = new LinkedHashMap<>();
                map.put("orderId", order.getId());
                map.put("fullName", FormatCustomerInfo.fullName(order.getCustomerInfo()));
                map.put("phone", FormatCustomerInfo.phone(order.getCustomerInfo()));
                map.put("address", FormatCustomerInfo.address(order.getCustomerInfo()));
                // map.put("paymentMethod", order.getPaymentMethod());
                // map.put("paymentStatus", order.getPaymentStatus());
                map.put("shippingFee", order.getShippingFee());
                map.put("createdAt", order.getCreatedAt());
                map.put("orderStatusName", order.getOrderStatus().getName());
                map.put("noted", order.getNoted());
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
                                        return productOrderDTO;
                                })
                                .collect(Collectors.toList()));

                double total = order.getOrderItems().stream()
                                .mapToDouble(item -> item.getPrice() * item.getQuantity()).sum();
                double discountVoucher = order.getVoucher() != null ? order.getVoucher().getDiscountPercentage() : 0;
                double maxDiscount = order.getVoucher() != null ? order.getVoucher().getMaxDiscount() : 0;
                double shippingFee = order.getShippingFee();
                double totalOrderWithDiscount = order.getOrderItems().stream()
                                .mapToDouble(item -> item.getPrice() * item.getQuantity()).sum() * discountVoucher
                                / 100;

                double min = Math.min(totalOrderWithDiscount, maxDiscount);
                double totalPrice = total - min + shippingFee;
                map.put("totalPrice", total);
                map.put("totalDiscount", min);
                map.put("shippingMethod", shippingFee);
                map.put("total", totalPrice);
                return map;
        }

        public OrderDTO updateStatusOrder(String token, int orderId, int orderStatusId, String cancelReason) {
                User user = userService.getUserToken(token);
                int shopId = user.getShop().getId();

                Order checkShopId = getByShopId(orderId, shopId);
                boolean checkStatusId = isAllowedTransition(orderId, orderStatusId);
                Optional<Order> orderOptional = orderJPA.findById(orderId);
                int currentStatus = orderOptional.get().getOrderStatus().getId();
                if (currentStatus == 2 || currentStatus == 5) {
                        throw new IllegalArgumentException("Đơn hàng đã ở trạng thái cuối, không thể cập nhật thêm");
                }
                if (currentStatus == orderStatusId) {
                        return orderMapper.toDTO(orderJPA.save(checkShopId));
                }
                if (!checkStatusId) {
                        throw new IllegalArgumentException(
                                        "Không thể cập nhật trạng thái từ " + currentStatus + " sang " + orderStatusId);
                }
                if ((orderStatusId == 2)
                                && (cancelReason == null || cancelReason.trim().isEmpty())) {
                        throw new IllegalArgumentException("Lý do hủy không được để trống khi hủy đơn hàng");
                }
                if (orderStatusId == 2) {

                        if (!getUserEmailCancelReason(orderId, cancelReason)) {
                                throw new IllegalArgumentException("Không tìm thấy email user");
                        } else if ((orderStatusId == 2)
                                        && (cancelReason == null || cancelReason.trim().isEmpty())) {
                                throw new IllegalArgumentException("Lý do hủy không được để trống khi hủy đơn hàng");
                        } else {
                                checkShopId.setNoted(cancelReason);
                        }
                }
                if (orderStatusId == 3) {
                        updateProductQuantities(token, orderId);
                }
                checkShopId.setOrderStatus(getByStatusToOrder(orderStatusId));
                return orderMapper.toDTO(orderJPA.save(checkShopId));
        }

        public Order getById(int id) {
                Order order = orderJPA.findById(id)
                                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy id order"));
                return order;
        }

        public Order getByShopId(int orderId, int shopId) {
                Order order = orderJPA.getOrderByShopId(orderId, shopId)
                                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy id shop"));
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
                        if (newOrderStatusId == 2 || newOrderStatusId == 3) {

                                return true;

                        }
                } else if (currentStatus == 3) {
                        if (newOrderStatusId == 2 || newOrderStatusId == 4) {
                                return true;
                        }
                } else if (currentStatus == 4) {
                        if (newOrderStatusId == 5) {
                                return false;
                        }
                }

                return false;
        }

        public boolean getUserEmailCancelReason(Integer orderId, String cancelReason) {
                Order order = getById(orderId);
                String mail = order.getUser().getEmail();
                String setSubject = ("Đơn hàng #" + "" + order.getId() + " " + "của bạn đã bị hủy");
                emailUtil.sendMailCancelReason(mail, setSubject, cancelReason);
                return true;
        }

        public boolean getUserEmailToast(Integer orderId, String cancelReason) {
                Order order = getById(orderId);
                String mail = order.getUser().getEmail();
                String setSubject = ("Đơn hàng #" + "" + order.getId() + " " + "của bạn đã được cập nhật lại");
                emailUtil.sendMailCancelReason(mail, setSubject, cancelReason);
                return true;
        }

        private void updateProductQuantities(String token, int orderId) {
                // tim order theo id
                // lay duoc list order item theo order id

                List<OrderItem> listOrderItems = orderItemJPA.findByOrderId(orderId);
                if (listOrderItems.isEmpty()) {
                        throw new IllegalArgumentException("Không tìm thấy order item với id: " + orderId);
                }
                int shopId = userService.getUserToken(token).getShop().getId();
                for (OrderItem orderItem : listOrderItems) {
                        Product product = productJPA.findProductByShopId(shopId, orderItem.getProduct().getId());
                        if (orderItem.getProduct().getId() == product.getId()) {
                                if (orderItem.getQuantity() > product.getQuantity()) {
                                        String cancelReason = ("Số lượng sản phẩm trong kho không đủ - đã chuyển trạng thái đơn hàng sang hủy");
                                        updateStatusOrder(token, orderId, 2, cancelReason);
                                        throw new IllegalArgumentException(cancelReason);
                                }
                                int quantityProduct = product.getQuantity() - orderItem.getQuantity();

                                product.setQuantity(quantityProduct);
                                productJPA.save(product);

                                if (checkQuantityPromotionProduct(token, orderId)) {
                                }

                        }
                        break;
                }
        }

        private boolean checkQuantityPromotionProduct(String token, int orderId) {
                List<OrderItem> listOrderItems = orderItemJPA.findByOrderId(orderId);

                for (OrderItem orderItem : listOrderItems) {
                        Optional<PromotionProduct> promotionProductOptional = promotionProductJPA
                                        .findByPromotionProductByProductId(orderItem.getProduct().getId());
                        if (promotionProductOptional.isPresent()) {
                                PromotionProduct promotionProduct = promotionProductOptional.get();
                                if (promotionProduct.getQuantity() < orderItem.getQuantity()) {
                                        int tam = promotionProduct.getQuantity();
                                        orderItem.setQuantity(tam);
                                        orderItemJPA.save(orderItem);
                                        String note = ("Số lượng sản phẩm " + promotionProduct.getProduct().getName()
                                                        + " trong Flash Sale không đủ " + promotionProduct.getQuantity()
                                                        + " đã cập nhật số lượng trong đơn hàng thành "
                                                        + orderItem.getQuantity());
                                        orderItem.getOrder().setNoted(note);
                                        getUserEmailToast(orderId, note);

                                        int quantityPromotionProduct = orderItem.getQuantity()
                                                        - orderItem.getQuantity();

                                        promotionProduct.setQuantity(quantityPromotionProduct);

                                        int soldQuantity = promotionProduct.getSoldQuantity()
                                                        + tam;

                                        promotionProduct.setSoldQuantity(soldQuantity);
                                        promotionProductJPA.save(promotionProduct);
                                        if (promotionProduct.getQuantity() <= 0) {
                                                promotionProductJPA.delete(promotionProduct);
                                        }

                                }
                                int quantityPromotionProduct = promotionProduct.getQuantity()
                                                - orderItem.getQuantity();
                                promotionProduct.setQuantity(quantityPromotionProduct);

                                int soldQuantity = promotionProduct.getSoldQuantity()
                                                + orderItem.getQuantity();

                                promotionProduct.setSoldQuantity(soldQuantity);

                                promotionProductJPA.save(promotionProduct);
                        }
                        return true;

                }
                return false;
        }

}
