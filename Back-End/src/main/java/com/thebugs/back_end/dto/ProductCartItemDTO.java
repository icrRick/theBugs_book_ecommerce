package com.thebugs.back_end.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductCartItemDTO {
        private Integer productId;
        private String productName;
        private Integer cartItemQuantity;
        private Double productPrice;
        private String productImage;
        private Double promotionValue;
        private List<GenreDTO> toGenres;
        private List<AuthorDTO> toAuDtos;
        private List<PublisherDTO> toPublishers;
}
