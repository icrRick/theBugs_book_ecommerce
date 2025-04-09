package com.thebugs.back_end.dto;

import java.util.Date;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class OrderDetailSellerDTO {
    private Integer id;
    private String customerInfo;
    private Date createdAt;
    private String orderStatusName;
    private String paymentMethod;
    private String paymentStatus;
    private Double provisionalTotal;
    private String address;
    private Double shippingFee;
    private Double totalDiscount;
    private String totalPrice;
    private String phone;
    private String shippingMethod;
    private List<ProductOrderDTO> products;

    // Constructor khớp với truy vấn JPQL
    public OrderDetailSellerDTO(Integer id, String customerInfo, Date createdAt, String orderStatusName,
            String paymentMethod, String paymentStatus, Double provisionalTotal,
            String customerInfoForAddress, Double shippingFee, String shippingMethod,
            Double totalDiscount) {
        this.id = id;
        this.customerInfo = customerInfo;
        this.createdAt = createdAt;
        this.orderStatusName = orderStatusName;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus;
        this.provisionalTotal = provisionalTotal;
        this.address = customerInfoForAddress; // customerInfo được truyền lần thứ hai để gán cho address
        this.shippingFee = shippingFee;
        this.shippingMethod = shippingMethod;
        this.totalDiscount = totalDiscount;
    }
}
