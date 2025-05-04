package com.thebugs.back_end.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductAuthorDTO {
    private Integer productId;
    private String productName;
    private String productImage;
    private String productCode;
    private double price;
    private Integer totalReview;
    private String productCategory;
    private String productGenres;
    private String productPushiser;


}
