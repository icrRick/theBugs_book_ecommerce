package com.thebugs.back_end.beans;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class OrderStatusBean {

    private Integer orderStatus;

    private String cancelReason;

}
