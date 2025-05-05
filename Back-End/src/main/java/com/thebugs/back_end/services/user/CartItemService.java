package com.thebugs.back_end.services.user;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.dto.ProItemDTO;
import com.thebugs.back_end.entities.CartItem;
import com.thebugs.back_end.entities.Order;
import com.thebugs.back_end.entities.OrderItem;
import com.thebugs.back_end.entities.Product;
import com.thebugs.back_end.entities.PromotionProduct;
import com.thebugs.back_end.entities.User;
import com.thebugs.back_end.mappers.ProItemMapper;
import com.thebugs.back_end.repository.CartItemJPA;
import com.thebugs.back_end.services.seller.VoucherService;
import com.thebugs.back_end.services.super_admin.PublisherService;
import com.thebugs.back_end.utils.Format;

@Service
public class CartItemService {

    @Autowired
    private CartItemJPA cartItemJPA;

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;
    @Autowired
    private ProductService productService;

    @Autowired
    private ProductAuthorService productAuthorService;

    @Autowired
    private ProductGenreService productGenreService;

    @Autowired
    private PublisherService publisherService;

    @Autowired
    private VoucherService voucherService;
    @Autowired
    private ProItemMapper proItemMapper;

    public List<Map<String, Object>> getCartItems(String authorizationHeader) {
        User user = userService.getUserToken(authorizationHeader);
        Map<Integer, Map<String, Object>> shopMap = new LinkedHashMap<>();

        for (CartItem cartItem : user.getCartItems()) {
            Integer shopId = cartItem.getProduct().getShop().getId();
            String shopName = cartItem.getProduct().getShop().getName();
            String shopSlug = cartItem.getProduct().getShop().getShop_slug();
            Map<String, Object> productMap = (Map<String, Object>) proItemMapper.toDTO(cartItem.getProduct());
            if (productMap != null) {
                productMap.put("productQuantity", cartItem.getQuantity());
                productMap.put("authors", productAuthorService.getAuthorsByProductId(cartItem.getProduct().getId()));
                productMap.put("genres", productGenreService.getGenresByProductId(cartItem.getProduct().getId()));
                productMap.put("publisher", publisherService.getPublisherDTO(cartItem.getProduct().getPublisher()));

                shopMap.computeIfAbsent(shopId, id -> {
                    Map<String, Object> shopInfo = new LinkedHashMap<>();
                    shopInfo.put("shopId", id);
                    shopInfo.put("shopName", shopName);
                    shopInfo.put("shopSlug", shopSlug);
                    shopInfo.put("vouchers", voucherService.findByShopIdNotInOrderByUser(id, user.getId()));
                    shopInfo.put("products", new ArrayList<Map<String, Object>>());
                    return shopInfo;
                });

                List<Map<String, Object>> products = (List<Map<String, Object>>) shopMap.get(shopId).get("products");
                products.add(productMap);
            }
        }

        return new ArrayList<>(shopMap.values());
    }

