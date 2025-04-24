package com.thebugs.back_end.beans;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class Seller_ReviewBean {
    private int id;
    @NotBlank(message = "Không được bỏ trống phần phản hồi")
    @Max(value = 100, message = "Phản hồi vượt quá số ký tự cho phép")
    private String reply;
}
