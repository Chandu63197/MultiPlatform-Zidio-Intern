package com.example.Multi_Platform.recruter.controller;

import com.example.Multi_Platform.recruter.entity.Interview;
import com.example.Multi_Platform.recruter.service.InterviewService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recruiter")
public class InterviewController {

  @Autowired
  private InterviewService interviewService;

  @PostMapping("/scheduleInterview")
  public Interview scheduleInterview(@RequestBody Interview interview) {
    return interviewService.scheduleInterview(interview);
  }

  // New GET endpoint
  @GetMapping("/interviews")
  public List<Interview> getAllInterviews() {
    return interviewService.getAllInterviews();
  }

  // Update interview by ID
  @PutMapping("/interviews/{id}")
  public ResponseEntity<Interview> updateInterview(@PathVariable Long id, @RequestBody Interview interviewDetails) {
    return interviewService.updateInterview(id, interviewDetails);
  }

  // Delete interview by ID
  @DeleteMapping("/interviews/{id}")
  public ResponseEntity<Object> deleteInterview(@PathVariable Long id) {
    return interviewService.deleteInterview(id);
  }
}
