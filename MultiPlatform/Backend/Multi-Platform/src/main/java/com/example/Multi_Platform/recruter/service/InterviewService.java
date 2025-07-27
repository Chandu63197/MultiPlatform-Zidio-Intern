package com.example.Multi_Platform.recruter.service;

import com.example.Multi_Platform.recruter.entity.Interview;
import com.example.Multi_Platform.recruter.repository.InterviewRepository;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class InterviewService {

  @Autowired
  private InterviewRepository interviewRepository;

  @Autowired
  private com.example.Multi_Platform.student.service.NotificationService notificationService;

  public Interview scheduleInterview(Interview interview) {
    Interview saved = interviewRepository.save(interview);
    String message = "Interview scheduled for " + saved.getCandidateName() + " with " + saved.getInterviewer();
    notificationService.createNotification("Interview", "New Interview Scheduled", message);
    return saved;
  }

  // New method to fetch all interviews
  public List<Interview> getAllInterviews() {
    return interviewRepository.findAll();
  }

  public ResponseEntity<Interview> updateInterview(Long id, Interview interviewDetails) {
    return interviewRepository.findById(id).map(interview -> {
      interview.setCandidateName(interviewDetails.getCandidateName());
      interview.setEmail(interviewDetails.getEmail());
      interview.setInterviewDate(interviewDetails.getInterviewDate());
      interview.setInterviewTime(interviewDetails.getInterviewTime());
      interview.setInterviewer(interviewDetails.getInterviewer());
      interview.setLocation(interviewDetails.getLocation());
      Interview updatedInterview = interviewRepository.save(interview);
      return ResponseEntity.ok(updatedInterview);
    }).orElse(ResponseEntity.notFound().build());
  }

  public ResponseEntity<Object> deleteInterview(Long id) {
    return interviewRepository.findById(id).map(interview -> {
      interviewRepository.delete(interview);
      return ResponseEntity.noContent().build();
    }).orElse(ResponseEntity.notFound().build());
  }
}