    public boolean saveCartItem(String authorizationHeader, Integer productId, Integer quantity) {
        User user = userService.getUserToken(authorizationHeader);
        Product product = productService.getProductById(productId);
        PromotionProduct promotionValue = null;
        if (user.getShop() !=null) {
            if (user.getShop().getId() == product.getShop().getId()) {
                throw new IllegalArgumentException("Sản phẩm này thuộc shop của bạn không thể thêm vào giỏ hàng");
            }
        }
        if (quantity <= 0) {
            throw new IllegalArgumentException("Số lượng không hợp lệ");
        }
        if (product.getPromotionProducts() != null && !product.getPromotionProducts().isEmpty()) {
            Date today = Format.formatDateS(new Date()); 
            System.out.println("Current date: " + today);
            PromotionProduct validPromotion = product.getPromotionProducts().stream()
                    .filter(promotion -> {
                        Date startDate = promotion.getPromotion().getStartDate();
                        Date endDate = promotion.getPromotion().getExpireDate();
                        return (startDate == null || !today.before(startDate))
                                && (endDate == null || !today.after(endDate));
                    })
                    .max(Comparator.comparingDouble(promotion -> promotion.getPromotion().getPromotionValue()))
                    .orElse(null);

            if (validPromotion != null) {
                promotionValue =validPromotion;
            } else {
                promotionValue = null;
            }
        }
        if (promotionValue != null && promotionValue.getPromotion().getPromotionValue() > 0 && quantity > promotionValue.getQuantity()) {
            throw new IllegalArgumentException("Số lượng không hợp lệ với mã giảm giá");
        }else{
            if (quantity > product.getQuantity()) {
                throw new IllegalArgumentException("Số lượng vượt quá số lượng còn lại");
            }
        }    
        CartItem cartItem = findProductByUser(productId, user.getId());
        if (cartItem != null) {
            cartItem.setQuantity(quantity);
            cartItemJPA.save(cartItem);
            return true;
        } else {
            CartItem cartItemAdd = new CartItem();
            cartItemAdd.setProduct(productService.getProductById(productId));
            cartItemAdd.setQuantity(quantity);
            cartItemAdd.setUser(user);
            cartItemJPA.save(cartItemAdd);
            return true;
        }
    }

    public boolean saveCartItemProductCode(String authorizationHeader, String productCode, Integer quantity) {
        System.out.println("quantity " + quantity);
        User user = userService.getUserToken(authorizationHeader);
        Product product = productService.getProductByProductCode(productCode);
        if (quantity > product.getQuantity()) {
            throw new IllegalArgumentException("Số lượng vượt quá số lượng còn lại");
        }
        if (user.getShop() !=null) {
            if (user.getShop().getId() == product.getShop().getId()) {
                throw new IllegalArgumentException("Sản phẩm này thuộc shop của bạn không thể thêm vào giỏ hàng");
            }
        }
      
        CartItem cartItem = findProductCodeByUser(productCode, user.getId());
        if (cartItem != null) {
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
            cartItemJPA.save(cartItem);
            return true;
        } else {
            CartItem cartItemAdd = new CartItem();
            cartItemAdd.setProduct(product);
            cartItemAdd.setQuantity(quantity);
            cartItemAdd.setUser(user);
            cartItemJPA.save(cartItemAdd);
            return true;
        }
    }

    public boolean deleteCartItem(String authorizationHeader, Integer productId) {
        User user = userService.getUserToken(authorizationHeader);
        CartItem cartItem = findProductByUser(productId, user.getId());
        if (cartItem != null) {
            cartItemJPA.delete(cartItem);
            return true;
        }
        return false;
    }

    public CartItem findProductByUser(Integer productId, Integer userId) {

        return cartItemJPA.findProductByUserId(productId, userId).orElse(null);
    }

    public CartItem findProductCodeByUser(String productCode, Integer userId) {
        Product product = productService.getProductByProductCode1(productCode);
        return cartItemJPA.findProductByUserId(product.getId(), userId).orElse(null);
    }

    public boolean repurchaseCartItem(Integer orderId) {
        Order order = orderService.findById(orderId);
        if (order == null)
            return false;

        for (OrderItem orderItem : order.getOrderItems()) {
            CartItem cartItem = findProductByUser(orderItem.getProduct().getId(), order.getUser().getId());
            if (cartItem != null) {
                cartItem.setQuantity(cartItem.getQuantity() + orderItem.getQuantity());
                cartItemJPA.save(cartItem);
            } else {
                CartItem cartItemAdd = new CartItem();
                cartItemAdd.setProduct(orderItem.getProduct());
                cartItemAdd.setQuantity(orderItem.getQuantity());
                cartItemAdd.setUser(order.getUser());
                cartItemJPA.save(cartItemAdd);
            }
        }

        return true;
    }

}
