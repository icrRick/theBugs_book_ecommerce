package com.thebugs.back_end.mappers;

import org.springframework.stereotype.Component;

import com.thebugs.back_end.dto.SearchProductDTO;
import com.thebugs.back_end.entities.Product;

@Component
public class SearchProdcutMapper {
    public SearchProductDTO toDTO(Product product) {
        if (product == null) {
            return null;
        }
        SearchProductDTO searchProductDTO = new SearchProductDTO();
        searchProductDTO.setProductId(product.getId());
        searchProductDTO.setNameProduct(product.getName());
        searchProductDTO.setPriceProduct(product.getPrice());
        searchProductDTO.setImgProduct(product.getImages().get(0).getImageName());
        searchProductDTO
                .setPromotionValueProduct(product.getPromotionProducts().get(0).getPromotion().getPromotionValue());
        searchProductDTO.setPricePromotionProduct(product.getWeight());
        // mai làm tiếp -> có thể chuyển sang hashmap
        // searchProductDTO.setRatingProduct(product.getRatingProduct());
        return searchProductDTO;
    }
}
