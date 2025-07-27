package com.example.Multi_Platform.recruter.service;

import com.example.Multi_Platform.recruter.entity.Job;
import com.example.Multi_Platform.recruter.entity.Internship;
import com.example.Multi_Platform.recruter.entity.Interview;
import com.example.Multi_Platform.recruter.repository.AdJobRepository;
import com.example.Multi_Platform.recruter.repository.InternshipRepository;
import com.example.Multi_Platform.recruter.repository.InterviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecruiterDashboardService {

  @Autowired
  private AdJobRepository jobRepository;

  @Autowired
  private InternshipRepository internshipRepository;

  @Autowired
  private InterviewRepository interviewRepository;

  public List<Job> getAllJobs() {
    return jobRepository.findAll();
  }

  public List<Internship> getAllInternships() {
    return internshipRepository.findAll();
  }

  public List<Interview> getAllInterviews() {
    return interviewRepository.findAll();
  }
}
