package com.thebugs.back_end.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class OrderDTO {
    private Integer id;
    private String customerInfo;
    private String noted;
    private String address;
    private String paymentMethod;
    private String paymentStatus;
    private String description;
    private Double shippingFee;
    private Date createdAt;

}
