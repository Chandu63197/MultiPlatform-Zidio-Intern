package com.example.Multi_Platform.recruter.service;

import com.example.Multi_Platform.recruter.entity.Internship;
import com.example.Multi_Platform.recruter.repository.InternshipRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class InternshipService {

  @Autowired
  private InternshipRepository internshipRepository;

  @Autowired
  private com.example.Multi_Platform.student.service.NotificationService notificationService;

  public Internship postInternship(Internship internship) {
    Internship saved = internshipRepository.save(internship);
    String message = "New internship posted at " + saved.getCompany() + " for " + saved.getTitle();
    notificationService.createNotification("Internship", saved.getTitle(), message);
    return saved;
  }

  public List<Internship> getAllInternships() {
    return internshipRepository.findAll();
  }

  public ResponseEntity<Internship> updateInternship(Long id, Internship internshipDetails) {
    return internshipRepository.findById(id).map(internship -> {
      internship.setTitle(internshipDetails.getTitle());
      internship.setDescription(internshipDetails.getDescription());
      internship.setCompany(internshipDetails.getCompany());
      internship.setLocation(internshipDetails.getLocation());
      internship.setDeadline(internshipDetails.getDeadline());
      internship.setDuration(internshipDetails.getDuration());
      internship.setStipend(internshipDetails.getStipend());
      internship.setStatus(internshipDetails.getStatus());
      Internship updatedInternship = internshipRepository.save(internship);
      return ResponseEntity.ok(updatedInternship);
    }).orElse(ResponseEntity.notFound().build());
  }

  public ResponseEntity<Object> deleteInternship(Long id) {
    return internshipRepository.findById(id).map(internship -> {
      internshipRepository.delete(internship);
      return ResponseEntity.noContent().build();
    }).orElse(ResponseEntity.notFound().build());
  }

  public Optional<Internship> getInternshipById(Long jobId) {
    return internshipRepository.findById(jobId);
  }

  public List<Internship> getInternshipsByRecruiterEmail(String recruiterEmail) {
    return internshipRepository.findByRecruiterEmail(recruiterEmail);
  }

}
