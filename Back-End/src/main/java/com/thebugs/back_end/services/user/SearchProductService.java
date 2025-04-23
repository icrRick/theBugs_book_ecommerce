// package com.thebugs.back_end.services.user;

// import java.util.List;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.data.domain.Page;
// import org.springframework.data.domain.Pageable;
// import org.springframework.stereotype.Service;

// import com.thebugs.back_end.dto.SearchProductDTO;

// import com.thebugs.back_end.repository.ProductJPA;

// @Service
// public class SearchProductService {

// @Autowired
// private ProductJPA productJPA;

// public List<SearchProductDTO> searchProduct(String keyword, String category,
// double ratings, double minPrice,
// double maxPrice, String sortBy, Pageable pageable) {
// Page<SearchProductDTO> products;
// SearchProductDTO searchProductDTO = new SearchProductDTO();
// if (keyword != null && !keyword.isEmpty() || category != null &&
// !category.isEmpty()
// || (ratings > 0 && ratings == searchProductDTO.getRatingProduct()) ||
// (minPrice > 0 || maxPrice > 0)
// || (sortBy != null && !sortBy.isEmpty())) {
// products = productJPA.searchProducts(keyword, category, ratings, minPrice,
// maxPrice, sortBy, pageable);
// } else {
// products = productJPA.searchProducts(keyword, category, ratings, minPrice,
// maxPrice, sortBy, pageable);
// }
// return products.stream().toList();
// }

// }
