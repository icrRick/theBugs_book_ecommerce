package com.thebugs.back_end.dto.GHN_API_DTO;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GHN_Province_DTO extends GHN_BaseResponse {
    private List<GHN_Province_Data> data;
}
