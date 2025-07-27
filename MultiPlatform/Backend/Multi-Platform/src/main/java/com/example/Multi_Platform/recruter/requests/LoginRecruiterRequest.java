package com.example.Multi_Platform.recruiter.requests;

public class LoginRecruiterRequest {
  private String email;
  private String password;

  public LoginRecruiterRequest() {
  }

  public LoginRecruiterRequest(String email, String password) {
    this.email = email;
    this.password = password;
  }

  // Getters and Setters
  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }
}
