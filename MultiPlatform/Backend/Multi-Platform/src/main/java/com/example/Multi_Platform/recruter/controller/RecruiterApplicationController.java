package com.example.Multi_Platform.recruter.controller;

import com.example.Multi_Platform.Student.entity.Application;
import com.example.Multi_Platform.config.JwtUtil;
import com.example.Multi_Platform.recruter.DTO.RecruiterApplicationsResponseDTO;
import com.example.Multi_Platform.recruter.service.RecruiterApplicationService;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recruiter/applications")
public class RecruiterApplicationController {

    @Autowired
    private RecruiterApplicationService recruiterApplicationService;

    @Autowired
    private JwtUtil jwtUtil;

    private String extractRecruiterEmail(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (jwtUtil.isTokenValid(token) && "RECRUITER".equals(jwtUtil.extractRole(token))) {
                return jwtUtil.extractEmail(token); // Make sure this method exists and works!
            }
        }
        return null;
    }

    @GetMapping
    public ResponseEntity<?> getAllApplicationsForRecruiter(HttpServletRequest request) {
        String recruiterEmail = extractRecruiterEmail(request);

        if (recruiterEmail == null) {
            return ResponseEntity.status(403).body("Access Denied: Recruiter only");
        }

        List<RecruiterApplicationsResponseDTO> applications =
                recruiterApplicationService.getAllApplicationsForRecruiter(recruiterEmail);

        return ResponseEntity.ok(applications);
    }

    @PutMapping("/{applicationId}/status")
    public ResponseEntity<?> updateApplicationStatus(
            @PathVariable Long applicationId,
            @RequestParam String status,
            HttpServletRequest request
    ) {
        String recruiterEmail = extractRecruiterEmail(request);
        if (recruiterEmail == null) {
            return ResponseEntity.status(403).body("Access Denied: Recruiter only");
        }

        try {
            Application updatedApplication = recruiterApplicationService.updateApplicationStatus(applicationId, status);
            return ResponseEntity.ok(updatedApplication);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

}
