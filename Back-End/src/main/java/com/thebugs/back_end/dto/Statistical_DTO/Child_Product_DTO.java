package com.thebugs.back_end.dto.Statistical_DTO;

import lombok.Data;

@Data
public class Child_Product_DTO {
  private String productName;
  private String productImage;
  private int soldQuantity;

  public Child_Product_DTO(String productName, String productImage, long soldQuantity) {
    this.productName = productName;
    this.productImage = productImage;
    this.soldQuantity = (int) soldQuantity;
  }

}
