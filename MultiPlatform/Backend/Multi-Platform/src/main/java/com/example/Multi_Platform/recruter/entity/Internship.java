package com.example.Multi_Platform.recruter.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "internships")
public class Internship {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String recruiterEmail;
  private String title;
  private String company;
  private String location;
  private String description;
  private String deadline;
  private String duration;
  private String stipend;
  private String status = "Open"; // Default value

  public Internship() {
  }

  public Internship(String title, String company, String location, String description, String deadline) {
    this.title = title;
    this.company = company;
    this.location = location;
    this.description = description;
    this.deadline = deadline;
  }

  // Getters and Setters

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
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

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getDeadline() {
    return deadline;
  }

  public void setDeadline(String deadline) {
    this.deadline = deadline;
  }

  public String getDuration() {
    return duration;
  }

  public void setDuration(String duration) {
    this.duration = duration;
  }

  public String getStipend() {
    return stipend;
  }

  public void setStipend(String stipend) {
    this.stipend = stipend;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public String getRecruiterEmail() {
    return recruiterEmail;
  }

  public void setRecruiterEmail(String recruiterEmail) {
    this.recruiterEmail = recruiterEmail;
  }
}
