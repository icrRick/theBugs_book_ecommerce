package com.thebugs.back_end.mappers;

import com.thebugs.back_end.utils.Format;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.thebugs.back_end.entities.Product;
import com.thebugs.back_end.entities.PromotionProduct;
import com.thebugs.back_end.repository.OrderItemJPA;
import com.thebugs.back_end.repository.ReviewJPA;
import com.thebugs.back_end.utils.ReplaceName;

@Component
public class ProItemMapper {

    @Autowired
    private ReviewJPA reviewJPA;

    @Autowired
    private OrderItemJPA orderItemJPA;

    public Object toDTO(Product product) {
        if (product == null) {
            return null;
        }

        Map<String, Object> map = new HashMap<>();
        map.put("id", product.getId());
        map.put("status", product.getStatus());
        map.put("active", product.isActive());
        map.put("name", product.getName());
        map.put("price", product.getPrice());
        map.put("quantity", product.getQuantity());
        map.put("weight", product.getWeight());
        map.put("productCode", product.getProduct_code());
        if (product.getImages() ==null || product.getImages().isEmpty()) {
            map.put("image",ReplaceName.generatePlaceholderUrl(product.getName()));
        }else{
            map.put("image", product.getImages().getLast().getImageName()!= null ?  product.getImages().getLast().getImageName() : ReplaceName.generatePlaceholderUrl(product.getName()));

        }

        map.put("shopSlug", product.getShop().getShop_slug());
        map.put("shopName", product.getShop().getName());

        
        map.put("rate", reviewJPA.getAverageRateByProductId(product.getId()));
        map.put("reviewCount", reviewJPA.countReviewByProductId(product.getId()));
        map.put("purchased", orderItemJPA.countPurchasedByProductId(product.getId()));
        map.put("approve", product.getApprove());
      
        if (product.getPromotionProducts() != null && !product.getPromotionProducts().isEmpty()) {
            Date today = Format.formatDateS(new Date()); // Current date;
            System.out.println("Current date: " + today);
            PromotionProduct validPromotion = product.getPromotionProducts().stream()
                    .filter(promotion -> {
                        boolean checkactive=promotion.getPromotion().isActive();
                        Date startDate = promotion.getPromotion().getStartDate();
                        Date endDate = promotion.getPromotion().getExpireDate();
                        return (startDate == null || !today.before(startDate))
                                && (endDate == null || !today.after(endDate)) && checkactive;
                    })
                    .max(Comparator.comparingDouble(promotion -> promotion.getPromotion().getPromotionValue()))
                    .orElse(null);

            if (validPromotion != null) {
                map.put("promotionValue", validPromotion.getPromotion().getPromotionValue());
            } else {
                map.put("promotionValue", 0);
            }
        }

        return map;
    }

}
