package com.thebugs.back_end.services;

import com.thebugs.back_end.controllers.AddressController;
import com.thebugs.back_end.dto.CartItemDTO;
import com.thebugs.back_end.dto.ProductCartItemDTO;
import com.thebugs.back_end.entities.Order;
import com.thebugs.back_end.entities.OrderItem;
import com.thebugs.back_end.entities.User;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

//         @Autowired
//         private UserService userService;

//         @Autowired
//         private OrderService orderService;
//         @Autowired
//         private SellerService sellerService;
//         @Autowired
//         private CartService cartService;

//         @Autowired
//         private OrderStatusService orderStatusService;

//         @Autowired
//         private ProductService productService;

//         public boolean placeOrderByUser(User user, String customerInfo, List<Integer> voucherId) {

//                 List<CartItemDTO> cartItemDTOs = cartService.getCartItemsByUser(user);
//                 for (CartItemDTO cartItemDTO : cartItemDTOs) {
//                         Order order = new Order();
//                         order.setCustomerInfo(customerInfo);
//                         order.setPaymentMethod(null);
//                         order.setPaymentStatus(null);
//                         // order.setNoted();
//                         order.setShippingFee(0.0);
//                         order.setCreatedAt(new Date());
//                         order.setOrderStatus(orderStatusService.getOrderStatusById(1));

//                         // order.setOrderItems(null);
//                         order.setUser(user);

//                         order.setVoucher(null);
//                         order.setShop(sellerService.getShopById(cartItemDTO.getShopId()));
//                         Order saveOrder = orderService.saveOrder(order);
//                         for (ProductCartItemDTO productItem : cartItemDTO.getProducts()) {
//                                 OrderItem orderItem = new OrderItem();
//                                 orderItem.setOrder(saveOrder);
//                                 orderItem.setProduct(productService.findProductById(productItem.getProductId()));
//                                 orderItem.setQuantity(productItem.getCartItemQuantity());
//                                 orderItem.setPrice(productItem.getProductPrice() * productItem.getPromotionValue());
//                         }
//                 }
//                 return true;
//         }
// }
}