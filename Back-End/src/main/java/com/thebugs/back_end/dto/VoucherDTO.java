package com.thebugs.back_end.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class VoucherDTO {
    private Integer id;
    private String codeVoucher;
    private Date createAt;
    private Date startDate;
    private Date expireDate;
    private Integer quantity;
    private Double discountPercentage;
    private Double minTotalOrder;
    private Double maxDiscount;
    private Boolean active;
    private String description;
}
