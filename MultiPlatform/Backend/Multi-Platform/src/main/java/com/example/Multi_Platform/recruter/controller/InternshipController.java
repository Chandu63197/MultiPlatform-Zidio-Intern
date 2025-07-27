package com.example.Multi_Platform.recruter.controller;

import com.example.Multi_Platform.recruter.entity.Internship;
import com.example.Multi_Platform.recruter.service.InternshipService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recruiter")
public class InternshipController {

    @Autowired
    private InternshipService internshipService;

    @PostMapping("/postInternship")
    public Internship postInternship(@RequestBody Internship internship) {
        return internshipService.postInternship(internship);
    }

    // New GET endpoint
    @GetMapping("/internships")
    public List<Internship> getAllInternships() {
        return internshipService.getAllInternships();
    }

    // Update internship by ID
    @PutMapping("/internships/{id}")
    public ResponseEntity<Internship> updateInternship(@PathVariable Long id,
            @RequestBody Internship internshipDetails) {
        return internshipService.updateInternship(id, internshipDetails);
    }

    // Delete internship by ID
    @DeleteMapping("/internships/{id}")
    public ResponseEntity<Object> deleteInternship(@PathVariable Long id) {
        return internshipService.deleteInternship(id);
    }
}
