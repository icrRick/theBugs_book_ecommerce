package com.thebugs.back_end.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProItemDTO {
    private Integer productId;
    private String productName;
    private Double productPrice;
    private String productImage;
    private Double promotionValue;
    private Double weight;
    private Double rate;
}
