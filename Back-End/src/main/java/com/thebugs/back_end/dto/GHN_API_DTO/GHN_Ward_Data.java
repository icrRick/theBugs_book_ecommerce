package com.thebugs.back_end.dto.GHN_API_DTO;

import com.fasterxml.jackson.annotation.JsonProperty;

public class GHN_Ward_Data {
    @JsonProperty("WardCode")
    private int WardCode;
    @JsonProperty("WardName")
    private String WardName;
}
