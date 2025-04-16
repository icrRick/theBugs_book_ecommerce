package com.thebugs.back_end.dto.GHN_API_DTO;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class GHN_Ward_DTO extends GHN_BaseResponse {
    private List<GHN_Ward_Data> data;
}
