package com.example.Multi_Platform.student.dto;

import com.example.Multi_Platform.recruter.entity.Internship;
import com.example.Multi_Platform.Student.entity.Application;

public class InternshipApplicationDTO {
  private Application application;
  private Internship internship;

  public InternshipApplicationDTO(Application application, Internship internship) {
    this.application = application;
    this.internship = internship;
  }

  public Application getApplication() {
    return application;
  }

  public Internship getInternship() {
    return internship;
  }
}
