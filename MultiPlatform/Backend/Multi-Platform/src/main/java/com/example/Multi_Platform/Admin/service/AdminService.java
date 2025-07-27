package com.example.Multi_Platform.admin.service;

import com.example.Multi_Platform.admin.entity.Admin;
import com.example.Multi_Platform.admin.repository.AdminRepository;
import com.example.Multi_Platform.admin.requests.LoginAdminRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

  @Autowired
  private AdminRepository adminRepository;

  @Autowired
  private PasswordEncoder passwordEncoder;

  // @Autowired
  // private BCryptPasswordEncoder passwordEncoder;

  public boolean loginAdmin(LoginAdminRequest request) {
    Admin admin = adminRepository.findByEmail(request.getEmail());
    return admin != null && passwordEncoder.matches(request.getPassword(), admin.getPassword());
  }

  public boolean changePassword(String email, String oldPassword, String newPassword) {
    Admin admin = adminRepository.findByEmail(email);
    if (admin == null)
      return false;

    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    if (!encoder.matches(oldPassword, admin.getPassword())) {
      return false; // old password doesn't match
    }

    admin.setPassword(encoder.encode(newPassword));
    adminRepository.save(admin);
    return true;
  }


  public boolean changeEmail(String currentEmail, String newEmail) {
    Admin admin = adminRepository.findByEmail(currentEmail);

    if (admin == null) {
      return false;
    }

    // Prevent duplicate emails
    if (adminRepository.existsByEmail(newEmail)) {
      return false;
    }

    admin.setEmail(newEmail);
    adminRepository.save(admin);
    return true;
  }
}
