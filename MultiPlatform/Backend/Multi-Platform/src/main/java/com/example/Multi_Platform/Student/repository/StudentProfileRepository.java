package com.example.Multi_Platform.repository;

import com.example.Multi_Platform.model.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {
  List<StudentProfile> findAllByEmail(String email);


}
