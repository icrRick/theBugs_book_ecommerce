package com.thebugs.back_end.beans;

import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class PromotionBean {
  private Date startDate;
  private Date expireDate;
  private double promotionValue;
  private List<PromotionProductBean> products;

}
