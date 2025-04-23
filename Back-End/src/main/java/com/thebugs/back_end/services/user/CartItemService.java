package com.thebugs.back_end.services.user;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.dto.ProItemDTO;
import com.thebugs.back_end.entities.CartItem;
import com.thebugs.back_end.entities.Product;
import com.thebugs.back_end.entities.User;
import com.thebugs.back_end.repository.CartItemJPA;
import com.thebugs.back_end.services.seller.VoucherService;
import com.thebugs.back_end.services.super_admin.PublisherService;

@Service
public class CartItemService {

    @Autowired
    private CartItemJPA cartItemJPA;

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

    public List<Map<String, Object>> getCartItems(String authorizationHeader) {
        User user = userService.getUserToken(authorizationHeader);
        Map<Integer, Map<String, Object>> shopMap = new LinkedHashMap<>();

        for (CartItem cartItem : user.getCartItems()) {
            Integer shopId = cartItem.getProduct().getShop().getId();
            String shopName = cartItem.getProduct().getShop().getName();
            ProItemDTO proItemDTO = productService.getProItemDTO(cartItem.getProduct().getId());
            if (proItemDTO != null) {
                Map<String, Object> productMap = new LinkedHashMap<>();
                productMap.put("productId", proItemDTO.getProductId());
                productMap.put("productName", proItemDTO.getProductName());
                productMap.put("productPrice", proItemDTO.getProductPrice());
                productMap.put("productImage", proItemDTO.getProductImage());
                productMap.put("productWeight", proItemDTO.getWeight());
                productMap.put("productRate", proItemDTO.getRate());
                productMap.put("productPromotionValue", proItemDTO.getPromotionValue());
                productMap.put("productQuantity", cartItem.getQuantity());
                productMap.put("authors", productAuthorService.getAuthorsByProductId(cartItem.getProduct().getId()));
                productMap.put("genres", productGenreService.getGenresByProductId(cartItem.getProduct().getId()));
                productMap.put("publisher", publisherService.getPublisherDTO(cartItem.getProduct().getPublisher()));

                shopMap.computeIfAbsent(shopId, id -> {
                    Map<String, Object> shopInfo = new LinkedHashMap<>();
                    shopInfo.put("shopId", id);
                    shopInfo.put("shopName", shopName);
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
        if (quantity > productService.getProductById(productId).getQuantity()) {
            throw new IllegalArgumentException("Số lượng vượt quá số lượng còn lại");
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
        User user = userService.getUserToken(authorizationHeader);
        Product product=productService.getProductByProductCode(productCode);
        if (quantity > product.getQuantity()) {
            throw new IllegalArgumentException("Số lượng vượt quá số lượng còn lại");
        }
        CartItem cartItem = findProductCodeByUser(productCode, user.getId());
        if (cartItem != null) {
            cartItem.setQuantity(quantity);
            cartItemJPA.save(cartItem);
            return true;
        } else {
            CartItem cartItemAdd = new CartItem();
            cartItemAdd.setProduct(product);
            cartItemAdd.setQuantity(product.getQuantity()+quantity);
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
}
