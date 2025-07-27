package com.example.Multi_Platform.Admin.controller;

import com.example.Multi_Platform.Student.entity.Application;
import com.example.Multi_Platform.config.JwtUtil;
import com.example.Multi_Platform.Student.DTO.ApplicationWithJobDTO;
import com.example.Multi_Platform.recruter.entity.Internship;
import com.example.Multi_Platform.recruter.entity.Job;
import com.example.Multi_Platform.recruter.service.InternshipService;
import com.example.Multi_Platform.recruter.service.JobService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/applications")
public class AdminApplicationController {

  @Autowired
  private com.example.Multi_Platform.student.repository.ApplicationRepository applicationRepository;

  @Autowired
  private JobService jobService;

  @Autowired
  private JwtUtil jwtUtil;

  @Autowired
  private InternshipService internshipService;


  private boolean isAuthorizedAdmin(HttpServletRequest request) {
    String authHeader = request.getHeader("Authorization");
    if (authHeader != null && authHeader.startsWith("Bearer ")) {
      String token = authHeader.substring(7);
      return jwtUtil.isTokenValid(token) && "ADMIN".equals(jwtUtil.extractRole(token));
    }
    return false;
  }

  @GetMapping
  public ResponseEntity<?> getAllApplications(HttpServletRequest request) {
    if (!isAuthorizedAdmin(request)) {
      return ResponseEntity.status(403).body("Access Denied: Admin only");
    }

    List<Application> applications = applicationRepository.findAll();
    return ResponseEntity.ok(applications);
  }

  @GetMapping("/with-jobs")
  public ResponseEntity<?> getAllApplicationsWithDetails(HttpServletRequest request) {
    if (!isAuthorizedAdmin(request)) {
      return ResponseEntity.status(403).body("Access Denied: Admin only");
    }

    List<Application> applications = applicationRepository.findAll();

    List<com.example.Multi_Platform.Admin.dto.ApplicationAdminDTO> enriched = applications.stream()
            .map(app -> {
              Job job = null;
              Internship internship = null;

              if ("job".equalsIgnoreCase(app.getJobType())) {
                job = jobService.getJobById(app.getJobId()).orElse(null);
              } else if ("internship".equalsIgnoreCase(app.getJobType())) {
                internship = internshipService.getInternshipById(app.getJobId()).orElse(null);
              }

              return new com.example.Multi_Platform.Admin.dto.ApplicationAdminDTO(app, job, internship);
            })
            .collect(Collectors.toList());

    return ResponseEntity.ok(enriched);
  }

  @DeleteMapping("/{applicationId}")
  public ResponseEntity<?> deleteApplication(@PathVariable Long applicationId, HttpServletRequest request) {
    if (!isAuthorizedAdmin(request)) {
      return ResponseEntity.status(403).body("Access Denied: Admin only");
    }

    if (!applicationRepository.existsById(applicationId)) {
      return ResponseEntity.status(404).body("Application not found");
    }

    applicationRepository.deleteById(applicationId);
    return ResponseEntity.ok("Application deleted successfully");
  }


  @GetMapping("/by-student")
  public ResponseEntity<?> getApplicationsByStudent(@RequestParam String email, HttpServletRequest request) {
    if (!isAuthorizedAdmin(request)) {
      return ResponseEntity.status(403).body("Access Denied: Admin only");
    }

    List<Application> applications = applicationRepository.findByStudentEmail(email);
    return ResponseEntity.ok(applications);
  }
}
