package com.example.Multi_Platform.Student.service;

import com.example.Multi_Platform.model.StudentProfile;
import com.example.Multi_Platform.repository.StudentProfileRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@Service
public class StudentProfileService {

  private final StudentProfileRepository repository;

  @Value("${upload.directory}")
  private String uploadDir;

  public StudentProfileService(StudentProfileRepository repository) {
    this.repository = repository;
  }

  public StudentProfile saveOrUpdateProfile(StudentProfile profile) {
    return repository.save(profile);
  }

  public Optional<StudentProfile> getProfileByEmail(String email) {
    List<StudentProfile> profiles = repository.findAllByEmail(email);
    return profiles.stream().findFirst();
  }

  public String saveResume(MultipartFile file, String email) throws IOException {
    if (file == null || file.isEmpty()) {
      throw new IllegalArgumentException("Uploaded file is empty");
    }

    if (uploadDir == null || uploadDir.isBlank()) {
      throw new IllegalStateException("Upload directory is not configured");
    }

    Optional<StudentProfile> optionalProfile = getProfileByEmail(email);
    if (optionalProfile.isEmpty()) {
      throw new IllegalArgumentException("Student profile not found for email: " + email);
    }

    String fileName = System.currentTimeMillis() + "_" + StringUtils.cleanPath(file.getOriginalFilename());
    String userDirPath = uploadDir + File.separator + email;
    File userDir = new File(userDirPath);

    if (!userDir.exists()) {
      if (!userDir.mkdirs()) {
        throw new IOException("Failed to create upload directory: " + userDirPath);
      }
    }

    File destination = new File(userDir, fileName);
    file.transferTo(destination);

    StudentProfile profile = optionalProfile.get();
    profile.setResumeName(fileName);
    repository.save(profile);

    return fileName;
  }
  public Resource getResumeByEmail(String email) {
    Optional<StudentProfile> optionalProfile = getProfileByEmail(email);
    if (optionalProfile.isEmpty()) {
      throw new RuntimeException("Student profile not found for email: " + email);
    }

    StudentProfile profile = optionalProfile.get();
    String fileName = profile.getResumeName();

    if (fileName == null || fileName.isEmpty()) {
      throw new RuntimeException("No resume uploaded for this user.");
    }

    Path resumePath = Paths.get(uploadDir, email, fileName).normalize();
    File file = resumePath.toFile();

    if (!file.exists()) {
      throw new RuntimeException("Resume file not found: " + fileName);
    }

    return new FileSystemResource(file);
  }

}
