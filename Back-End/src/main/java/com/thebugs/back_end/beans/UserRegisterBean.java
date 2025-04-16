package com.thebugs.back_end.beans;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserRegisterBean {
    @NotBlank(message = "Tên không được bỏ trống")
    @Size(max = 100, message = "Tên không được quá 100 ký tự")
    private String fullName;
    
    @NotBlank(message = "Email không được bỏ trống")
    @Size(max = 100, message = "Email không được quá 100 ký tự")
    private String email;

    @NotBlank(message = "Không được bỏ trống số điện thoại")
    @Size(max = 10, message = "Số điện thoại không được quá 10 ký tự")
    private String phone;
    
    @NotBlank(message = "Mật khẩu không được bỏ trống")
    private String password;
    
    @NotBlank(message = "Không được bỏ trống xác nhận mật khẩu")
    private String confirmPassword;

}
