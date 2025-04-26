package com.thebugs.back_end.beans;

import lombok.Data;

@Data
public class ShopInfor_Bean {
  private String name;
  private String logoUrl;
  private String bannerUrl;
  private String description;
  private String bankOwnerName;
  private String bankOwnerNumber;
  private String bankProvideName;
  private String addressDetail;
  private Integer wardId;
  private Integer districtId;
  private Integer provinceId;
  private String phoneNumber;
  private String email;
}
