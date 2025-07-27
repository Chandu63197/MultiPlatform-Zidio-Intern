package com.example.Multi_Platform.recruter.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "jobs")
public class Job {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String recruiterEmail;
  private String title;
  private String description;
  private String company;
  private String location;
  private String deadline;
  private String type;
  private String status;

  public Job() {}

  public Job(String title, String description, String company, String location, String deadline, String status) {
    this.title = title;
    this.description = description;
    this.company = company;
    this.location = location;
    this.deadline = deadline;
    this.status = status;
  }

  // Getters and setters
  public Long getId() {
    return id;
  }

  public String getRecruiterEmail() {
    return recruiterEmail;
  }

  public void setRecruiterEmail(String recruiterEmail) {
    this.recruiterEmail = recruiterEmail;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getCompany() {
    return company;
  }

  public void setCompany(String company) {
    this.company = company;
  }

  public String getLocation() {
    return location;
  }

  public void setLocation(String location) {
    this.location = location;
  }

  public String getDeadline() {
    return deadline;
  }

  public void setDeadline(String deadline) {
    this.deadline = deadline;
  }

  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }
}
