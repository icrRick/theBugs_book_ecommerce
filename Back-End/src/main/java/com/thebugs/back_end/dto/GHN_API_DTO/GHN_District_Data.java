package com.thebugs.back_end.dto.GHN_API_DTO;

import com.fasterxml.jackson.annotation.JsonProperty;

public class GHN_District_Data {
    @JsonProperty("DistrictID")
    private int DistrictID;

    @JsonProperty("DistrictName")
    private String DistrictName;

}
