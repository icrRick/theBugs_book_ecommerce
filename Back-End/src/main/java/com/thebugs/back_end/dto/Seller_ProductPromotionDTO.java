package com.thebugs.back_end.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Seller_ProductPromotionDTO {
  private int productId;
  private String productName;
  private double productPrice;
  private double promotionValue;
  private Date promotionStartDate;
  private Date promotionEndDate;
}
