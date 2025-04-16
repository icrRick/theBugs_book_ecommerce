package com.thebugs.back_end.dto.GHN_API_DTO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties({
        "ProvinceID", "Code", "Type", "SupportType", "NameExtension", "IsEnable", "CanUpdateCOD", "Status",
        "CreatedDate", "UpdatedDate", "PickType", "DeliverType", "WhiteListClient", "WhiteListDistrict", "ReasonCode",
        "ReasonMessage", "OnDates", "CreatedIP", "CreatedEmployee", "CreatedSource", "UpdatedEmployee", "UpdatedSource",
        "UpdatedBy", "CreatedAt", "UpdatedAt",
        "Status", "DistrictEncode"
})
public class GHN_District_Data {
    @JsonProperty("DistrictID")
    private int DistrictID;

    @JsonProperty("DistrictName")
    private String DistrictName;

}
