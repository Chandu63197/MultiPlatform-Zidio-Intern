package com.example.Multi_Platform.admin.controller;

import com.example.Multi_Platform.recruter.entity.Job;
import com.example.Multi_Platform.recruter.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/jobs")
public class AdminJobController {

  @Autowired
  private JobService jobService;


  @GetMapping
  public ResponseEntity<List<Job>> getAllJobs() {
    List<Job> jobs = jobService.getAllJobs();
    return ResponseEntity.ok(jobs);
  }

  @PutMapping("/{id}")
  public ResponseEntity<Job> updateJob(@PathVariable Long id, @RequestBody Job jobDetails) {
    return jobService.updateJob(id, jobDetails);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Object> deleteJob(@PathVariable Long id) {
    return jobService.deleteJob(id);
  }
}
