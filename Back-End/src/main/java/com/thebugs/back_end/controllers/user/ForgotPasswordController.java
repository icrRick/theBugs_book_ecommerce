package com.thebugs.back_end.controllers.user;

import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thebugs.back_end.beans.EmailBean;
import com.thebugs.back_end.beans.ResetPasswordBean;
import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.services.user.ForgotPasswordService;

import com.thebugs.back_end.utils.ResponseEntityUtil;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/forgot")
public class ForgotPasswordController {

    @Autowired
    private ForgotPasswordService forgotPasswordService;


    @PostMapping("/send-email")
    public ResponseEntity<ResponseData> postSendEmail(@RequestBody @Valid EmailBean emailBean, BindingResult result) {
        try {
            if (result.hasErrors()) {
                String errorMessages = result.getAllErrors().stream()
                        .map(DefaultMessageSourceResolvable::getDefaultMessage)
                        .collect(Collectors.joining(", "));
                return ResponseEntityUtil.badRequest(errorMessages);
            }

            boolean checksendEmail = forgotPasswordService.sendEmail(emailBean);
            if (checksendEmail) {
                return ResponseEntityUtil.OK("Mã xác nhận đã được gửi đến email " + emailBean.getEmail(), null);
            } else {
                return ResponseEntityUtil.badRequest("Lỗi gửi mail");
            }
        } catch (Exception e) {
            return ResponseEntityUtil.badRequest("Lỗi " + e.getMessage());
        }
    }


    @PostMapping("reset-password")
    public ResponseEntity<ResponseData> resetPassword(@RequestBody @Valid ResetPasswordBean resetPasswordBean,BindingResult result){
        try {
            if (result.hasErrors()) {
                String errorMessages = result.getAllErrors().stream()
                        .map(DefaultMessageSourceResolvable::getDefaultMessage)
                        .collect(Collectors.joining(", "));
                return ResponseEntityUtil.badRequest(errorMessages);
            }

            boolean checksendEmail = forgotPasswordService.resetPassword(resetPasswordBean);
            if (checksendEmail) {
                return ResponseEntityUtil.OK("Cập nhật mật khẩu thành công", null);
            } else {
                return ResponseEntityUtil.badRequest("Lỗi Đổi mật khẩu thất bại");
            }
        } catch (Exception e) {
            return ResponseEntityUtil.badRequest("Lỗi " + e.getMessage());
        }
    }

}
