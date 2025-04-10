package com.thebugs.back_end.beans;

import java.util.List;

import lombok.Data;
@Data
public class PaymentOnlineBean {
    private List<Integer> orderIdIntegers;
    private String vnp_ResponseCode;
}
