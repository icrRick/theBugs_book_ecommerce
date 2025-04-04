package com.thebugs.back_end.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
@AllArgsConstructor
public class UserOrderDTO {
        private Integer orderId;
        private Integer shopId;
        private Integer orderStatusId;
        private Integer quantity;
        private String shopName;
        private String productName;
        private String productImage;
        private String orderStatus;
        private Double productPrice;
        private Double total;

}
