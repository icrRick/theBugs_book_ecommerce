package com.thebugs.back_end.beans;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ChangePasswordBean {
        private Integer id;
        @NotBlank(message = "Vui lòng nhập mật khẩu cũ")
        private String pwOld;
        @NotBlank(message = "Vui lòng nhập mật khẩu mới")
        private String pwNew;
        @NotBlank(message = "Vui lòng xác nhận lại mật khẩu")
        private String cfPwNew;
}