package com.thebugs.back_end.beans;

import java.util.List;

import lombok.Data;

@Data
public class CartBean {
    private Integer shopId;
    private Integer voucherId;
    private Double shippingFee;
    private String paymentMethod;
    private String customerInfo;
    private List<CartItemBean> cartItems;
}
