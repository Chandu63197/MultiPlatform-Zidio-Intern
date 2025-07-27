package com.example.Multi_Platform.service;

import com.example.Multi_Platform.entity.users;
import com.example.Multi_Platform.repository.UsersRepo;
import com.example.Multi_Platform.requests.LoginRequests;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class userService {

    @Autowired
    UsersRepo usersRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public users addUser(users user) {
        user.setPassword(passwordEncoder.encode(user.getPassword())); // Encode before saving
        return usersRepo.save(user);
    }

    // This method can be removed if you don't use it, login is handled in getUser()
    public Boolean loginUser(LoginRequests loginRequests) {
        Optional<users> user = usersRepo.findByEmail(loginRequests.getUserId());

        if (!user.isPresent()) {
            return false;
        }

        users user1 = user.get();
        // Correct comparison using passwordEncoder.matches
        return passwordEncoder.matches(loginRequests.getPassword(), user1.getPassword());
    }

    public Optional<users> getUser(LoginRequests loginRequests) {
        Optional<users> userOptional = usersRepo.findByEmail(loginRequests.getEmail()); // email not userId

        if (userOptional.isPresent()) {
            users user = userOptional.get();

            if (passwordEncoder.matches(loginRequests.getPassword(), user.getPassword())) {
                return Optional.of(user);
            }
        }

        return Optional.empty();
    }

}
