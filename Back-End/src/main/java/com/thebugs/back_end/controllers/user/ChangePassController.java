package com.thebugs.back_end.controllers.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.thebugs.back_end.beans.ChangePasswordBean;
import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.services.user.UserService;
import com.thebugs.back_end.utils.ResponseEntityUtil;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/user")
public class ChangePassController {
        @Autowired
        private UserService userService;

        @PostMapping("/change_pass")
        public ResponseEntity<ResponseData> ChangePass(@RequestHeader("Authorization") String authorizationHeader,
                        @RequestBody @Valid ChangePasswordBean changePasswordBean,BindingResult result) {
                try {

                        boolean check = userService.updatePassword(authorizationHeader, changePasswordBean.getPwOld(),
                                        changePasswordBean.getPwNew(), changePasswordBean.getCfPwNew());
                        if (check) {
                                return ResponseEntityUtil.OK("Đổi mật khẩu thành công, vui lòng đăng nhập lại", null);
                        }
                        return ResponseEntityUtil.badRequest("Đổi mật khẩu thất bại");

                } catch (Exception e) {
                        return ResponseEntityUtil.badRequest("Lỗi " + e.getMessage());

                }
        }
}