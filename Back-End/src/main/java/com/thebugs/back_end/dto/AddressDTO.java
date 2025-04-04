package com.thebugs.back_end.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AddressDTO {
        private Integer id;
        private String fullName;
        private String phone;
        private int provinceId;
        private int districtId;
        private String wardId;
        private String street;
        private String isShop;
}
