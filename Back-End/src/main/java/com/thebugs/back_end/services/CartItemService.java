package com.thebugs.back_end.services;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.dto.ProItemDTO;
import com.thebugs.back_end.entities.CartItem;
import com.thebugs.back_end.entities.User;
import com.thebugs.back_end.repository.CartItemJPA;

@Service
public class CartItemService {
    

    @Autowired
    private CartItemJPA cartItemJPA;
    @Autowired
    private UserService userService;

    @Autowired 
    private VoucherService voucherService;

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductAuthorService productAuthorService;

    @Autowired
    private ProductGenreService productGenreService;

    @Autowired
    private PublisherService publisherService;

    @SuppressWarnings("unchecked")
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
                productMap.put("productPrice", proItemDTO.getProductPrice() != null ? proItemDTO.getProductPrice() : 0.0);
                productMap.put("productImage", proItemDTO.getProductImage() != null ? proItemDTO.getProductImage() : "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80");
                productMap.put("productWeight", proItemDTO.getWeight() != null ? proItemDTO.getWeight() : 0.0);
                productMap.put("productRate", proItemDTO.getRate() != null ? proItemDTO.getRate() : 0.0);
                productMap.put("productPromotionValue", proItemDTO.getPromotionValue() != null ? proItemDTO.getPromotionValue() : 0.0);
                
                productMap.put("productQuantity", cartItem.getQuantity());

                productMap.put("authors", productAuthorService.getAuthorsByProductId(cartItem.getProduct().getId()));
                productMap.put("genres", productGenreService.getGenresByProductId(cartItem.getProduct().getId()));
                productMap.put("publisher", publisherService.getPublisherDTO(cartItem.getProduct().getPublisher()));
                
                shopMap.computeIfAbsent(shopId, id -> {
                    Map<String, Object> shopInfo = new LinkedHashMap<>();
                    shopInfo.put("shopId", id);
                    shopInfo.put("shopName", shopName);
                    shopInfo.put("vouchers", voucherService.findByShopId(id));
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
        for (CartItem cartItem : user.getCartItems()) {
            if (cartItem.getProduct().getId()==productId) {
                cartItem.setQuantity(quantity);
                cartItemJPA.save(cartItem);
                return true;
            }
        }
        CartItem cartItem = new CartItem();
        cartItem.setProduct(productService.getProductById(productId));
        cartItem.setQuantity(quantity);
        cartItem.setUser(user);
        user.getCartItems().add(cartItem);
        cartItemJPA.save(cartItem);
        return true;
    }
    public boolean deleteCartItem(String authorizationHeader, Integer productId) {
        User user = userService.getUserToken(authorizationHeader);
        for (CartItem cartItem : user.getCartItems()) {
            if (cartItem.getProduct().getId()==productId) {
                cartItemJPA.delete(cartItem);
                return true;
            }
        }
        return false;
    }
}
