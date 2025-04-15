package com.thebugs.back_end.beans;

import lombok.Data;

@Data
public class ResetPasswordBean {
    private String token;
    private Integer userId;
    private String newPassword;
    private String confirmPassword;
}
