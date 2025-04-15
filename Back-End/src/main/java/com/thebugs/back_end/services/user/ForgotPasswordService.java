package com.thebugs.back_end.services.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.beans.EmailBean;
import com.thebugs.back_end.beans.ResetPasswordBean;
import com.thebugs.back_end.entities.User;
import com.thebugs.back_end.utils.EmailUtil;
import com.thebugs.back_end.utils.JwtUtil;


@Service
public class ForgotPasswordService {

    @Autowired
    private EmailUtil emailUtil;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    public boolean sendEmail(EmailBean emailBean) {
        User user = userService.getUserByEmail(emailBean.getEmail());
        String toEmail = user.getEmail();
        int useId = user.getId();
        int roleId = user.getRole().getId();
        String token = jwtUtil.generateToken(useId, roleId, "RESET");
        boolean checksendEmail = emailUtil.sendEmailForgotpassword(toEmail, token, useId);
        return checksendEmail;
    }

    public boolean resetPassword(ResetPasswordBean resetPasswordBean) {
        try {
            boolean checkValidate = jwtUtil.validateToken(
                    resetPasswordBean.getToken(),
                    resetPasswordBean.getUserId(),
                    "RESET");

            boolean checkResetPassword = userService.resetPassword(
                    resetPasswordBean.getUserId(),
                    resetPasswordBean.getNewPassword(),
                    resetPasswordBean.getConfirmPassword());

            return checkValidate && checkResetPassword;

        } catch (Exception e) {
            throw new IllegalArgumentException(e.getMessage());
        }
    }

}
