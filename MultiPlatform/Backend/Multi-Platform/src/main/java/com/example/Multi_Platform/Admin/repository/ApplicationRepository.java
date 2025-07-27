package com.example.Multi_Platform.Admin.repository;

import java.util.List;

public interface ApplicationRepository {
    List<com.example.Multi_Platform.Student.entity.Application> findByStudentEmail(String studentEmail);

    boolean existsByJobIdAndStudentEmail(Long jobId, String studentEmail);

    int deleteByIdAndStudentEmail(Long id, String studentEmail);
}