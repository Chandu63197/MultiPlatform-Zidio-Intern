package com.example.Multi_Platform.recruter.DTO;

public class RecruiterApplicationsResponseDTO {
  private Long applicationId;
  private String studentName;
  private String studentEmail;
  private String resumeLink;
  private String jobTitle;
  private String opportunityType;
  private String status;

  private byte[] resumeContent;

  public RecruiterApplicationsResponseDTO(Long applicationId, String studentName, String studentEmail,
                                          String resumeLink, String jobTitle, String opportunityType, String status ,byte[] resumeContent) {
    this.applicationId = applicationId;
    this.studentName = studentName;
    this.studentEmail = studentEmail;
    this.resumeLink = resumeLink;
    this.jobTitle = jobTitle;
    this.opportunityType = opportunityType;
    this.status = status;
    this.resumeContent = resumeContent;
  }

  // Getters
  public Long getApplicationId() { return applicationId; }
  public String getStudentName() { return studentName; }
  public String getStudentEmail() { return studentEmail; }
  public String getResumeLink() { return resumeLink; }
  public String getJobTitle() { return jobTitle; }
  public String getOpportunityType() { return opportunityType; }
  public String getStatus() { return status; }
  public byte[] getResumeContent() { return resumeContent; }
}
