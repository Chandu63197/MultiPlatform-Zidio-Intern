package com.example.Multi_Platform.config;

import com.example.Multi_Platform.config.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

        private final JwtAuthenticationFilter jwtAuthenticationFilter;

        public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
                this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
                http
                                .cors()
                                .and()
                                .csrf(csrf -> csrf.disable())
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers(
                                                                "/api/users/registerUser",
                                                                "/api/users/loginUser",
                                                                "/api/users/logout",
                                                                "/api/admins/login",
                                                                "/api/recruiters/login",
                                                                "/api/profile/download",
                                                                 "/api/notifications/**",
                                                                "/api/recruiter/**",
                                                                "/api/admin/jobs/**",
                                                                "/api/admin/internships/**",
                                                                "/api/recruiter/applications/**",
                                                                "/api/student/**",
                                                                "/api/student/favorites/**",
                                                                "/api/admins/deleteUser",
                                                                "/api/admins/updateUser",
                                                                "/api/recruiter/applications/all",
                                                                "/api/admins/allUsers")
                                                .permitAll()
                                        .requestMatchers( "/api/profile",
                                                "/api/profile/upload",
                                                "/api/profile/view",
                                                "/api/profile/download",
                                                "/api/admin/applications/**",
                                                "/api/admins/change-password",
                                                "/api/profile/me").authenticated());

                http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }
}
