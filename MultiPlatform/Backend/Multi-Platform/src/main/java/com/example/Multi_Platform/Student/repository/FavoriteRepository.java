package com.example.Multi_Platform.student.repository;

import com.example.Multi_Platform.student.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
  List<Favorite> findByStudentEmail(String studentEmail);

  boolean existsByStudentEmailAndInternshipId(String studentEmail, Long internshipId);

  Optional<Favorite> findByStudentEmailAndInternshipId(String studentEmail, Long internshipId);
}
