package com.example.Multi_Platform.recruter.repository;

import com.example.Multi_Platform.recruter.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdJobRepository extends JpaRepository<Job, Long> {
    List<Job> findByRecruiterEmail(String recruiterEmail);
    List<Job> findByRecruiterEmailAndStatus(String recruiterEmail, String status);
}
