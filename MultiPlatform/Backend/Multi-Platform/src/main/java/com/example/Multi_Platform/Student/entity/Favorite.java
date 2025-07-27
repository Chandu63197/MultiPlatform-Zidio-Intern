package com.example.Multi_Platform.student.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "favorites", uniqueConstraints = {
    @UniqueConstraint(columnNames = { "studentEmail", "internshipId" })
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Favorite {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String studentEmail;

  private Long internshipId;
}
