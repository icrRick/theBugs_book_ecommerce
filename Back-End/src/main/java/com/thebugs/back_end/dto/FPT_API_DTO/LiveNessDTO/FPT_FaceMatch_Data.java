package com.thebugs.back_end.dto.FPT_API_DTO.LiveNessDTO;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FPT_FaceMatch_Data extends FPT_BaseResponse {
    @JsonProperty("isMatch")
    private String isMatch;
    @JsonProperty("similarity")
    private String similarity; // Đổi thành String
}
