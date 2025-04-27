package com.thebugs.back_end.dto;

import java.util.List;

import com.thebugs.back_end.entities.Genre;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class SearchProductDTO {
    private Integer productId;
    private String productName;
    private Double price;
    private String imageName;
    private Double rate;
    private Long sold;
    private Double promotionValue;
    private Double discountPrice;
    private String productCode;
    private Integer shopId;
    private String shopName;

}
