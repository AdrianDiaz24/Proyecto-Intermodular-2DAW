package com.proyecto.backend.config;
}
    }
        return source;
        source.registerCorsConfiguration("/api/**", configuration);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        configuration.setAllowCredentials(true);
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:4200", "http://localhost:4201"));
        CorsConfiguration configuration = new CorsConfiguration();
    public CorsConfigurationSource corsConfigurationSource() {
    @Bean

    }
                .maxAge(3600);
                .allowCredentials(true)
                .allowedHeaders("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedOrigins("http://localhost:4200", "http://localhost:4201")
        registry.addMapping("/api/**")
    public void addCorsMappings(CorsRegistry registry) {
    @Override

public class CorsConfig implements WebMvcConfigurer {
@Configuration

import java.util.Arrays;

import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Bean;


