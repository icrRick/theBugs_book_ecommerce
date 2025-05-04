package com.thebugs.back_end.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductOrderDTO {
    private Integer orderItemId;
    private Integer productId;
    private String productName;
    private String productAuthor;
    private String productGenres;
    private String productPublisher;
    private String productImage;
    private Double oldPriceProduct;
    private Double priceProduct;
    private Integer quantityProduct;
    private Double totalPriceProduct;
    private Integer shopId;
    private String shopName;
    private boolean isReviewed;
}
