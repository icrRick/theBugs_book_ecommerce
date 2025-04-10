package com.thebugs.back_end.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProItemDTO {
    private int productId;
    private String productName;
    private double productPrice;
    private String productImage;
    private double promotionValue;
    private double weight;
    private double rate;
}
