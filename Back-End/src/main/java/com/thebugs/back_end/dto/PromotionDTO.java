package com.thebugs.back_end.dto;

import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class PromotionDTO {
        private Integer id;
        private Double promotionValue;
        private Date createdAt;
        private Date startDate;
        private Date expireDate;
        private String status;
        private Boolean active;
        private List<Seller_ProductPromotionDTO> promotionProductDTO;
}