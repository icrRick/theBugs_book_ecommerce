package com.thebugs.back_end.mappers;

import java.util.List;

import org.springframework.stereotype.Component;

import com.thebugs.back_end.dto.ProductImageDTO;
import com.thebugs.back_end.entities.Image;

@Component
public class ProductImageMapper {

    public ProductImageDTO toDTO(Image image) {
        if (image == null) {
            return null;
        }
        ProductImageDTO productImageDTO = new ProductImageDTO();
        productImageDTO.setId(image.getId());
        productImageDTO.setImageName(image.getImageName());
        return productImageDTO;
    }

    public List<ProductImageDTO> toDTOs(List<Image> images) {
        if (images == null || images.isEmpty()) {
            return null;
        }
        return images.stream().map(this::toDTO).toList();
    }
}
