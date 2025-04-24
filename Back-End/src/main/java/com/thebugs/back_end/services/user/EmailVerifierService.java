package com.thebugs.back_end.services.user;

import java.util.Map;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class EmailVerifierService {

    private static final String API_KEY = "a3f9684cecf39b5a0704bc6a0e1af946";
    private static final String API_URL = "https://apilayer.net/api/check";

    private final RestTemplate restTemplate;

    public EmailVerifierService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public boolean isEmailValid(String email) {
        String url = API_URL + "?access_key=" + API_KEY + "&email=" + email + "&smtp=1&format=1";

        try {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<>() {
                    });

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Boolean smtpCheck = (Boolean) response.getBody().get("smtp_check");
                return Boolean.TRUE.equals(smtpCheck);
            }
        } catch (Exception e) {
            System.err.println("Lỗi gọi API: " + e.getMessage());
        }

        return false;
    }

}
