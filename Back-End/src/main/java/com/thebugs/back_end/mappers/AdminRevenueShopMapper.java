package com.thebugs.back_end.mappers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Component;

import com.thebugs.back_end.entities.Order;
import com.thebugs.back_end.entities.OrderItem;


@Component
public class AdminRevenueShopMapper {

    public Object toDTO(List<Order> orders) {
        if (orders == null || orders.isEmpty()) {
            return null;
        }
    
        Set<Integer> processedShopIds = new HashSet<>();
        Map<Integer, Map<String, Object>> revenueMap = new HashMap<>();
    
        for (Order order : orders) {
            Integer shopId = order.getShop().getId();
            if (!processedShopIds.contains(shopId)) {
                processedShopIds.add(shopId);
                Map<String, Object> shopRevenue = new HashMap<>();
                shopRevenue.put("shopId", shopId);
                shopRevenue.put("shopName", order.getShop().getName());
                shopRevenue.put("totalOlpriceRevenue", 0.0);
                shopRevenue.put("totalPriceRevenue", 0.0);
                shopRevenue.put("feePlatform", 0.0);
                revenueMap.put(shopId, shopRevenue);
            }
    
            Map<String, Object> shopRevenue = revenueMap.get(shopId);
    
            double totalOlpriceRevenue = (double) shopRevenue.get("totalOlpriceRevenue");
            double totalPriceRevenue = (double) shopRevenue.get("totalPriceRevenue");
            double feePlatform = (double) shopRevenue.get("feePlatform");
    
            double totalShopRevenue = 0.0;
            double totalShopPromoRevenue = 0.0;
            double totalDiscount = 0.0;
    
            for (OrderItem oi : order.getOrderItems()) {
                totalShopRevenue += oi.getQuantity() * oi.getOlPrice();
                totalShopPromoRevenue += oi.getQuantity() * oi.getPrice();
            }
    
            feePlatform += totalShopRevenue * 0.05;
    
            if (order.getVoucher() != null && order.getVoucher().getDiscountPercentage() != null) {
                double discountPercentage = order.getVoucher().getDiscountPercentage();
                double maxDiscount = order.getVoucher().getMaxDiscount();
                double discount = Math.min(totalShopPromoRevenue * discountPercentage / 100, maxDiscount);
                totalDiscount += discount;
            }
    
            double updatedOlpriceRevenue = totalOlpriceRevenue + totalShopRevenue;
            double updatedPriceRevenue = totalPriceRevenue + totalShopPromoRevenue - totalDiscount;
    
            shopRevenue.put("totalOlpriceRevenue", Math.round(updatedOlpriceRevenue * 10.0) / 10.0);
            shopRevenue.put("totalPriceRevenue", Math.round(updatedPriceRevenue * 10.0) / 10.0);
            shopRevenue.put("feePlatform", Math.round(feePlatform * 10.0) / 10.0);
        }
        return new ArrayList<>(revenueMap.values());
    }
    
}
