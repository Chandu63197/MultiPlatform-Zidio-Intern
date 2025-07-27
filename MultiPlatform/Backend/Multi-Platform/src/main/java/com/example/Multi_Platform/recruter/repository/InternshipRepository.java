package com.example.Multi_Platform.recruter.repository;

import com.example.Multi_Platform.recruter.entity.Internship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InternshipRepository extends JpaRepository<Internship, Long> {
    List<Internship> findByRecruiterEmail(String recruiterEmail);
    List<Internship> findByRecruiterEmailAndStatus(String recruiterEmail, String status);
}
