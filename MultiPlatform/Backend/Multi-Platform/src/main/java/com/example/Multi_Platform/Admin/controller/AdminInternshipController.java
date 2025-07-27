package com.example.Multi_Platform.Admin.controller;

import com.example.Multi_Platform.recruter.entity.Internship;
import com.example.Multi_Platform.recruter.service.InternshipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/internships")
public class AdminInternshipController {

  @Autowired
  private InternshipService internshipService;

  @GetMapping
  public ResponseEntity<List<Internship>> getAllInternships() {
    return ResponseEntity.ok(internshipService.getAllInternships());
  }

  @PutMapping("/{id}")
  public ResponseEntity<Internship> updateInternship(@PathVariable Long id, @RequestBody Internship internship) {
    return internshipService.updateInternship(id, internship);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Object> deleteInternship(@PathVariable Long id) {
    return internshipService.deleteInternship(id);
  }
}
