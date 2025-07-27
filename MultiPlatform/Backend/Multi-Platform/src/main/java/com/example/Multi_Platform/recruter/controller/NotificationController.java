package com.example.Multi_Platform.student.controller;

import com.example.Multi_Platform.student.entity.Notification;
import com.example.Multi_Platform.student.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student")
public class NotificationController {

  @Autowired
  private NotificationService notificationService;

  @GetMapping("/notifications")
  public List<Notification> getNotifications() {
    return notificationService.getAllStudentNotifications();
  }
}
