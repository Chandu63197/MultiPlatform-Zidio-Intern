package com.example.Multi_Platform.recruter.controller;

import com.example.Multi_Platform.recruter.entity.Job;
import com.example.Multi_Platform.recruter.service.JobService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recruiter")
public class JobController {

  @Autowired
  private JobService jobService;

  @PostMapping("/postJob")
  public Job postJob(@RequestBody Job job) {
    return jobService.postJob(job);
  }

  // New GET endpoint
  @GetMapping("/jobs")
  public List<Job> getAllJobs() {
    return jobService.getAllJobs();
  }

  // Update job by ID
  @PutMapping("/jobs/{id}")
  public ResponseEntity<Job> updateJob(@PathVariable Long id, @RequestBody Job jobDetails) {
    return jobService.updateJob(id, jobDetails);
  }

  // Delete job by ID
  @DeleteMapping("/jobs/{id}")
  public ResponseEntity<Object> deleteJob(@PathVariable Long id) {
    return jobService.deleteJob(id);
  }
}
