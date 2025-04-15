package com.thebugs.back_end.dto.FPT_API_DTO.LiveNessDTO;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FPT_DTO {
    @JsonProperty("code")
    private int code; // ← đổi từ int sang String
    private String message;
    private String warning;
}
