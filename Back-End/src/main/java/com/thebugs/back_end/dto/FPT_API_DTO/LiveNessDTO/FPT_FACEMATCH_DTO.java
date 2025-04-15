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
public class FPT_FACEMATCH_DTO extends FPT_DTO {
    @JsonProperty("isMatch")
    private boolean isMatch;
    @JsonProperty("similarity")
    private float similarity; // Đổi thành String
}
