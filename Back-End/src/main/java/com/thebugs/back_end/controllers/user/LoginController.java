package com.thebugs.back_end.controllers.user;

import org.springframework.web.bind.annotation.RestController;

import com.thebugs.back_end.beans.LoginBean;
import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.services.user.LoginService;
import com.thebugs.back_end.utils.ResponseDataUtil;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.DefaultMessageSourceResolvable;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
public class LoginController {

        @Autowired
        private  LoginService loginService;

        @PostMapping("/login")
        public ResponseEntity<ResponseData> postLogin(@RequestBody @Valid LoginBean loginBean, BindingResult result) {
            
                try {
                        if (result.hasErrors()) {
                                String errorMessages = result.getAllErrors().stream()
                                                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                                                .collect(Collectors.joining(", "));
                                return ResponseDataUtil.badRequest(errorMessages);
                        }
                        String jwt = loginService.login(loginBean.getEmail(), loginBean.getPassword());
                        Map<String, Object> response = new HashMap<>();
                        response.put("token", jwt);
                        return ResponseDataUtil.OK("Đăng nhập thành công", response);
                  
                } catch (Exception e) {
                        return ResponseDataUtil.badRequest(e.getMessage());
                }
        }

}
