package com.thebugs.back_end.mappers;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.thebugs.back_end.dto.AuthorDTO;
import com.thebugs.back_end.entities.ProductAuthor;
@Component
public class ProductAuthorMapper {
    
    public List<AuthorDTO> toDTO(List<ProductAuthor> productAuthors) {
        if (productAuthors == null || productAuthors.isEmpty()) {
            return null;
        }
        List<AuthorDTO> authorDTOs = new ArrayList<>();
        for (ProductAuthor productAuthor : productAuthors) {
            AuthorDTO dto = new AuthorDTO();
            if (productAuthor.getAuthor() != null) {
                dto.setId(productAuthor.getAuthor().getId());
                dto.setName(productAuthor.getAuthor().getName());
                authorDTOs.add(dto);
            }
        }
        return authorDTOs;
    }
}
