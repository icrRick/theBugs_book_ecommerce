package com.thebugs.back_end.dto.GHN_API_DTO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties({
    "ProvinceID", "Code", "Type", "SupportType", "NameExtension", "IsEnable", "CanUpdateCOD", "Status",
    "CreatedDate", "UpdatedDate", "PickType", "DeliverType", "WhiteListClient", "WhiteListDistrict", "ReasonCode",
    "ReasonMessage", "OnDates", "CreatedIP", "CreatedEmployee", "CreatedSource", "UpdatedEmployee", "UpdatedSource",
    "UpdatedBy", "CreatedAt", "UpdatedAt",
    "Status", "DistrictEncode", "DistrictID", "WhiteListWard", 
})
public class GHN_Ward_Data {
    @JsonProperty("WardCode")
    private int WardCode;
    @JsonProperty("WardName")
    private String WardName;
}
