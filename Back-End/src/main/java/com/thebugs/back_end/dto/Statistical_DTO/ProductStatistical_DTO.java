package com.thebugs.back_end.dto.Statistical_DTO;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductStatistical_DTO {
  private int allProduct;
  private int soldProduct;
  private Child_Product_DTO mostSoldProduct;
  private Child_Product_DTO leastSoldProduct;
  
  private List<Child_Chart_DTO> chart_GenresProduct;
  private List<Child_Chart_DTO> chart_WareHouseProduct;
  private List<Child_Table_DTO> table_ProductStatistical;
}
