package com.thebugs.back_end.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CurrentPromotionDTO {
  private Double value;
  private Date startDate;
  private Date endDate;
  private Boolean isActive;
}
