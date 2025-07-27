package com.example.Multi_Platform.Student.controller;

import com.example.Multi_Platform.Student.service.StudentProfileService;
import com.example.Multi_Platform.model.StudentProfile;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
public class StudentProfileController {

  private final StudentProfileService service;

  @Value("${upload.directory}")
  private String uploadDirectory;

  public StudentProfileController(StudentProfileService service) {
    this.service = service;
  }

  private String extractEmail() {
    Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    if (principal instanceof String) {
      return (String) principal;
    } else if (principal instanceof UserDetails userDetails) {
      return userDetails.getUsername();
    }
    throw new RuntimeException("Unable to extract user email from security context");
  }

  @PostMapping
  public ResponseEntity<?> saveProfile(@RequestBody StudentProfile profile) {
    try {
      StudentProfile savedProfile = service.saveOrUpdateProfile(profile);
      return ResponseEntity.ok(savedProfile);
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save profile");
    }
  }

  @GetMapping("/me")
  public ResponseEntity<?> getMyProfile() {
    try {
      String email = extractEmail();
      Optional<StudentProfile> profile = service.getProfileByEmail(email);

      if (profile.isPresent()) {
        return ResponseEntity.ok(profile.get());
      } else {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Profile not found");
      }
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to retrieve profile");
    }
  }


  @PostMapping("/upload")
  public ResponseEntity<?> uploadResume(@RequestParam("file") MultipartFile file, Principal principal) {
    try {
      String email = principal.getName();

      if (file.isEmpty()) {
        return ResponseEntity.badRequest().body("No file uploaded");
      }

      String fileName = service.saveResume(file, email);
      return ResponseEntity.ok("Resume uploaded: " + fileName);
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
              .body("Resume upload failed: " + e.getMessage());
    }
  }
  @GetMapping("/download")
  public ResponseEntity<Resource> downloadResume() {
    try {
      String email = extractEmail();
      Resource resume = service.getResumeByEmail(email);

      return ResponseEntity.ok()
              .contentType(MediaType.APPLICATION_OCTET_STREAM)
              .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resume.getFilename() + "\"")
              .body(resume);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
  }

  @GetMapping("/view")
  public ResponseEntity<Resource> viewResume() {
    try {
      String email = extractEmail();
      Resource resume = service.getResumeByEmail(email);

      return ResponseEntity.ok()
              .contentType(MediaType.APPLICATION_PDF)
              .body(resume);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
  }
  @GetMapping("/resume/{email}")
  public ResponseEntity<Resource> getResumeByEmail(@PathVariable String email) {
    try {
      Resource resume = service.getResumeByEmail(email);

      return ResponseEntity.ok()
              .contentType(MediaType.APPLICATION_PDF)
              .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resume.getFilename() + "\"")
              .body(resume);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }
  }

}
