package com.example.Multi_Platform.Student.controller;

import com.example.Multi_Platform.entity.users;
import com.example.Multi_Platform.recruter.entity.Internship;
import com.example.Multi_Platform.recruter.service.InternshipService;
import com.example.Multi_Platform.repository.UsersRepo;
import com.example.Multi_Platform.student.dto.InternshipApplicationDTO;
import com.example.Multi_Platform.Student.entity.Application;
import com.example.Multi_Platform.student.entity.Favorite;
import com.example.Multi_Platform.student.repository.FavoriteRepository;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/student")
public class StudentInternshipController {

  @Autowired
  private InternshipService internshipService;

  @Autowired
  private com.example.Multi_Platform.student.repository.ApplicationRepository applicationRepository;

  @Autowired
  private FavoriteRepository favoriteRepository;
  @Autowired
  private UsersRepo usersRepo;

  @GetMapping("/internships")
  public List<Internship> getAllInternshipsForStudents() {
    return internshipService.getAllInternships();
  }

  @PostMapping("/apply-internship")
  public ResponseEntity<?> applyForInternship(
          @RequestBody Application application,
          Authentication authentication,
          HttpServletRequest request) {

    String studentEmail = getAuthenticatedEmail(authentication, request);
    if (studentEmail == null) {
      return ResponseEntity.status(401).body("Unauthorized: Please login to apply for an internship.");
    }

    // 🔹 Fetch full user profile using email
    Optional<users> userOpt = usersRepo.findByEmail(studentEmail);
    if (userOpt.isEmpty()) {
      return ResponseEntity.status(404).body("User profile not found.");
    }

    users user = userOpt.get();
    String studentName = user.getFirstName() + (user.getLastName() != null ? " " + user.getLastName() : "");

    application.setStudentEmail(studentEmail);
    application.setStudentName(studentName.trim());
    application.setJobType("internship");
    application.setType("internship");

    Optional<Internship> internshipOpt = internshipService.getInternshipById(application.getJobId());
    if (internshipOpt.isPresent()) {
      application.setJobTitle(internshipOpt.get().getTitle());
    }
    boolean alreadyApplied = applicationRepository.existsByJobIdAndStudentEmail(application.getJobId(), studentEmail);
    if (alreadyApplied) {
      return ResponseEntity.badRequest().body("You have already applied for this internship.");
    }

    applicationRepository.save(application);
    return ResponseEntity.ok("Internship application submitted successfully.");
  }

  private String getAuthenticatedEmail(Authentication authentication, HttpServletRequest request) {
    if (authentication != null && authentication.getName() != null) {
      return authentication.getName();
    }
    return null;
  }


  @GetMapping("/internship-applications")
  public ResponseEntity<?> getInternshipApplications(
          Authentication authentication,
          HttpServletRequest request) {

    String studentEmail = getAuthenticatedEmail(authentication, request);
    if (studentEmail == null) {
      return ResponseEntity.status(401).body("Unauthorized: Please login to view your internship applications.");
    }

    List<Application> applications = applicationRepository.findByStudentEmail(studentEmail).stream()
            .filter(app -> "internship".equalsIgnoreCase(app.getJobType()))
            .collect(Collectors.toList());

    List<InternshipApplicationDTO> result = applications.stream()
            .map(app -> {
              var internship = internshipService.getInternshipById(app.getJobId()).orElse(null);
              return new InternshipApplicationDTO(app, internship);
            })
            .collect(Collectors.toList());

    return ResponseEntity.ok(result);
  }

  @DeleteMapping("/internship-applications/{id}")
  public ResponseEntity<?> deleteInternshipApplication(
          @PathVariable Long id,
          Authentication authentication,
          HttpServletRequest request) {

    String studentEmail = getAuthenticatedEmail(authentication, request);
    if (studentEmail == null) {
      return ResponseEntity.status(401).body("Unauthorized: Please login to delete internship application.");
    }

    return applicationRepository.findById(id)
            .map(application -> {
              if (!application.getStudentEmail().equals(studentEmail)) {
                return ResponseEntity.status(403).body("Forbidden: You cannot delete someone else's application.");
              }
              applicationRepository.deleteById(id);
              return ResponseEntity.ok("Internship application deleted successfully.");
            })
            .orElse(ResponseEntity.status(404).body("Application not found."));
  }

  @PreAuthorize("hasRole('STUDENT')")
  @PostMapping("/favorites/{internshipId}")
  public ResponseEntity<?> addFavorite(
          @PathVariable Long internshipId,
          Authentication authentication,
          HttpServletRequest request) {

    String studentEmail = getAuthenticatedEmail(authentication, request);
    if (studentEmail == null) {
      return ResponseEntity.status(401).body("Unauthorized");
    }

    if (favoriteRepository.existsByStudentEmailAndInternshipId(studentEmail, internshipId)) {
      return ResponseEntity.badRequest().body("Internship already favorited.");
    }

    Favorite favorite = new Favorite(null, studentEmail, internshipId);
    favoriteRepository.save(favorite);
    return ResponseEntity.ok("Internship favorited.");
  }

  @DeleteMapping("/favorites/{internshipId}")
  public ResponseEntity<?> removeFavorite(
          @PathVariable Long internshipId,
          Authentication authentication,
          HttpServletRequest request) {

    String studentEmail = getAuthenticatedEmail(authentication, request);
    if (studentEmail == null) {
      return ResponseEntity.status(401).body("Unauthorized");
    }

    return favoriteRepository.findByStudentEmailAndInternshipId(studentEmail, internshipId)
            .map(fav -> {
              favoriteRepository.delete(fav);
              return ResponseEntity.ok("Removed from favorites.");
            })
            .orElse(ResponseEntity.status(404).body("Favorite not found."));
  }

  @GetMapping("/favorites")
  public ResponseEntity<?> getFavorites(
          Authentication authentication,
          HttpServletRequest request) {

    String studentEmail = getAuthenticatedEmail(authentication, request);
    if (studentEmail == null) {
      return ResponseEntity.status(401).body("Unauthorized");
    }

    List<Favorite> favorites = favoriteRepository.findByStudentEmail(studentEmail);
    List<Internship> favoritedInternships = favorites.stream()
            .map(fav -> internshipService.getInternshipById(fav.getInternshipId()).orElse(null))
            .filter(i -> i != null)
            .collect(Collectors.toList());

    return ResponseEntity.ok(favoritedInternships);
  }


}
