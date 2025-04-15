package com.thebugs.back_end.services.super_admin;

import java.util.ArrayList;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.thebugs.back_end.dto.AdminProductDTO;
import com.thebugs.back_end.dto.GenreDTO;
import com.thebugs.back_end.entities.Genre;
import com.thebugs.back_end.entities.Product;
import com.thebugs.back_end.mappers.AdminProductMapper;
import com.thebugs.back_end.repository.ProductJPA;
import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.utils.ResponseEntityUtil;

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
