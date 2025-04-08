package com.thebugs.back_end.mappers;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.thebugs.back_end.dto.ProItemDTO;
import com.thebugs.back_end.entities.Favorite;
import com.thebugs.back_end.services.ProductService;

@Component
public class FavoriteMapper {

    @Autowired
    private ProductService productService;
    
    public List<ProItemDTO> toDtos(List<Favorite> favorites) {
        if (favorites == null) {
            return null;
        }

        List<ProItemDTO> proItemDTOs = new ArrayList<>();
        for (Favorite favorite : favorites) {
            ProItemDTO proItemDTO = new ProItemDTO();
            proItemDTO = productService.getProItemDTO(favorite.getProduct().getId());
            proItemDTOs.add(proItemDTO);
        }
        return proItemDTOs;
    }
}
