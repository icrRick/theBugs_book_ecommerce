package com.thebugs.back_end.beans;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterBean {
        @NotBlank(message = "Tên không được bỏ trống")
        private String fullName;
        @NotBlank(message = "Email không được bỏ trống")
        private String email;
        @NotBlank(message = "Mật khẩu không được bỏ trống")
        private String password;
        @NotBlank(message = "Không được bỏ trống xác nhận mật khẩu")
        private String confirmPassword;
}
