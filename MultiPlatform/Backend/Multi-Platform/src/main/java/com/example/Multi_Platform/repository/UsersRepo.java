package com.example.Multi_Platform.repository;

import com.example.Multi_Platform.entity.users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsersRepo extends JpaRepository<users, String> {
    Optional<users> findByEmail(String email);
}
