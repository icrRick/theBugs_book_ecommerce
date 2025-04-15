package com.thebugs.back_end.utils;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.thebugs.back_end.entities.User;
import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.services.CustomUserDetailsService;
import com.thebugs.back_end.services.user.UserService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

        private final JwtUtil jwtUtil;
        private final CustomUserDetailsService userDetailsService;
        private final ObjectMapper objectMapper;
        private final UserService userService;

        public JwtAuthenticationFilter(JwtUtil jwtUtil, CustomUserDetailsService userDetailsService,
                        ObjectMapper objectMapper, UserService userService) {
                this.jwtUtil = jwtUtil;
                this.userDetailsService = userDetailsService;
                this.objectMapper = objectMapper;
                this.userService = userService;
        }

        @Override
        protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response,
                        @NonNull FilterChain chain) throws ServletException, IOException {
                String token = request.getHeader("Authorization");
                if (token != null && token.startsWith("Bearer ")) {
                        token = token.substring(7);
                        try {
                                String userId = jwtUtil.extractUserId(token);

                                // Kiểm tra userId hợp lệ trước khi gọi userService
                                if (userId != null) {
                                        // Lấy email của người dùng từ userService
                                        User user = userService.getUserById(Integer.parseInt(userId));
                                        if (user == null) {
                                                throw new Exception("User không tồn tại");
                                        }
                                        String email = user.getEmail();

                                        // Kiểm tra tính hợp lệ của token
                                        if (jwtUtil.validateToken(token, Integer.parseInt(userId), "LOGIN")) {
                                                UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                                                
                                                // Tạo authentication token cho người dùng
                                                UsernamePasswordAuthenticationToken authenticationToken = 
                                                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                                                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                                                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                                        }
                                }
                        } catch (Exception e) {
                                // Đảm bảo nếu token không hợp lệ hoặc hết hạn sẽ trả về 401
                                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                                response.setContentType("application/json;charset=UTF-8");
                                response.getWriter().write(objectMapper.writeValueAsString(
                                        new ResponseData(false, "Token không hợp lệ hoặc hết hạn", null)));
                                return;
                        }
                }
                chain.doFilter(request, response);
        }
}

