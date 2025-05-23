package com.thebugs.back_end.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class OrderSimpleDTO {
        
        private String shopSlug;
        private String shopName;
        private Integer orderPaymentId;

        private Integer id;
        private String customerInfo;
        private Date orderDate;
        private String orderStatusName;
        private String paymentMethod;
        private String paymentStatus;
        private Double totalPrice;
        private String noted;
}
