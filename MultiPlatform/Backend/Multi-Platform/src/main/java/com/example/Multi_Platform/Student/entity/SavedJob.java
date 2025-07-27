package com.example.Multi_Platform.student.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "saved_jobs", uniqueConstraints = {
    @UniqueConstraint(columnNames = { "job_id", "student_email" })
})
public class SavedJob {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "job_id", nullable = false)
  private Long jobId;

  @Column(name = "student_email", nullable = false)
  private String studentEmail;

  // Constructors
  public SavedJob() {
  }

  public SavedJob(Long jobId, String studentEmail) {
    this.jobId = jobId;
    this.studentEmail = studentEmail;
  }

  // Getters and Setters
  public Long getId() {
    return id;
  }

  public Long getJobId() {
    return jobId;
  }

  public void setJobId(Long jobId) {
    this.jobId = jobId;
  }

  public String getStudentEmail() {
    return studentEmail;
  }

  public void setStudentEmail(String studentEmail) {
    this.studentEmail = studentEmail;
  }
}
