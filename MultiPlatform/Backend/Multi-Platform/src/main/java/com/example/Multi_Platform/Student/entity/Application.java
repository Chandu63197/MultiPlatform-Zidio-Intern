package com.example.Multi_Platform.Student.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "applications")
public class Application {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private Long jobId;
  private String jobType;
  private String studentName;
  private String studentEmail;
  private String resumeLink;
  private String type;
  private String jobTitle;
  private String status = "Pending";

  public Application() {
  }


  public Application(Long jobId, String jobType, String studentName, String studentEmail, String resumeLink) {
    this.jobId = jobId;
    this.jobType = jobType;
    this.studentName = studentName;
    this.studentEmail = studentEmail;
    this.resumeLink = resumeLink;
  }

  // Getters and Setters
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getJobId() {
    return jobId;
  }

  public void setJobId(Long jobId) {
    this.jobId = jobId;
  }

  public String getJobType() {
    return jobType;
  }

  public void setJobType(String jobType) {
    this.jobType = jobType;
  }

  public String getStudentName() {
    return studentName;
  }

  public void setStudentName(String studentName) {
    this.studentName = studentName;
  }

  public String getStudentEmail() {
    return studentEmail;
  }

  public void setStudentEmail(String studentEmail) {
    this.studentEmail = studentEmail;
  }

  public String getJobTitle() {
    return jobTitle;
  }

  public void setJobTitle(String jobTitle) {
    this.jobTitle = jobTitle;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public String getResumeLink() {
    return resumeLink;
  }

  public void setResumeLink(String resumeLink) {
    this.resumeLink = resumeLink;
  }

  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }


}
