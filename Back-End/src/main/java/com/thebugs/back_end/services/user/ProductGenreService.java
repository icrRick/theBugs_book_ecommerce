package com.thebugs.back_end.services.user;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.dto.GenreDTO;
import com.thebugs.back_end.entities.ProductGenre;
import com.thebugs.back_end.mappers.ProductGenreMapper;
import com.thebugs.back_end.repository.ProductGenreJPA;

@Service
public class ProductGenreService {
    @Autowired
    private ProductGenreJPA productGenreJPA;

    @Autowired
    private ProductGenreMapper productGenreMapper;


    public List<GenreDTO> getGenresByProductId(Integer productId) {
        List<ProductGenre> productGenres = productGenreJPA.findByProductId(productId);
        return productGenreMapper.toDTO(productGenres);
    }
}
