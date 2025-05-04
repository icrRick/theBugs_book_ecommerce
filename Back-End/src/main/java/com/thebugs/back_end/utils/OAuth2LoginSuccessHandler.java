package com.thebugs.back_end.utils;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.thebugs.back_end.entities.User;
import com.thebugs.back_end.services.user.RegisterService;
import com.thebugs.back_end.services.user.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final UserService userService;
    private final RegisterService registerService;
    private final JwtUtil jwtUtil;


    public OAuth2LoginSuccessHandler(
        @Lazy UserService userService,
        @Lazy RegisterService registerService,
        @Lazy JwtUtil jwtUtil
    ) {
        this.userService = userService;
        this.registerService = registerService;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        String email = (String) oauth2User.getAttributes().get("email");
        String fullName = (String) oauth2User.getAttributes().get("name");
                                            System.out.println("OAuth2User        "+oauth2User);
        User user = userService.checkUserByEmail(email);
        if (user == null) {
            user = registerService.dangky(fullName, email,"12345678");
        }
        
        String token = jwtUtil.generateToken(user.getId(), user.getRole().getId(), "LOGIN");
        String redirectUrl = "http://localhost:3000/login-google?token=" + token;

        response.sendRedirect(redirectUrl);
    }
}
