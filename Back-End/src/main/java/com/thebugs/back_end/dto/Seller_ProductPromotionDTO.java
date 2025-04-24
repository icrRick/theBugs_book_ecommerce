package com.thebugs.back_end.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Seller_ProductPromotionDTO {
  private int id;
  private String name;
  private Double price;
  private CurrentPromotionDTO currentPromotionDTO;
  public Seller_ProductPromotionDTO(int id, String name, Double price, Double promotionValue, Date promotionStartDate, Date promotionEndDate, Boolean isPromotionActive) {
    this.currentPromotionDTO = new CurrentPromotionDTO(promotionValue, promotionStartDate, promotionEndDate, isPromotionActive);
    this.id = id;
    this.name = name;
    this.price = price;
  }
}
