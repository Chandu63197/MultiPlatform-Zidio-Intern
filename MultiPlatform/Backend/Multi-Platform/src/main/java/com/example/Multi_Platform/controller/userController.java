package com.example.Multi_Platform.controller;

import com.example.Multi_Platform.entity.users;
import com.example.Multi_Platform.requests.LoginRequests;
import com.example.Multi_Platform.service.userService;
import com.example.Multi_Platform.config.JwtUtil;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class userController {

    @Autowired
    private userService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/registerUser")
    public users addUser(@RequestBody users user) {
        return userService.addUser(user);
    }

    @PostMapping("/loginUser")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequests loginRequests) {
        Optional<users> userOptional = userService.getUser(loginRequests);
        if (userOptional.isPresent()) {
            users user = userOptional.get();

            String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("token", token);
            responseBody.put("user", user);

            return ResponseEntity.ok(responseBody);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        // JWT logout can be handled on client side
        return ResponseEntity.ok("Logged out successfully");
    }
}
