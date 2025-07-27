package com.example.Multi_Platform.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class StudentProfile {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(unique = true, nullable = false)
  private String email;
  private String fullName;

  private String mobile;
  private String location;
  private Boolean relocate;
  private String dob;
  private String gender;

  private String tenth;
  private String twelfth;
  private String degree;
  private String degreeCollege;
  private String degreeSpecialization;
  private String degreeYear;
  private String degreeCGPA;

  @ElementCollection
  private List<String> projects;

  @ElementCollection
  private List<String> skills;

  @ElementCollection
  private List<String> internships;

  @ElementCollection
  private List<String> certifications;

  @ElementCollection
  private List<String> achievements;

  private String github;
  private String linkedin;
  private String leetcode;
  private String portfolio;

  @Lob
  private String careerObjective;

  private String resumeName; // file name if uploaded
}
