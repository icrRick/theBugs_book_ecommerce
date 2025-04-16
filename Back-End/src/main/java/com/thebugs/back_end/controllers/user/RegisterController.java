package com.thebugs.back_end.controllers.user;

import java.util.stream.Collectors;

import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.web.bind.annotation.RestController;
import com.thebugs.back_end.beans.RegisterBean;
import com.thebugs.back_end.dto.UserDTO;
import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.services.user.RegisterService;
import com.thebugs.back_end.utils.ResponseEntityUtil;

import jakarta.validation.Valid;

@RestController
public class RegisterController {
        private final RegisterService registerService;

        public RegisterController(RegisterService registerService) {
                this.registerService = registerService;
        }

        @PostMapping("/register")
        public ResponseEntity<ResponseData> Register(@RequestBody @Valid RegisterBean registerBean,
                        BindingResult result) {
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
                        responseData.setStatus(true);
                        responseData.setMessage("Đăng ký thành công");
                        UserDTO userDTO = registerService.Register(registerBean);
                        responseData.setData(userDTO);
                        return ResponseEntity.ok(responseData);
                } catch (Exception e) {
                        return ResponseEntityUtil.badRequest(e.getMessage());
                }
        }

}