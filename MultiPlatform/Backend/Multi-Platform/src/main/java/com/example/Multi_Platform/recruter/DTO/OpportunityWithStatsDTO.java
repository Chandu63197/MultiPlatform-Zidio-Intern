package com.example.Multi_Platform.recruter.DTO;

public class OpportunityWithStatsDTO {
  private Long id;
  private String title;
  private String type;
  private String status;
  private int applicationCount;

  public OpportunityWithStatsDTO(Long id, String title, String type, String status, int applicationCount) {
    this.id = id;
    this.title = title;
    this.type = type;
    this.status = status;
    this.applicationCount = applicationCount;
  }

  // Getters
  public Long getId() { return id; }
  public String getTitle() { return title; }
  public String getType() { return type; }
  public String getStatus() { return status; }
  public int getApplicationCount() { return applicationCount; }
}
