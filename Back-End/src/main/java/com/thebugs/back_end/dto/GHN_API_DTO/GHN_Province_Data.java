package com.thebugs.back_end.dto.GHN_API_DTO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
@JsonIgnoreProperties({
        "RegionCPN", "AreaID", "UpdatedEmployee", "UpdatedSource", "UpdatedDate", "CountryID", "Code", "NameExtension",
        "IsEnable",
        "RegionID",
        "UpdatedBy",
        "CreatedAt",
        "UpdatedAt",
        "CanUpdateCOD",
        "Status"
})
public class GHN_Province_Data {
    @JsonProperty("ProvinceID")
    private int provinceID;

    @JsonProperty("ProvinceName")
    private String provinceName;

}
