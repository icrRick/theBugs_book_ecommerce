package com.thebugs.back_end.dto;

import lombok.Data;

@Data
public class ShopInfor_DTO {
  private String name;
  private String email;
  private String phoneNumber;
  private int districtId;
  private int provinceId;
  private int wardId;
  private String addressDetail;
  private String description;
  private String logoUrl;
  private String bannerUrl;
  private String bankOwnerName;
  private String bankOwnerNumber;
  private String bankProvideName;
  private String shopSlug;
}
