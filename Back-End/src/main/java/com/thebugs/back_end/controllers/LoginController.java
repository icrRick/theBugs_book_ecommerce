package com.thebugs.back_end.controllers;

import org.springframework.web.bind.annotation.RestController;

import com.thebugs.back_end.beans.LoginBean;
import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.services.LoginService;
import com.thebugs.back_end.services.UserService;

import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
public class LoginController {

        private final LoginService loginService;
        private final UserService userService;

        public LoginController(LoginService loginService, UserService userService) {
                this.loginService = loginService;
                this.userService = userService;

        }

        @PostMapping("/login")
        public ResponseEntity<ResponseData> postLogin(@RequestBody @Valid LoginBean loginBean, BindingResult result) {
                ResponseData responseData = new ResponseData();
                try {
                        if (result.hasErrors()) {
                                String errorMessages = result.getAllErrors().stream()
                                                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                                                .collect(Collectors.joining(", "));
                                responseData.setStatus(false);
                                responseData.setMessage(errorMessages);
                                responseData.setData(null);
                                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                                .body(responseData);
                        }
                        String jwt = loginService.login(loginBean.getEmail(), loginBean.getPassword());
                        int role = userService.getUserByEmailLogin(loginBean.getEmail()).getRole().getId();
                        responseData.setStatus(true);
                        responseData.setMessage("Đăng nhập thành công");
                        Map<String, Object> response = new HashMap<>();
                        response.put("token", jwt);
                        response.put("role", role);
                        responseData.setData(response);
                        return ResponseEntity.ok(responseData);
                } catch (Exception e) {
                        responseData.setStatus(false);
                        responseData.setMessage(e.getMessage());
                        responseData.setData(null);
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
                }
        }

}
