package com.thebugs.back_end.services.user;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.dto.AuthorDTO;
import com.thebugs.back_end.entities.ProductAuthor;
import com.thebugs.back_end.mappers.ProductAuthorMapper;
import com.thebugs.back_end.repository.ProductAuthorJPA;

@Service
public class ProductAuthorService {
    
    @Autowired
    private ProductAuthorJPA productAuthorJPA;
    @Autowired
    private ProductAuthorMapper productAuthorMapper;

    public List<AuthorDTO> getAuthorsByProductId(Integer productId) {
        if (productId == null) {
            throw new IllegalArgumentException("Product ID cannot be null");
        }
        List<ProductAuthor> productAuthors = productAuthorJPA.findByProductId(productId);
        return productAuthorMapper.toDTO(productAuthors);
    }
}
