package com.thebugs.back_end.dto.IrRickDTO.LiveNessDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FPT_LIVENESS_DTO extends FPT_DTO {
    private String is_live;
    private String need_to_review;
    private String spoof_prob;
    private String is_deepfake;
    private String deepfake_prob;
}
