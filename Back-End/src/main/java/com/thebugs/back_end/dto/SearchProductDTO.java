package com.thebugs.back_end.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class SearchProductDTO {
    private int productId;
    private String nameProduct;
    private String categoryProduct;
    private String imgProduct;
    private double promotionValueProduct;
    private double pricePromotionProduct;
    private double priceProduct;
    private double ratingProduct;
    private int soldProduct;
    private String shopName;

}
