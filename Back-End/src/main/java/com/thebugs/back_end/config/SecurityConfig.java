package com.thebugs.back_end.config;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.cors.CorsConfiguration;

import com.thebugs.back_end.services.CustomUserDetailsService;
import com.thebugs.back_end.services.user.OAuth2UserService;
import com.thebugs.back_end.utils.CustomAuthenticationEntryPoint;
import com.thebugs.back_end.utils.JwtAuthenticationFilter;
import com.thebugs.back_end.utils.OAuth2LoginSuccessHandler;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    private OAuth2UserService oAuth2UserService;

    @Autowired
    private OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;

    public SecurityConfig(@Lazy JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CustomUserDetailsService customUserDetailsService() {
        return new CustomUserDetailsService();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder builder = http.getSharedObject(AuthenticationManagerBuilder.class);
        builder.userDetailsService(customUserDetailsService()).passwordEncoder(passwordEncoder());
        return builder.build();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(request -> {
                    CorsConfiguration config = new CorsConfiguration();
                    config.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
                    config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    config.setAllowedHeaders(Arrays.asList("*"));
                    config.setAllowCredentials(true);
                    return config;
                }))
                .authorizeHttpRequests(requests -> requests
                        .requestMatchers(
                                "/login", "/comment/**", "/logout", "/register",
                                "/api/users/**", "/home", "/home/**", "/", "/products",
                                "/auth/**", "/genre/list", "/product-detail/**", "/images/**",
                                "/forgotpassword", "/updatepassword/**", "/shopdetail/**",
                                "/payment-online/**", "/reviews/**", "/forgot/**", "/api-ghn/**",
                                "/oauth2/**", "/login/oauth2/**", "/auth/**",
                                "/search/**", "/shop/**", "/author/**")
                        .permitAll()
                        .requestMatchers("/admin/**").hasAuthority("admin")
                        .requestMatchers("/user/**").hasAnyAuthority("user", "seller")
                        .requestMatchers("/seller/**").hasAuthority("seller")
                        .anyRequest().authenticated())
                .exceptionHandling(e -> e.authenticationEntryPoint(new CustomAuthenticationEntryPoint()))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .oauth2Login(oauth -> oauth
                        .userInfoEndpoint(userInfo -> userInfo.userService(oAuth2UserService))
                        .successHandler(oAuth2LoginSuccessHandler)
                        .failureUrl("/auth/loginFailure"));

        return http.build();
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
