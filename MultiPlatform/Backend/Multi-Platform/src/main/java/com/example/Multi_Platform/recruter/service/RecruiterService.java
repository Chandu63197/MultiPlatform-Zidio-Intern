package com.example.Multi_Platform.recruter.service;

import com.example.Multi_Platform.config.JwtUtil;
import com.example.Multi_Platform.recruiter.requests.LoginRecruiterRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RecruiterService {

  private static final String RECRUITER_EMAIL = "recruiter@gmail.com";
  private static final String RECRUITER_PASSWORD = "123456";

  @Autowired
  private JwtUtil jwtUtil;

  // Returns true for legacy checks (if still used anywhere)
  public boolean loginRecruiter(LoginRecruiterRequest request) {
    return RECRUITER_EMAIL.equals(request.getEmail()) && RECRUITER_PASSWORD.equals(request.getPassword());
  }

  // New method to return JWT token on successful login
  public String loginRecruiterAndReturnToken(LoginRecruiterRequest request) {
    if (RECRUITER_EMAIL.equals(request.getEmail()) && RECRUITER_PASSWORD.equals(request.getPassword())) {
      return jwtUtil.generateToken(request.getEmail(), "RECRUITER");
    }
    return null;
  }
}
