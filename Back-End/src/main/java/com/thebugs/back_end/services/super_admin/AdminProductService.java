package com.thebugs.back_end.services.super_admin;

import java.util.ArrayList;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.stereotype.Service;
import com.thebugs.back_end.dto.AdminProductDTO;
import com.thebugs.back_end.entities.Product;
import com.thebugs.back_end.mappers.AdminProductMapper;
import com.thebugs.back_end.repository.ProductJPA;

@Service
public class AdminProductService {

    @Autowired
    private ProductJPA productJPA;

    @Autowired
    private AdminProductMapper adminProductMapper;

    public ArrayList<AdminProductDTO> getProductByKeywordWithPagination(String keyword, Pageable pageable) {
        Page<Product> page;
        if (keyword == null || keyword.isEmpty()) {
            page = productJPA.findAll(pageable);
        } else {
            page = productJPA.findByName(keyword, pageable);
        }
        return page.stream()
                .map(adminProductMapper::toDTO)
                .collect(Collectors.toCollection(ArrayList::new));

    }

    public int totalItems(String keyword) {
        return productJPA.countfindByName(keyword);
}

}
