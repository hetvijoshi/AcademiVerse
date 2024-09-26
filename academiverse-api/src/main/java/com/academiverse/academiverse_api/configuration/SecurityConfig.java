package com.academiverse.academiverse_api.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class SecurityConfig{
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.cors()  // Enable CORS
                .and()
                .csrf().disable()  // Disable CSRF (for APIs that don't need it)
                .authorizeRequests()
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()  // Allow all OPTIONS requests
                .anyRequest().authenticated()  // All other requests require authentication
                .and()
                .oauth2ResourceServer((oauth2) -> oauth2
                        .jwt()
                );;  // Enable JWT OAuth2 authentication

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));  // Allow the frontend origin
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));  // Allowed HTTP methods
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));  // Allow JWT and content-type headers
        configuration.setAllowCredentials(true);  // Allow credentials (cookies, authorization headers, etc.)

        // Apply the CORS configuration to all endpoints
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
