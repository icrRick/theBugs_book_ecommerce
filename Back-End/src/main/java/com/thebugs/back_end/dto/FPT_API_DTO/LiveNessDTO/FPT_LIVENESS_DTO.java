package com.thebugs.back_end.dto.FPT_API_DTO.LiveNessDTO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties({
        "spoof_prob", "deepfake_prob"
})
public class FPT_LIVENESS_DTO extends FPT_DTO {
    @JsonProperty("is_live")
    private boolean isLive;
    @JsonProperty("need_to_review")
    private boolean need_to_review;
    private String is_deepfake;
}
