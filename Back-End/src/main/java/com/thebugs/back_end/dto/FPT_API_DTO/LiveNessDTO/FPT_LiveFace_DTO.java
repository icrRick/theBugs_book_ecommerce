package com.thebugs.back_end.dto.FPT_API_DTO.LiveNessDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FPT_LiveFace_DTO extends FPT_BaseResponse {
    private FPT_Liveness_Data liveness;
    private FPT_FaceMatch_Data face_match;
}
