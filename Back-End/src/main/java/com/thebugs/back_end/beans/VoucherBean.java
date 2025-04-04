package com.thebugs.back_end.beans;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class VoucherBean {
    private Integer id;
    private String codeVoucher;
    private Date startDate;
    private Date expireDate;
    private Double discountPercentage;
    private Double minTotalOrder;
    private Double maxDiscount;
    private Boolean active;
    private Integer quantity;
    private String description;
}
