package com.thebugs.back_end.dto.IrRickDTO.LiveNessDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FPT_FACEMATCH_DTO extends FPT_DTO {
    private String isMatch; // Đổi thành String
    private String similarity; // Đổi thành String
}
