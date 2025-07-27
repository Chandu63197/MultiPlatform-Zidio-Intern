package com.example.Multi_Platform.Admin.dto;

import com.example.Multi_Platform.Student.entity.Application;
import com.example.Multi_Platform.recruter.entity.Job;
import com.example.Multi_Platform.recruter.entity.Internship;

public class ApplicationAdminDTO {
    private Application application;
    private Job job;
    private Internship internship;

    public ApplicationAdminDTO(Application application, Job job, Internship internship) {
        this.application = application;
        this.job = job;
        this.internship = internship;
    }

    public Application getApplication() {
        return application;
    }

    public Job getJob() {
        return job;
    }

    public Internship getInternship() {
        return internship;
    }
}
