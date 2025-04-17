package com.thebugs.back_end.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class HomeProductDTO {
        private Integer productId;
        private String productName;
        private Double productPrice;
        private String productImage;
        private Double rate;
        private Double promotionValue;
        private Boolean isNew;
        private Double discount;
        private String authorName;
}
