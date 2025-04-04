package com.thebugs.back_end.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class SellerDTO {
        private Integer id;
        private String name;
        private String address;
        private String description;
        private String image;
        private boolean active;
}
