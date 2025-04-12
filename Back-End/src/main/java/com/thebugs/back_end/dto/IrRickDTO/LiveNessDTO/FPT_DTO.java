package com.thebugs.back_end.dto.IrRickDTO.LiveNessDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FPT_DTO {
    private String code;     // ← đổi từ int sang String
    private String message;
    private String warning;
}
