package com.thebugs.back_end.beans;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentBean {
    private List<Integer> productIntegers ;
    private List<Integer> voucherIntegers =new ArrayList<>();
}
