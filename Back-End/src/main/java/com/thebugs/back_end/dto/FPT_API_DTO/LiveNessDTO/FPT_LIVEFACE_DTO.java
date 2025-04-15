package com.thebugs.back_end.dto.FPT_API_DTO.LiveNessDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FPT_LIVEFACE_DTO extends FPT_DTO {
    private FPT_LIVENESS_DTO liveness;
    private FPT_FACEMATCH_DTO face_match;
}
