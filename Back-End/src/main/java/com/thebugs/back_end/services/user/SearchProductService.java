package com.thebugs.back_end.services.user;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.dto.GetAllListGenresDTO;
import com.thebugs.back_end.dto.SearchProductDTO;
import com.thebugs.back_end.repository.GenreJPA;
import com.thebugs.back_end.repository.ProductJPA;

@Service
public class SearchProductService {

    @Autowired
    private ProductJPA productJPA;
    @Autowired
    private GenreJPA genreJPA;

    // Hàm search trả về sản phẩm + tổng số lượng
    public Map<String, Object> searchProduct(String keyword, List<Integer> genresID,
            Double minPrice, Double maxPrice,
            String sortBy, int page) {
        validationSearchByPrice(minPrice, maxPrice);

        Pageable pageable = PageRequest.of(page - 1, 16);
        Page<SearchProductDTO> result = productJPA.searchProducts(keyword, minPrice, maxPrice, genresID, sortBy,
                pageable);

        Map<String, Object> map = new HashMap<>();
        map.put("data", result.getContent());
        map.put("totalItem", result.getTotalElements());
        map.put("listGenres", getAllGenres());
        return map;
    }

    public void validationSearchByPrice(Double min, Double max) {
        if ((min != null && min < 0) || (max != null && max < 0)) {
            throw new IllegalArgumentException("Giá không thể là số âm");
        }
        if (min != null && max != null && min > max) {
            throw new IllegalArgumentException("Giá tối thiểu không thể lớn hơn giá tối đa.");
        }
    }

    public List<GetAllListGenresDTO> getAllGenres() {
        return genreJPA.findAll().stream()
                .map(genre -> new GetAllListGenresDTO(
                        genre.getId(),
                        genre.getName(),
                        genre.getProductGenres().stream()
                                .map(pg -> pg.getProduct().getId())
                                .collect(Collectors.toList())))
                .collect(Collectors.toList());
    }

}
