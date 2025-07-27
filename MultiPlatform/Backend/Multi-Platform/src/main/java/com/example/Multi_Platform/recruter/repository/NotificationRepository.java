package com.example.Multi_Platform.student.repository;

import com.example.Multi_Platform.student.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
  List<Notification> findByRecipientTypeOrderByIdDesc(String recipientType);
}
