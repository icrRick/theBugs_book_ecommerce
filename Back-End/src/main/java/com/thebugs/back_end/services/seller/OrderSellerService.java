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
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

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

        public ArrayList<OrderSimpleDTO> findOrderByShopId(Integer shopId, Pageable pageable) {
                Page<OrderSimpleDTO> order = orderJPA.findOrderByShopId(shopId, pageable);
                return order.stream()
                                .collect(Collectors.toCollection(ArrayList::new));
        }

        public Integer getTotalOrder() {
                return null;
        }

        // code cua tam
        public ArrayList<OrderSimpleDTO> getAllOrders(int page, int size, String token) {
                User user = userService.getUserToken(token);
                int shopId = user.getShop().getId();
                Pageable pageable = PageRequest.of(page - 1, size, Sort.Direction.DESC, "id");
                Page<OrderSimpleDTO> getAllListOrder = orderJPA.findOrderByShopId(shopId, pageable);
                return getAllListOrder.stream()
                                .collect(Collectors.toCollection(ArrayList::new));

        }

        public ArrayList<OrderSimpleDTO> searchSellerOrder(String token, Date startDate, Date endDate,
                        Integer orderStatusName, // Đảm bảo là Integer
                        String nameUser, int page, int size) {
                User user = userService.getUserToken(token);
                int shopId = user.getShop().getId();
                Pageable pageable = PageRequest.of(page - 1, size, Sort.Direction.DESC, "id");
                Page<OrderSimpleDTO> page2 = orderJPA.findOrderbyDateOrStatusOrName(shopId, startDate, endDate,
                                orderStatusName,
                                nameUser, pageable);
                return page2.stream()
                                .collect(Collectors.toCollection(ArrayList::new));
        }

        public int getTotalItems(String token) {
                User user = userService.getUserToken(token);
                int shopId = user.getShop().getId();
                return orderJPA.countByShopId(shopId);
        }

        public int getTotalItemsBySearch(String token, Date startDate, Date endDate, Integer orderStatusName, // Đảm bảo
                                                                                                              // là
                                                                                                              // Integer
                        String nameUser) {
                User user = userService.getUserToken(token);
                int shopId = user.getShop().getId();
                return orderJPA.countBySearch(shopId, startDate, endDate, orderStatusName, nameUser);
        }

        // public OrderDetailSellerDTO getOrderDetail(int orderId, String token) {
        // int shopId = userService.getUserToken(token).getShop().getId();
        // List<OrderDetailSellerDTO> orderDetailSellerDTO =
        // orderJPA.findOrderDetailByIdAndShopId(orderId,
        // shopId);
        // if (orderDetailSellerDTO.isEmpty()) {
        // throw new IllegalArgumentException("Không tìm thấy đơn hàng với id: " +
        // orderId);
        // }
        // for (OrderDetailSellerDTO orderDetailById : orderDetailSellerDTO) {
        // if (orderDetailById.getId() == orderId) {
        // return orderDetailById;
        // }
        // }
        // return null;

        // }

        public Object getOrderDetail(int orderId, String token) {
                int shopId = userService.getUserToken(token).getShop().getId();
                Order order = getByShopId(orderId, shopId);
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
                if (orderStatusId == 2 && (cancelReason == null || cancelReason.trim().isEmpty())) {
                        throw new IllegalArgumentException("Lý do hủy không được để trống khi hủy đơn hàng");
                }
                if (orderStatusId == 2) {

                        if (!getUserEmail(orderId, cancelReason)) {
                                throw new IllegalArgumentException("Không tìm thấy email user");
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
                        if (newOrderStatusId == 4) {
                                return true;
                        }
                } else if (currentStatus == 4) {
                        if (newOrderStatusId == 5) {
                                return true;
                        }
                }

                return false;
        }

        public boolean getUserEmail(Integer orderId, String cancelReason) {
                // Order order = getById(orderId);
                // String mail = order.getUser().getEmail();
                // sendMail(mail, cancelReason);
                return true;
        }

        // public void sendMail(String setTo, String cancelReason) {
        //         MimeMessage message = mailSender.createMimeMessage();
        //         try {
        //                 MimeMessageHelper helper = new MimeMessageHelper(message, true);
        //                 helper.setTo(setTo);
        //                 helper.setSubject("Hủy Đơn Hàng");

        //                 String htmlContent = "<!DOCTYPE html>" +
        //                                 "<html>" +
        //                                 "<body>" +
        //                                 "<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">" +
        //                                 "  <tr>" +
        //                                 "    <td align=\"center\" style=\"background: #f0f0f0;\">" +
        //                                 "      <div style=\"max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);\">"
        //                                 +
        //                                 "        <h1 style=\"color: #d9534f; text-align: center;\">Hủy Đơn Hàng</h1>" +
        //                                 "        <p style=\"color: #333; text-align: center;\">Kính gửi quý khách,</p>"
        //                                 +
        //                                 "        <p style=\"color: #333; text-align: center;\">Chúng tôi rất tiếc phải thông báo rằng đơn hàng của quý khách đã bị hủy. Dưới đây là chi tiết:</p>"
        //                                 +
        //                                 "        <div style=\"background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;\">"
        //                                 +
        //                                 "          <p style=\"color: #333;\">Lý do hủy: " + cancelReason + "</p>" +
        //                                 "        </div>" +
        //                                 "        <p style=\"color: #333; text-align: center;\">Nếu quý khách có bất kỳ câu hỏi nào, vui lòng liên hệ với đội ngũ hỗ trợ của chúng tôi.</p>"
        //                                 +
        //                                 "        <div style=\"text-align: center; margin-top: 20px;\">" +
        //                                 "          <a href=\"https://yourwebsite.com/order-details\" style=\"background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;\">Xem Chi Tiết</a>"
        //                                 +
        //                                 "        </div>" +
        //                                 "        <p style=\"color: #666; text-align: center; margin-top: 30px;\">Trân trọng,<br>Đội ngũ My Company</p>"
        //                                 +
        //                                 "      </div>" +
        //                                 "    </td>" +
        //                                 "  </tr>" +
        //                                 "</table>" +
        //                                 "</body>" +
        //                                 "</html>";

        //                 helper.setText(htmlContent, true); // Gắn nội dung HTML vào email
        //                 mailSender.send(message);
        //         } catch (MessagingException e) {
        //                 e.printStackTrace();
        //         }
        // }

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
                                        throw new IllegalArgumentException("Số lượng sản phẩm trong kho không đủ");
                                }
                                int quantityProduct = product.getQuantity() - orderItem.getQuantity();

                                product.setQuantity(quantityProduct);
                                productJPA.save(product);

                                PromotionProduct promotionProduct = promotionProductJPA
                                                .findByPromotionProductByProductId(product.getId());
                                if (promotionProduct == null) {
                                        throw new IllegalArgumentException("Không tìm thấy sản phẩm khuyến mãi với id: "
                                                        + product.getId());
                                }
                                if (promotionProduct.getQuantity() < orderItem.getQuantity()) {
                                        throw new IllegalArgumentException("Số lượng sản phẩm khuyến mãi không đủ");
                                }
                                int quantityPromotionProduct = promotionProduct.getQuantity() - orderItem.getQuantity();
                                promotionProduct.setQuantity(quantityPromotionProduct);
                                promotionProductJPA.save(promotionProduct);
                                break;
                        }
                        break;
                }
        }
}
