package com.thebugs.back_end.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ShopDetailDTO {
        private Integer shopId;
        private String image;
        private String shopName;
        private boolean verify;
}
