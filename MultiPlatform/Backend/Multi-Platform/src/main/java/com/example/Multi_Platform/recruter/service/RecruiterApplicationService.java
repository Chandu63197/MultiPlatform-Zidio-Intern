package com.example.Multi_Platform.recruter.service;

import com.example.Multi_Platform.Student.entity.Application;
import com.example.Multi_Platform.Student.service.StudentProfileService;
import com.example.Multi_Platform.recruter.DTO.OpportunityWithStatsDTO;
import com.example.Multi_Platform.recruter.DTO.RecruiterApplicationsResponseDTO;
import com.example.Multi_Platform.recruter.entity.Job;
import com.example.Multi_Platform.recruter.entity.Internship;
import com.example.Multi_Platform.recruter.repository.AdJobRepository;
import com.example.Multi_Platform.recruter.repository.InternshipRepository;
import com.example.Multi_Platform.student.repository.ApplicationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RecruiterApplicationService {

    @Autowired
    private AdJobRepository adJobRepository;

    @Autowired
    private InternshipRepository internshipRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private StudentProfileService studentProfileService;

    // ✅ Get all jobs/internships with application count
    public List<OpportunityWithStatsDTO> getAllOpportunitiesWithStats(String recruiterEmail, boolean onlyActive) {
        List<OpportunityWithStatsDTO> result = new ArrayList<>();

        List<Job> jobs = onlyActive
                ? adJobRepository.findByRecruiterEmailAndStatus(recruiterEmail, "ACTIVE")
                : adJobRepository.findByRecruiterEmail(recruiterEmail);

        for (Job job : jobs) {
            int appCount = applicationRepository.findByJobId(job.getId()).size();
            result.add(new OpportunityWithStatsDTO(
                    job.getId(),
                    job.getTitle(),
                    "JOB",
                    job.getStatus(),
                    appCount
            ));
        }

        List<Internship> internships = onlyActive
                ? internshipRepository.findByRecruiterEmailAndStatus(recruiterEmail, "ACTIVE")
                : internshipRepository.findByRecruiterEmail(recruiterEmail);

        for (Internship internship : internships) {
            int appCount = applicationRepository.findByJobId(internship.getId()).size();
            result.add(new OpportunityWithStatsDTO(
                    internship.getId(),
                    internship.getTitle(),
                    "INTERNSHIP",
                    internship.getStatus(),
                    appCount
            ));
        }

        return result;
    }

    // ✅ Get all applications received by recruiter (job + internship)
    public List<RecruiterApplicationsResponseDTO> getAllApplicationsForRecruiter(String recruiterEmail) {
        List<Application> applications = applicationRepository.findAll();

        List<RecruiterApplicationsResponseDTO> result = new ArrayList<>();

        for (Application app : applications) {
            byte[] resumeBytes = null;
            try {
                Resource resumeResource = studentProfileService.getResumeByEmail(app.getStudentEmail());
                resumeBytes = resumeResource.getInputStream().readAllBytes();
            } catch (Exception e) {
                // Optional: log or handle missing resume
                resumeBytes = null;
            }
            result.add(new RecruiterApplicationsResponseDTO(
                    app.getId(),
                    app.getStudentName(),
                    app.getStudentEmail(),
                    app.getResumeLink(),
                    app.getJobTitle(),
                    app.getType(),
                    app.getStatus(),
                    resumeBytes
            ));
        }

        return result;
    }

    public Application updateApplicationStatus(Long applicationId, String status) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found with ID: " + applicationId));

        if (!status.equalsIgnoreCase("Shortlisted") && !status.equalsIgnoreCase("Rejected")) {
            throw new IllegalArgumentException("Invalid status. Only 'Shortlisted' or 'Rejected' are allowed.");
        }

        application.setStatus(status);
        return applicationRepository.save(application);
    }


}
