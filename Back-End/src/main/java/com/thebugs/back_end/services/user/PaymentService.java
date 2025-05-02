package com.thebugs.back_end.services.user;

import com.thebugs.back_end.beans.CartBean;
import com.thebugs.back_end.beans.CartItemBean;
import com.thebugs.back_end.beans.PaymentBean;
import com.thebugs.back_end.dto.ProItemDTO;
import com.thebugs.back_end.entities.Order;
import com.thebugs.back_end.entities.OrderItem;
import com.thebugs.back_end.entities.Product;
import com.thebugs.back_end.entities.Shop;
import com.thebugs.back_end.entities.User;
import com.thebugs.back_end.entities.Voucher;
import com.thebugs.back_end.mappers.ProItemMapper;
import com.thebugs.back_end.services.seller.ShopService;
import com.thebugs.back_end.services.seller.VoucherService;
import com.thebugs.back_end.services.super_admin.PublisherService;

import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

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

    @Autowired
    private ProductAuthorService productAuthorService;

    @Autowired
    private ProductGenreService productGenreService;

    @Autowired
    private PublisherService publisherService;

    @Autowired
    private CartItemService cartItemService;

    @Autowired
    private OrderPaymentService orderPaymentService;

    @Autowired
    private ProItemMapper proItemMapper;

    public List<Integer> createOrder(String authorizationHeader, List<CartBean> cartBeans) {
        List<Integer> orderIdIntegers = new ArrayList<>();
        if (cartBeans == null || cartBeans.isEmpty()) {
            throw new IllegalArgumentException("Giỏ hàng không được null hoặc rỗng");
        }
        User user = userService.getUserToken(authorizationHeader);
        for (CartBean cartBean2 : cartBeans) {
            Order order = new Order();
            order.setUser(user);
            order.setShop(shopService.getShopById(cartBean2.getShopId()));

            order.setCustomerInfo(cartBean2.getCustomerInfo());
            if (cartBean2.getVoucherId() != null) {
                order.setVoucher(voucherService.getVoucherById(cartBean2.getVoucherId()));
            } else {
                order.setVoucher(null);
            }
            order.setShippingFee(cartBean2.getShippingFee());
            order.setCreatedAt(new Date());
            order.setNoted(null);
            order.setOrderStatus(orderStatusService.getOrderStatusById(1));

            if (cartBean2.getPaymentMethod().equals("Thanh toán tiền mặt khi nhận hàng")) {
                order.setOrderPayment(orderPaymentService.findByOrderPayment(1));
            } else {
                order.setOrderPayment(orderPaymentService.findByOrderPayment(4));
            }
            Order savedOrder = orderService.saveOrder(order);
            orderIdIntegers.add(savedOrder.getId());
            for (CartItemBean cartItemBean : cartBean2.getCartItems()) {
                OrderItem orderItem = new OrderItem();
                Product product = productService.getProductById(cartItemBean.getProductId());


                orderItem.setOrder(savedOrder);
                orderItem.setProduct(product);
                orderItem.setQuantity(cartItemBean.getQuantity());
                orderItem.setOlPrice(cartItemBean.getOlPrice());// Gia gia ban dau
                orderItem.setPrice(cartItemBean.getPrice());// Gia da giam
                orderItemService.saveOrderItem(orderItem);
                // productService.updateProductQuantity(cartItemBean.getProductId(),
                // cartItemBean.getQuantity());
                cartItemService.deleteCartItem(authorizationHeader, cartItemBean.getProductId());
            }
        }
        return orderIdIntegers;
    }

    public List<Map<String, Object>> list(String authorizationHeader, PaymentBean paymentBeans) {
        Map<Integer, Map<String, Object>> shopMap = new LinkedHashMap<>();
        User user = userService.getUserToken(authorizationHeader);
        for (Integer productId : paymentBeans.getProductIntegers()) {

            Shop shop = productService.getProductById(productId).getShop();
            Integer quantity = paymentBeans.getProductQuantity() > 0 ? paymentBeans.getProductQuantity()
                    : cartItemService.findProductByUser(productId, user.getId()).getQuantity();
            ;
            Integer shopId = shop.getId();
            String shopName = shop.getName();

            Map<String, Object> productMap = (Map<String, Object>) proItemMapper
                    .toDTO(productService.getProductById(productId));
            if (productMap != null) {
                productMap.put("productQuantity", quantity);
                productMap.put("authors",
                        productAuthorService.getAuthorsByProductId(productService.getProductById(productId).getId()));
                productMap.put("genres",
                        productGenreService.getGenresByProductId(productService.getProductById(productId).getId()));
                productMap.put("publisher",
                        publisherService.getPublisherDTO(productService.getProductById(productId).getPublisher()));
                shopMap.computeIfAbsent(shopId, id -> {
                    Map<String, Object> shopInfo = new LinkedHashMap<>();
                    shopInfo.put("shopId", id);
                    shopInfo.put("shopName", shopName);
                    shopInfo.put("vouchers", voucherService.findByShopId(id));
                    List<Map<String, Object>> selectedVouchersForShop = new ArrayList<>();
                    for (Integer voucherId : paymentBeans.getVoucherIntegers()) {
                        Voucher voucher = voucherService.getVoucherById(voucherId);
                        if (voucher != null && voucher.getShop().getId() == shopId) {
                            Map<String, Object> voucherMap = new LinkedHashMap<>();
                            voucherMap.put("id", voucher.getId());
                            voucherMap.put("codeVoucher", voucher.getId());
                            voucherMap.put("createAt", voucher.getId());
                            voucherMap.put("startDate", voucher.getId());
                            voucherMap.put("expireDate", voucher.getId());
                            voucherMap.put("quantity", voucher.getId());
                            voucherMap.put("discountPercentage", voucher.getId());
                            voucherMap.put("minTotalOrder", voucher.getId());
                            voucherMap.put("maxDiscount", voucher.getId());
                            voucherMap.put("active", voucher.getId());
                            voucherMap.put("description", voucher.getId());
                            selectedVouchersForShop.add(voucherMap);
                            break;
                        }

                    }
                    shopInfo.put("voucherSelected", selectedVouchersForShop);
                    shopInfo.put("products", new ArrayList<Map<String, Object>>());
                    return shopInfo;
                });

                List<Map<String, Object>> products = (List<Map<String, Object>>) shopMap.get(shopId).get("products");
                products.add(productMap);
            }
        }

        return new ArrayList<>(shopMap.values());
    }

}