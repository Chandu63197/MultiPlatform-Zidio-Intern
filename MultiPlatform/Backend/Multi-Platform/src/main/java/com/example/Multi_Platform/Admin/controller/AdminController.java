package com.example.Multi_Platform.admin.controller;

import com.example.Multi_Platform.admin.requests.LoginAdminRequest;
import com.example.Multi_Platform.admin.service.AdminService;
import com.example.Multi_Platform.entity.users;
import com.example.Multi_Platform.repository.UsersRepo;
import com.example.Multi_Platform.config.JwtUtil;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admins")
public class AdminController {

  @Autowired
  private AdminService adminService;

  @Autowired
  private UsersRepo usersRepo;

  @Autowired
  private JwtUtil jwtUtil;

  @PostMapping("/login")
  public ResponseEntity<?> loginAdmin(@RequestBody LoginAdminRequest request) {
    if (adminService.loginAdmin(request)) {
      String token = jwtUtil.generateToken(request.getEmail(), "ADMIN");
      return ResponseEntity.ok(new com.example.Multi_Platform.admin.responses.LoginResponse("Login successful", token));
    }
    return ResponseEntity.status(401).body("Invalid credentials");
  }


  @GetMapping("/allUsers")
  public List<users> getAllUsers() {
    return usersRepo.findAll();
  }

  @PutMapping("/updateUser")
  public ResponseEntity<?> updateUser(@RequestBody users updatedUser) {
    Optional<users> existingUserOpt = usersRepo.findByEmail(updatedUser.getEmail());

    if (existingUserOpt.isPresent()) {
      users existingUser = existingUserOpt.get();

      // Update fields with values from updatedUser
      existingUser.setFirstName(updatedUser.getFirstName());
      existingUser.setMiddleName(updatedUser.getMiddleName());
      existingUser.setLastName(updatedUser.getLastName());
      existingUser.setAge(updatedUser.getAge());
      existingUser.setDob(updatedUser.getDob());
      // Update other fields as necessary...

      users savedUser = usersRepo.save(existingUser);
      return ResponseEntity.ok(savedUser);
    } else {
      return ResponseEntity.status(HttpStatus.NOT_FOUND)
          .body("User not found with email: " + updatedUser.getEmail());
    }
  }




  @DeleteMapping("/deleteUser")
  public ResponseEntity<?> deleteUser(@RequestParam String email) {
    Optional<users> userOpt = usersRepo.findByEmail(email);
    if (userOpt.isPresent()) {
      usersRepo.delete(userOpt.get());
      return ResponseEntity.ok("User deleted successfully.");
    } else {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
    }
  }
  @PutMapping("/change-password")
  public ResponseEntity<?> changePassword(@RequestBody com.example.Multi_Platform.admin.requests.ChangePasswordRequest request) {
    boolean changed = adminService.changePassword(
            request.getEmail(),
            request.getOldPassword(),
            request.getNewPassword()
    );

    if (changed) {
      return ResponseEntity.ok("Password updated successfully.");
    } else {
      return ResponseEntity.status(400).body("Invalid email or old password.");
    }
  }


}


