package com.thebugs.back_end.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Seller_ProductDTO {
        private Integer id;
        private String product_code;
        private String name;
        private Double price;
        private int quantity;
        private Double weight;
        private String description;
        private Boolean active;
        private Boolean approve;
        private Integer shopId;
        private Integer publisher_id;
        private List<ImageDTO> images;
        private List<GenreDTO> genres;
        private List<AuthorDTO> authors;
}
