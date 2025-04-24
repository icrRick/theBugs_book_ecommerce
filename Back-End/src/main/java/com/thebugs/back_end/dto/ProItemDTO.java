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
    private String productCode;
    public ProItemDTO(int productId, String productName, double productPrice, String productImage, double promotionValue, double weight, double rate) {
        this.productId = productId;
        this.productName = productName;
        this.productPrice = productPrice;
        this.productImage = productImage;
        this.promotionValue = promotionValue;
        this.weight = weight;
        this.rate = rate;
    }
}
