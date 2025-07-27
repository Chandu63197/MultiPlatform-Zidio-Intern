package com.example.Multi_Platform.Student.service;

import com.example.Multi_Platform.recruter.entity.InternshipEntity;
import com.example.Multi_Platform.recruter.repository.InternshipRepositoryCustom;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InternshipServiceCustom {

  @Autowired
  private static InternshipRepositoryCustom internshipRepo;

  public static List<InternshipEntity> getAllInternships() {
    return internshipRepo.findAll();
  }

  public Optional<InternshipEntity> getInternshipById(Long id) {
    return internshipRepo.findById(id);
  }
}
