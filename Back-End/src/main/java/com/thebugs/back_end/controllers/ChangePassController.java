package com.thebugs.back_end.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.thebugs.back_end.beans.ChangePasswordBean;
import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.services.UserService;

@RestController
@RequestMapping("/user")
public class ChangePassController {
        private final UserService userService;

        public ChangePassController(UserService userService) {
                this.userService = userService;
        }

        @PostMapping("/change_pass")
        public ResponseEntity<ResponseData> ChangePass(@RequestHeader("Authorization") String authorizationHeader,
                        @RequestBody ChangePasswordBean changePasswordBean) {
                ResponseData responseData = new ResponseData();
                try {
                        boolean check = userService.updatePassword(authorizationHeader, changePasswordBean.getPwOld(),
                                        changePasswordBean.getPwNew(), changePasswordBean.getCfPwNew());
                        if (check) {
                                responseData.setStatus(true);
                                responseData.setMessage("Đổi mật khẩu thành công");
                                responseData.setData(null);
                                return ResponseEntity.ok(responseData);
                        } else {
                                responseData.setStatus(false);
                                responseData.setMessage("Mật khẩu mới không khớp");
                                responseData.setData(null);
                                return ResponseEntity.status(401).body(responseData);
                        }
                } catch (Exception e) {
                        responseData.setStatus(false);
                        responseData.setMessage("lỗi " + e.getMessage());
                        responseData.setData(null);
                        return ResponseEntity.status(401).body(responseData);
                }
        }
}