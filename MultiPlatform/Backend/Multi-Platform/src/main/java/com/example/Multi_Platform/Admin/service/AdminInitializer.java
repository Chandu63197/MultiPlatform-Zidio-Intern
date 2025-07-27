package com.example.Multi_Platform.Admin.service;

import com.example.Multi_Platform.admin.entity.Admin;
import com.example.Multi_Platform.admin.repository.AdminRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class AdminInitializer {

  @Bean
  CommandLineRunner initAdmin(AdminRepository adminRepo) {
    return args -> {
      if (!adminRepo.existsByEmail("admin@gmail.com")) {
        String hashed = new BCryptPasswordEncoder().encode("123456");
        adminRepo.save(new Admin("admin@gmail.com", hashed));
        System.out.println("Admin seeded.");
      }
    };
  }

}
