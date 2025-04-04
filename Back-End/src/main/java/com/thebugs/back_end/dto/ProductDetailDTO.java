package com.thebugs.back_end.dto;

import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class ProductDetailDTO {
        private Integer productId;
        private String productName;
        private Double weight;
        private Double rating;
        private Double price;
        private Double promotionValue;
        private Integer reviewCount;
        private Integer soldCount;
        private String description;
        private List<GenreDTO> toGenres;
        private List<AuthorDTO> toAuDtos;
        private List<PublisherDTO> toPublishers;

        public ProductDetailDTO(Integer productId, String productName, Double weight, Double rating, Double price,
                        Double promotionValue,
                        Integer reviewCount, Integer soldCount, String description) {
                this.productId = productId;
                this.productName = productName;
                this.weight = weight;
                this.rating = rating;
                this.price = price;
                this.promotionValue = promotionValue;
                this.reviewCount = reviewCount;
                this.soldCount = soldCount;
                this.description = description;
                this.toGenres = null;
                this.toAuDtos = null;
                this.toPublishers = null;
        }

}
