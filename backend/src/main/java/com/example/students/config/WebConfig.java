package com.example.students.config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
@Configuration public class WebConfig {
  @Bean RestTemplate restTemplate() { return new RestTemplate(); } // Available for outbound REST integrations.
  @Bean WebMvcConfigurer corsConfigurer() { return new WebMvcConfigurer() {
    @Override public void addCorsMappings(CorsRegistry registry) { registry.addMapping("/api/**").allowedOrigins("http://localhost:4200").allowedMethods("GET","POST","PUT","DELETE","OPTIONS"); }
  }; }
}
