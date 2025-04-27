package com.thebugs.back_end.beans;

import lombok.Data;

@Data
public class CartItemBean {
    private Integer productId;
    private Double olPrice;
    private Double price;
    private Integer quantity;
}
