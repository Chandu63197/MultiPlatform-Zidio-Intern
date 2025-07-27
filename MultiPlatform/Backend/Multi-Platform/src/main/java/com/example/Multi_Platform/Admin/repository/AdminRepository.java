package com.example.Multi_Platform.admin.repository;

import com.example.Multi_Platform.admin.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Admin, String> {
  boolean existsByEmail(String email);

  Admin findByEmail(String email);
}
