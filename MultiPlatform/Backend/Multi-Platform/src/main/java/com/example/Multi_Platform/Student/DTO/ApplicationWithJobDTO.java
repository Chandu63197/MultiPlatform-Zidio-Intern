// ApplicationWithJobDTO.java
package com.example.Multi_Platform.Student.DTO;

import com.example.Multi_Platform.Student.entity.Application;
import com.example.Multi_Platform.recruter.entity.Job;

public class ApplicationWithJobDTO {
  private Application application;
  private Job job;

  public ApplicationWithJobDTO(Application application, Job job) {
    this.application = application;
    this.job = job;
  }

  public Application getApplication() {
    return application;
  }

  public Job getJob() {
    return job;
  }
}
