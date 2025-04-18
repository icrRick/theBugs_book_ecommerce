package com.thebugs.back_end.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.thebugs.back_end.resp.ResponseData;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import java.io.IOException;
import java.util.logging.Logger;

public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper;
    private static final Logger logger = Logger.getLogger(CustomAuthenticationEntryPoint.class.getName());

    public CustomAuthenticationEntryPoint() {
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException, ServletException {
        // Set response status and type
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json;charset=UTF-8");

        // Log the authentication exception details for debugging
        logger.warning("Unauthorized access attempt: " + authException.getMessage());

        // Prepare the custom response object
        ResponseData responseData = new ResponseData(false, "Không có quyền truy cập", null);
        
        // Convert response object to JSON and send it back
        String jsonResponse = objectMapper.writeValueAsString(responseData);
        response.getWriter().write(jsonResponse);
    }
}
