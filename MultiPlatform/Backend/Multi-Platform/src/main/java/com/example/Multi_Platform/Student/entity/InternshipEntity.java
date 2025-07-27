package com.example.Multi_Platform.recruter.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "internships")
public class InternshipEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String title;
  private String company;
  private String location;
  private String category;
  private String duration;
  private String stipend;
  private String status = "Open";
  private String description;

  // Getters and setters
  public Long getId() {
    return id;
  }

  public String getTitle() {
    return title;
  }

  public String getCompany() {
    return company;
  }

  public String getLocation() {
    return location;
  }

  public String getCategory() {
    return category;
  }

  public String getDuration() {
    return duration;
  }

  public String getStipend() {
    return stipend;
  }

  public String getStatus() {
    return status;
  }

  public String getDescription() {
    return description;
  }

}
