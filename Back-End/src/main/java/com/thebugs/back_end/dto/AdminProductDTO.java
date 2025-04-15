package com.thebugs.back_end.dto;

import lombok.Data;

@Data
public class AdminProductDTO {

    private Integer productId;
    private String productName;
    private double productWeight;
    private int productQuantity;
    private double productPrice;
    private String productCode;
    private String shopName;
    private Boolean status;
    private boolean approve;
    private boolean active;
    
}
