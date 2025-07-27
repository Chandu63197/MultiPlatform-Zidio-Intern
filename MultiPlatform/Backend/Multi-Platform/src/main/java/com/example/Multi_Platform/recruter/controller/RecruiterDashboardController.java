package com.example.Multi_Platform.recruter.controller;

import com.example.Multi_Platform.recruter.entity.Job;
import com.example.Multi_Platform.recruter.entity.Internship;
import com.example.Multi_Platform.recruter.entity.Interview;
import com.example.Multi_Platform.recruter.service.RecruiterDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recruiter/dashboard")
@CrossOrigin(origins = "http://localhost:3000") // Update this as per your frontend origin
public class RecruiterDashboardController {

  @Autowired
  private RecruiterDashboardService dashboardService;

  @GetMapping("/jobs")
  public List<Job> getJobs() {
    return dashboardService.getAllJobs();
  }

  @GetMapping("/internships")
  public List<Internship> getInternships() {
    return dashboardService.getAllInternships();
  }

  @GetMapping("/interviews")
  public List<Interview> getInterviews() {
    return dashboardService.getAllInterviews();
  }
}
