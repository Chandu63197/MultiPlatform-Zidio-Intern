package com.example.Multi_Platform.student.repository;

import com.example.Multi_Platform.student.entity.SavedJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {

  List<SavedJob> findByStudentEmail(String studentEmail);

  boolean existsByJobIdAndStudentEmail(Long jobId, String studentEmail);

  int deleteByJobIdAndStudentEmail(Long jobId, String studentEmail);
}
