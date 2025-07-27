package com.example.Multi_Platform.recruter.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "interviews")
public class Interview {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String candidateName;
  private String email;
  private String interviewDate; // Could also use LocalDate if you prefer
  private String interviewTime; // Could also use LocalTime
  private String interviewer;
  private String location;

  // Getters and Setters

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getCandidateName() {
    return candidateName;
  }

  public void setCandidateName(String candidateName) {
    this.candidateName = candidateName;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getInterviewDate() {
    return interviewDate;
  }

  public void setInterviewDate(String interviewDate) {
    this.interviewDate = interviewDate;
  }

  public String getInterviewTime() {
    return interviewTime;
  }

  public void setInterviewTime(String interviewTime) {
    this.interviewTime = interviewTime;
  }

  public String getInterviewer() {
    return interviewer;
  }

  public void setInterviewer(String interviewer) {
    this.interviewer = interviewer;
  }

  public String getLocation() {
    return location;
  }

  public void setLocation(String location) {
    this.location = location;
  }
}
