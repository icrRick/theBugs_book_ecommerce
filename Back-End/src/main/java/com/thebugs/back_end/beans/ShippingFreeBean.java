package com.thebugs.back_end.beans;

import lombok.Data;

@Data
public class ShippingFreeBean {
    private Integer shopId;
    private Integer addressUserId;
    private Float weight;

}
