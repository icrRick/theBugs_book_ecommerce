package com.thebugs.back_end.controllers.user;

import java.util.Collections;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.result.view.RedirectView;

import com.thebugs.back_end.entities.User;
import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.services.user.RegisterService;
import com.thebugs.back_end.services.user.UserService;
import com.thebugs.back_end.utils.JwtUtil;
import com.thebugs.back_end.utils.ResponseEntityUtil;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;

    private final RegisterService registerService;

    private final JwtUtil jwtUtil;

    public AuthController(UserService userService, RegisterService registerService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.registerService = registerService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/loginSuccess")
    public ResponseEntity<ResponseData> loginSuccess(@AuthenticationPrincipal OAuth2User oauth2User) {
        try {
            String email = (String) oauth2User.getAttributes().get("email");
            String fullName = (String) oauth2User.getAttributes().get("name");
            User checkEmail = userService.checkUserByEmail(email);
            User login = checkEmail != null ? checkEmail : registerService.dangky(fullName, email, "12345678");
            ;
            String token = jwtUtil.generateToken(login.getId(), login.getRole().getId(), "LOGIN");
            return ResponseEntityUtil.OK("Thành công", token);
        } catch (Exception e) {
            return ResponseEntityUtil.badRequest(e.getMessage());
        }
    }

    @GetMapping("/loginFailure")
    public ResponseEntity<Map<String, String>> loginFailure() {
        Map<String, String> response = Collections.singletonMap("error", "Login failed");
        return ResponseEntity.badRequest().body(response);
    }
}
