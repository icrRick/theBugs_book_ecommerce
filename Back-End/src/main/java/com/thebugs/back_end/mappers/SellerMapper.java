package com.thebugs.back_end.mappers;

import org.springframework.stereotype.Component;

import com.thebugs.back_end.dto.SellerDTO;
import com.thebugs.back_end.entities.Shop;

@Component
public class SellerMapper {
        public SellerDTO toDTO(Shop seller) {
                if (seller == null) {
                        return null;
                }
                SellerDTO sellerDTO = new SellerDTO();
                sellerDTO.setId(seller.getId());
                sellerDTO.setName(seller.getName());

                sellerDTO.setDescription(seller.getDescription());
                sellerDTO.setImage(seller.getImage());
                sellerDTO.setActive(seller.getActive());
                return sellerDTO;
        }
}
