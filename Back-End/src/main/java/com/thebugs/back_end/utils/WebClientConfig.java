package com.thebugs.back_end.utils;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {
    @Bean
    public WebClient ghnWebClient() {
        return WebClient.builder()
                .baseUrl("https://online-gateway.ghn.vn/shiip/public-api/master-data")
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader("token", API_KEY.GHN_API_KEY)
                .build();
    }

    @Bean
    public WebClient fptWebClient() {
        return WebClient.builder()
                .baseUrl("https://api.fpt.ai")
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader("api-key", API_KEY.FPT_API_KEY)
                .build();
    }
}
