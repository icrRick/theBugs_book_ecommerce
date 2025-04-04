package com.thebugs.back_end.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AdminStatisticalDTO {
        private Integer shopId;
        private String shopName;
        private Double totalRevenue;
        private Double discount = 10.0;
        private Double actualRevenue;
        private Integer totalOrder;
        private Date dateOrdered;
}
