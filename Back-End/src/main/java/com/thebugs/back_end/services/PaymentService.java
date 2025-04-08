package com.thebugs.back_end.services;

import com.thebugs.back_end.beans.CartBean;
import com.thebugs.back_end.beans.CartItemBean;
import com.thebugs.back_end.entities.Order;
import com.thebugs.back_end.entities.OrderItem;
import com.thebugs.back_end.entities.User;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    @Autowired
    private CartItemService cartItemService;

    @Autowired
    private UserService userService;

    @Autowired
    private ProductService productService;

    @Autowired
    private ShopService shopService;

    @Autowired
    private VoucherService voucherService;

    @Autowired
    private OrderStatusService orderStatusService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderItemService orderItemService;



    public boolean createOrder(String authorizationHeader, List<CartBean> cartBeans) {
        // if (cartBeans == null || cartBeans.isEmpty()) {
        //     throw new IllegalArgumentException("Giỏ hàng không được null hoặc rỗng");
        // }
        User user = userService.getUserToken(authorizationHeader);
        for (CartBean cartBean2 : cartBeans) {
            Order order = new Order();
            System.out.println("cartBean2.getShopId() = " + cartBean2.getShopId());
            System.out.println("cartBean2.getPaymentMethod() = " + cartBean2.getPaymentMethod());
            order.setUser(user);
            order.setShop(shopService.getShopById(cartBean2.getShopId()));
            order.setPaymentMethod(cartBean2.getPaymentMethod());
            order.setCustomerInfo(cartBean2.getCustomerInfo());
            if (cartBean2.getVoucherId() != null) {
                order.setVoucher(voucherService.getVoucherById(cartBean2.getVoucherId()));
            } else {
                order.setVoucher(null);  // hoặc set một giá trị mặc định nếu cần
            }
            order.setShippingFee(cartBean2.getShippingFee());
            order.setCreatedAt(new Date());
            order.setNoted(null);
            order.setOrderStatus(orderStatusService.getOrderStatusById(1));
            order.setPaymentStatus("Chưa thanh toán");

            Order savedOrder = orderService.saveOrder(order);
            for (CartItemBean cartItemBean : cartBean2.getCartItems()) {
                OrderItem orderItem = new OrderItem();
                orderItem.setOrder(savedOrder);
                orderItem.setProduct(productService.getProductById(cartItemBean.getProductId()));
                orderItem.setQuantity(cartItemBean.getQuantity());
                orderItem.setPrice(cartItemBean.getPrice());

                orderItemService.saveOrderItem(orderItem);
          
                productService.updateProductQuantity(cartItemBean.getProductId(), cartItemBean.getQuantity());

                cartItemService.deleteCartItem(authorizationHeader, cartItemBean.getProductId());
            }
        }

        return true;

    }
}