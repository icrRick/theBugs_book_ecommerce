package com.thebugs.back_end.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Child_ShopReviewDTO {
    private String name;
    private String logo;
    private Boolean verify;
}
