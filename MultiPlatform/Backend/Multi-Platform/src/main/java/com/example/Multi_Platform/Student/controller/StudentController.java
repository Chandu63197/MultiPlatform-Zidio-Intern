package com.example.Multi_Platform.student.controller;

import com.example.Multi_Platform.config.JwtUtil;
import com.example.Multi_Platform.Student.DTO.ApplicationWithJobDTO;
import com.example.Multi_Platform.recruter.entity.Job;
import com.example.Multi_Platform.recruter.service.JobService;
import com.example.Multi_Platform.Student.entity.Application;
import com.example.Multi_Platform.student.entity.SavedJob;
import com.example.Multi_Platform.student.repository.SavedJobRepository;
import com.example.Multi_Platform.repository.UsersRepo;
import com.example.Multi_Platform.entity.users;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    private static final Logger logger = LoggerFactory.getLogger(StudentController.class);

    @Autowired
    private JobService jobService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private com.example.Multi_Platform.student.repository.ApplicationRepository applicationRepository;

    @Autowired
    private SavedJobRepository savedJobRepository;

    @Autowired
    private UsersRepo usersRepo; // 🔹 Injected UsersRepo to fetch user data

    @GetMapping("/jobs")
    public List<Job> getOpenJobs() {
        return jobService.getAllJobs()
                .stream()
                .filter(job -> "Open".equalsIgnoreCase(job.getStatus()))
                .collect(Collectors.toList());
    }

    @PostMapping("/apply")
    public ResponseEntity<?> applyForJob(@RequestBody Application application, Authentication authentication,
            HttpServletRequest request) {
        String studentEmail = getAuthenticatedEmail(authentication, request);
        if (studentEmail == null) {
            return ResponseEntity.status(401).body("Unauthorized: Please login to apply for a job.");
        }

        // 🔹 Fetch user's name from database
        Optional<users> userOpt = usersRepo.findByEmail(studentEmail);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User profile not found.");
        }

        users user = userOpt.get();
        String studentName = user.getFirstName() + (user.getLastName() != null ? " " + user.getLastName() : "");

        application.setStudentEmail(studentEmail);
        application.setStudentName(studentName.trim());
        application.setJobType("job");
        application.setType("job");

        Optional<Job> jobOpt = jobService.getJobById(application.getJobId());
        if (jobOpt.isPresent()) {
            application.setJobTitle(jobOpt.get().getTitle());
        }

        boolean alreadyApplied = applicationRepository.existsByJobIdAndStudentEmail(application.getJobId(),
                studentEmail);
        if (alreadyApplied) {
            return ResponseEntity.badRequest().body("You have already applied for this job.");
        }

        applicationRepository.save(application);
        return ResponseEntity.ok("Application submitted successfully.");
    }

    @GetMapping("/applications")
    public ResponseEntity<?> getApplications(Authentication authentication, HttpServletRequest request) {
        String studentEmail = getAuthenticatedEmail(authentication, request);
        if (studentEmail == null) {
            return ResponseEntity.status(401).body("Unauthorized: Please login to view your applications.");
        }

        List<Application> applications = applicationRepository
                .findByStudentEmail(studentEmail)
                .stream()
                .filter(app -> "job".equalsIgnoreCase(app.getJobType()))
                .collect(Collectors.toList());

        List<ApplicationWithJobDTO> result = applications.stream()
                .map(app -> {
                    Job job = jobService.getJobById(app.getJobId()).orElse(null);
                    return new ApplicationWithJobDTO(app, job);
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    @Transactional
    @DeleteMapping("/applications/{id}")
    public ResponseEntity<?> cancelApplication(@PathVariable Long id, Authentication authentication,
            HttpServletRequest request) {
        String studentEmail = getAuthenticatedEmail(authentication, request);
        if (studentEmail == null) {
            return ResponseEntity.status(401).body("Unauthorized: Please login to cancel an application.");
        }

        int deletedCount = applicationRepository.deleteByIdAndStudentEmail(id, studentEmail);

        if (deletedCount == 0) {
            boolean exists = applicationRepository.existsById(id);
            if (exists) {
                return ResponseEntity.status(403).body("Unauthorized to delete this application.");
            } else {
                return ResponseEntity.notFound().build();
            }
        }

        return ResponseEntity.ok("Application canceled successfully.");
    }

    @GetMapping("/saved-jobs")
    public ResponseEntity<?> getSavedJobs(Authentication authentication, HttpServletRequest request) {
        String studentEmail = getAuthenticatedEmail(authentication, request);
        if (studentEmail == null) {
            return ResponseEntity.status(401).body("Unauthorized: Please login to view saved jobs.");
        }

        List<SavedJob> savedJobs = savedJobRepository.findByStudentEmail(studentEmail);

        List<Job> savedJobDetails = savedJobs.stream()
                .map(saved -> jobService.getJobById(saved.getJobId()))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toList());

        return ResponseEntity.ok(savedJobDetails);
    }

    @PostMapping("/saved-jobs/{jobId}")
    public ResponseEntity<?> saveJob(@PathVariable Long jobId, Authentication authentication,
            HttpServletRequest request) {
        String studentEmail = getAuthenticatedEmail(authentication, request);
        if (studentEmail == null) {
            return ResponseEntity.status(401).body("Unauthorized: Please login to save jobs.");
        }

        boolean alreadySaved = savedJobRepository.existsByJobIdAndStudentEmail(jobId, studentEmail);
        if (alreadySaved) {
            return ResponseEntity.badRequest().body("Job already saved.");
        }

        SavedJob savedJob = new SavedJob();
        savedJob.setJobId(jobId);
        savedJob.setStudentEmail(studentEmail);
        savedJobRepository.save(savedJob);

        return ResponseEntity.ok("Job saved successfully.");
    }

    @Transactional
    @DeleteMapping("/saved-jobs/{jobId}")
    public ResponseEntity<?> removeSavedJob(@PathVariable Long jobId, Authentication authentication,
            HttpServletRequest request) {
        String studentEmail = getAuthenticatedEmail(authentication, request);
        if (studentEmail == null) {
            return ResponseEntity.status(401).body("Unauthorized: Please login to remove saved jobs.");
        }

        int deletedCount = savedJobRepository.deleteByJobIdAndStudentEmail(jobId, studentEmail);

        if (deletedCount == 0) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok("Saved job removed successfully.");
    }

    private Optional<String> extractEmailFromToken(HttpServletRequest request) {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                if (jwtUtil.isTokenValid(token)) {
                    String email = jwtUtil.extractEmail(token);
                    return Optional.ofNullable(email);
                }
            }
        } catch (Exception e) {
            logger.error("Error extracting email from JWT token", e);
        }
        return Optional.empty();
    }

    private String getAuthenticatedEmail(Authentication authentication, HttpServletRequest request) {
        return extractEmailFromToken(request)
                .orElse(authentication != null ? authentication.getName() : null);
    }
}
