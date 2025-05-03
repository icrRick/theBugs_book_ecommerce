package com.thebugs.back_end.dto.Statistical_DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Child_Table_DTO {
    private String productName;
    private String productCode;
    private String genre;
    private Long soldProduct;
    private Integer wareHouseProduct;
    private Double revenue;
}