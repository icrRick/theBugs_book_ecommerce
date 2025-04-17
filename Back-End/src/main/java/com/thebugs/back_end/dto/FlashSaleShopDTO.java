package com.thebugs.back_end.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class FlashSaleShopDTO {
    private Integer id;
    private String name;
    private String logo;
    private Integer products;
    private Double maxDiscount;
    private String banner;
}
