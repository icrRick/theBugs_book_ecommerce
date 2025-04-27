package com.thebugs.back_end.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor 
@NoArgsConstructor
@Data 
public class AdminRevenueShopDTO {

    private Integer shopId;
    private String shopName;

    private Double totalRevenue;
    
    private Double fixedFee;


}
