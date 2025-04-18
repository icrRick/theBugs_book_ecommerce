package com.thebugs.back_end.dto.GHN_API_DTO;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class GHN_Province_Data {
    @JsonProperty("ProvinceID")
    private int provinceID;

    @JsonProperty("ProvinceName")
    private String provinceName;

}
