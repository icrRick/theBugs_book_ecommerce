package com.thebugs.back_end.services.user;

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.management.RuntimeErrorException;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.thebugs.back_end.dto.GetAllListGenresDTO;
import com.thebugs.back_end.dto.SearchProductDTO;
import com.thebugs.back_end.repository.GenreJPA;
import com.thebugs.back_end.repository.ProductJPA;
import com.thebugs.back_end.utils.MultipartInputStreamFileResource;

@Service
public class SearchProductService {

    @Autowired
    private ProductJPA productJPA;
    @Autowired
    private GenreJPA genreJPA;

    private static final String FPT_API_URL = "https://api.fpt.ai/hmi/asr/general";
    private static final String FPT_API_KEY = "1tCDKbnBNyD7OqsvVGqR0RmYk1TtiV3e";

    private String createCharacterPattern(String keyword) {
        String cleaned = keyword.replaceAll("\\s+", "");
        return Arrays.stream(cleaned.split(""))
                .map(ch -> "%" + ch)
                .collect(Collectors.joining("")) + "%";
    }

    public Map<String, Object> searchProduct(String keyword, List<Integer> genresID,
            Double minPrice, Double maxPrice,
            String sortBy, int page) {

        validationSearchByPrice(minPrice, maxPrice);

        if (keyword != null && !keyword.isBlank()) {
            keyword = createCharacterPattern(keyword);
        }

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

    public String transcribeVoice(MultipartFile file) {
        try {
            InputStream inputStream = file.getInputStream();
            InputStreamResource resource = new MultipartInputStreamFileResource(inputStream,
                    file.getOriginalFilename());

            HttpHeaders headers = new HttpHeaders();
            headers.set("api-key", FPT_API_KEY);
            headers.set("language", "vi");
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", resource);

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<Map> response = restTemplate.postForEntity(FPT_API_URL, requestEntity, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> result = response.getBody();
                if (result.containsKey("hypotheses")) {
                    System.out.println(
                            "Gửi ==========================================================================================");
                    List<Map<String, String>> hypotheses = (List<Map<String, String>>) result.get("hypotheses");
                    return hypotheses.get(0).get("utterance");

                }
            }
            throw new RuntimeException("Không thể nhận diện giọng nói từ FPT.AI.");
        } catch (Exception e) {
            throw new IllegalArgumentException("Đã xãy ra lỗi: " + e.getMessage());
        }

    }

}
