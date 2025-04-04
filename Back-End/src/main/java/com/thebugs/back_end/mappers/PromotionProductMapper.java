package com.thebugs.back_end.mappers;

import org.springframework.stereotype.Component;

import com.thebugs.back_end.dto.PromotionProductDTO;
import com.thebugs.back_end.entities.Product;

@Component
public class PromotionProductMapper {
    
    public PromotionProductDTO promotionProductDTO(Product product){
        if (product == null) {
            return null;
        }
        PromotionProductDTO promotionProductDTO=new PromotionProductDTO();
        promotionProductDTO.setId(product.getId());
        promotionProductDTO.setName(product.getName());
        promotionProductDTO.setPrice(product.getPrice());
        return promotionProductDTO;
    }

}
