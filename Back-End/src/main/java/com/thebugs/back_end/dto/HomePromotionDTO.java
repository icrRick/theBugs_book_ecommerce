package com.thebugs.back_end.dto;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class HomePromotionDTO {
    private Integer id;
    private Double promotionValue;
    private Date startDate;
    private Date expireDate;
    private String shopName;

}
