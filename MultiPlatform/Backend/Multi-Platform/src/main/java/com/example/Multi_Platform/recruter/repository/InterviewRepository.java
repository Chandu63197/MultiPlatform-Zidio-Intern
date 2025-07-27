package com.example.Multi_Platform.recruter.repository;

import com.example.Multi_Platform.recruter.entity.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {
}
