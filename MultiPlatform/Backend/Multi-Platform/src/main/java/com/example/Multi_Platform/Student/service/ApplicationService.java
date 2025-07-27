package com.example.Multi_Platform.student.service;

import com.example.Multi_Platform.Student.entity.Application;
import com.example.Multi_Platform.recruter.entity.Job;
import com.example.Multi_Platform.recruter.service.JobService;
import com.example.Multi_Platform.student.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ApplicationService {

  @Autowired
  private ApplicationRepository applicationRepository;

  @Autowired
  private JobService jobService; // ✅ Inject JobService

  public List<Application> getAllApplications() {
    return applicationRepository.findAll();
  }

  public List<Application> getApplicationsByJobId(Long jobId) {
    return applicationRepository.findByJobId(jobId);
  }

  public Optional<Application> updateApplicationStatus(Long id, String status) {
    return applicationRepository.findById(id).map(app -> {
      app.setStatus(status);
      return applicationRepository.save(app);
    });
  }

  // ✅ Fixed this method to use JobService
  public Optional<Job> getJobById(Long id) {
    return jobService.getJobById(id);
  }
  public List<Application> getApplicationsByJobIdsAndTypes(List<Long> jobIds, List<Long> internshipIds) {
    return applicationRepository.findByRecruiterJobsAndInternships(jobIds, internshipIds);
  }
}
