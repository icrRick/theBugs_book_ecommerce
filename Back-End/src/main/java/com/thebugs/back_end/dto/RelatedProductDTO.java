package com.thebugs.back_end.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@Data
public class RelatedProductDTO {
    private Integer id;
    private String product_code;
    private String productName;
    private List<String> authorNames; // OK
    private double price;
    private Double discountPrice;
    private Double discountPercentage;
    private Double avgRating;

    public RelatedProductDTO(Integer id, String product_code, String productName,
            double price, Double discountPrice, Double discountPercentage, Double avgRating) {
        this.id = id;
        this.product_code = product_code;
        this.productName = productName;
        this.price = price;
        this.discountPrice = discountPrice;
        this.discountPercentage = discountPercentage;
        this.avgRating = avgRating;
    }

    // Add setter for authorNames if Lombok not used
    public void setAuthorNames(List<String> authorNames) {
        this.authorNames = authorNames;
    }
}