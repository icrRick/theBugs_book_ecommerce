package com.thebugs.back_end.services.user;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.dto.AuthorDTO;
import com.thebugs.back_end.dto.ProductAuthorDTO;
import com.thebugs.back_end.entities.Author;
import com.thebugs.back_end.entities.Product;
import com.thebugs.back_end.entities.ProductAuthor;
import com.thebugs.back_end.entities.Review;
import com.thebugs.back_end.mappers.AuthorMapper;
import com.thebugs.back_end.repository.AuthorJPA;
import com.thebugs.back_end.repository.ProductAuthorJPA;

@Service
public class AuthorDetailService {

    @Autowired
    private AuthorJPA authorJPA;
    @Autowired
    private AuthorMapper authorMapper;
    @Autowired
    private ProductAuthorJPA productAuthorJPA;

    public List<AuthorDTO> getAllAuthor(Pageable pageable) {
        Page<Author> listAuthor = authorJPA.findAll(pageable);
        return listAuthor.map(authorMapper::toDTO).toList();
    }

    public Author getById(Integer id) {
        if (id == null) {
            throw new IllegalArgumentException("Id không thể để trống");
        }
        return authorJPA.findById(id).orElseThrow(() -> new IllegalArgumentException("Không tìm thấy" + id));
    }

    public Map<String, Object> getAuthorDetail(Integer id) {
        AuthorDTO authorDTO = authorMapper.toDTO(getById(id));

        List<ProductAuthorDTO> products = productAuthorJPA.findByAuthorId(id).stream()
                .map(link -> {
                    Product p = link.getProduct();

                    
                    int totalReview = p.getReportProducts() != null ? p.getReportProducts().size() : 0;

                    
                    String category = (p.getProductGenres() != null && !p.getProductGenres().isEmpty())
                            ? p.getProductGenres().get(0).getGenre().getName()
                            : "Không xác định";

                   
                    String genres = (p.getProductGenres() != null && !p.getProductGenres().isEmpty())
                            ? p.getProductGenres().stream()
                                    .map(pg -> pg.getGenre().getName())
                                    .distinct()
                                    .collect(Collectors.joining(", "))
                            : "Không xác định";

                   
                    String publisher = (p.getPublisher() != null)
                            ? p.getPublisher().getName()
                            : "Chưa rõ";

                    return new ProductAuthorDTO(
                            p.getId(),
                            p.getName(),
                            p.getFirstImageName(),
                            p.getProduct_code(),
                            p.getPrice(),
                            totalReview,
                            category,
                            genres,
                            publisher);
                })
                .toList();

        Map<String, Object> result = new HashMap<>();
        result.put("author", authorDTO);
        result.put("products", products);
        return result;
    }

}
