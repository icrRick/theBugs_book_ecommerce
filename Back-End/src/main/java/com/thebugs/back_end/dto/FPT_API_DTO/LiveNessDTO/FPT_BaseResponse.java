package com.thebugs.back_end.dto.FPT_API_DTO.LiveNessDTO;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FPT_BaseResponse {
    @JsonProperty("code")
    private String code;
    private String message;
    private String warning;
}
