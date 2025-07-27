package com.example.Multi_Platform.recruter.service;

import com.example.Multi_Platform.Student.entity.Application;
import com.example.Multi_Platform.recruter.entity.Job;
import com.example.Multi_Platform.recruter.repository.AdJobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class JobService {

  @Autowired
  private AdJobRepository jobRepository;

  @Autowired
  private com.example.Multi_Platform.student.service.NotificationService notificationService;

  @Autowired
  private com.example.Multi_Platform.student.repository.ApplicationRepository applicationRepository;

  public Job postJob(Job job) {
    Job saved = jobRepository.save(job);
    notificationService.createNotification("Job", saved.getTitle(), "New job posted at " + saved.getCompany());
    return saved;
  }

  public List<Job> getAllJobs() {
    return jobRepository.findAll();
  }

  public ResponseEntity<Job> updateJob(Long id, Job jobDetails) {
    return jobRepository.findById(id).map(job -> {
      job.setTitle(jobDetails.getTitle());
      job.setDescription(jobDetails.getDescription());
      job.setCompany(jobDetails.getCompany());
      job.setLocation(jobDetails.getLocation());
      job.setDeadline(jobDetails.getDeadline());
      Job updatedJob = jobRepository.save(job);
      return ResponseEntity.ok(updatedJob);
    }).orElse(ResponseEntity.notFound().build());
  }

  public ResponseEntity<Object> deleteJob(Long id) {
    return jobRepository.findById(id).map(job -> {
      jobRepository.delete(job);
      return ResponseEntity.noContent().build();
    }).orElse(ResponseEntity.notFound().build());
  }

  public Optional<Job> getJobById(Long jobId) {
    return jobRepository.findById(jobId);
  }

  public List<Job> getJobsByRecruiterEmail(String recruiterEmail) {
    return jobRepository.findByRecruiterEmail(recruiterEmail);
  }

  public List<Application> getApplicationsByRecruiterJobs(List<Long> jobIds, List<Long> internshipIds) {
    return applicationRepository.findByRecruiterJobsAndInternships(jobIds, internshipIds);
  }

}
