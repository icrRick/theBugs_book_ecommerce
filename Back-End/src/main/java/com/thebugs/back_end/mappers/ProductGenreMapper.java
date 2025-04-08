package com.thebugs.back_end.mappers;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.thebugs.back_end.dto.GenreDTO;
import com.thebugs.back_end.entities.ProductGenre;

@Component
public class ProductGenreMapper {
    
    public List<GenreDTO> toDTO(List<ProductGenre> productGenres) {
        if (productGenres == null || productGenres.isEmpty()) {
            return null;
        }
        List<GenreDTO> genreDTOs = new ArrayList<>();
        for (ProductGenre productGenre : productGenres) {
            GenreDTO dto = new GenreDTO();
            if (productGenre.getGenre() != null) {
                dto.setId(productGenre.getGenre().getId());
                dto.setName(productGenre.getGenre().getName());
                genreDTOs.add(dto);
            }
        }
        return genreDTOs;
    }
}
