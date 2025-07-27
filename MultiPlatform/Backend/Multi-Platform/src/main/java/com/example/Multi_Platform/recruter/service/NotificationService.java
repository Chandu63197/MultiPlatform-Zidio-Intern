package com.example.Multi_Platform.student.service;

import com.example.Multi_Platform.student.entity.Notification;
import com.example.Multi_Platform.student.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class NotificationService {

  @Autowired
  private NotificationRepository notificationRepository;

  public void createNotification(String type, String title, String message) {
    Notification notification = new Notification();
    notification.setType(type);
    notification.setTitle(title);
    notification.setMessage(message);
    notification.setCreatedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
    notificationRepository.save(notification);
  }

  public List<Notification> getAllStudentNotifications() {
    return notificationRepository.findByRecipientTypeOrderByIdDesc("student");
  }
}
