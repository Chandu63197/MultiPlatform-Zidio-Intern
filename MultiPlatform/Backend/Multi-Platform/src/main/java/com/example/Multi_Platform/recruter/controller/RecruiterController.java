package com.example.Multi_Platform.recruter.controller;

import com.example.Multi_Platform.config.JwtUtil;
import com.example.Multi_Platform.recruiter.requests.LoginRecruiterRequest;
import com.example.Multi_Platform.recruter.service.RecruiterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/recruiters")
public class RecruiterController {

  @Autowired
  private RecruiterService recruiterService;

  @Autowired
  private JwtUtil jwtUtil;

  @PostMapping("/login")
  public ResponseEntity<?> loginRecruiter(@RequestBody LoginRecruiterRequest request) {
    String token = recruiterService.loginRecruiterAndReturnToken(request);

    if (token != null) {
      return ResponseEntity.ok(Map.of("token", token, "message", "Recruiter login successful!"));
    } else {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
    }
  }

}
