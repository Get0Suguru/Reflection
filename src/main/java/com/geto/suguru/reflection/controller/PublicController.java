package com.geto.suguru.reflection.controller;

import com.geto.suguru.reflection.model.User;
import com.geto.suguru.reflection.payload.UserRequest;
import com.geto.suguru.reflection.repo.JournalRepo;
import com.geto.suguru.reflection.repo.UserRepo;
import com.geto.suguru.reflection.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    private UserRepo userRepo;
    private JournalRepo journalRepo;
    public UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public PublicController(UserRepo userRepo, JournalRepo journalRepo, UserService userService) {
        this.userRepo = userRepo;
        this.journalRepo = journalRepo;
        this.userService = userService;
    }

    @GetMapping("/health")
    public String healthCheck() {
        return "all ok";
    }

    @PostMapping("/create")                 //jakarta will do the json to object creation
    public ResponseEntity<String> createUser(@RequestBody UserRequest userinfo) {
        try {
            // Validate input
            if (userinfo.getUsername() == null || userinfo.getUsername().trim().isEmpty()) {
                return new ResponseEntity<>("Username is required", HttpStatus.BAD_REQUEST);
            }
            if (userinfo.getPassword() == null || userinfo.getPassword().trim().isEmpty()) {
                return new ResponseEntity<>("Password is required", HttpStatus.BAD_REQUEST);
            }
            userService.createNewUser(userinfo);
            return new ResponseEntity<>("User Created Successfully", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to create user: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody UserRequest loginInfo) {
        try {
            if (loginInfo.getUsername() == null || loginInfo.getUsername().trim().isEmpty()) {
                return new ResponseEntity<>("enter username first", HttpStatus.BAD_REQUEST);
            }
            if (loginInfo.getPassword() == null || loginInfo.getPassword().trim().isEmpty()) {
                return new ResponseEntity<>("password can't be null", HttpStatus.BAD_REQUEST);
            }
            User user = userRepo.findByUsername(loginInfo.getUsername());
            if (user == null) {
                return new ResponseEntity<>("user not found", HttpStatus.NOT_FOUND);
            }
            boolean passwordMatches = passwordEncoder.matches(loginInfo.getPassword(), user.getPassword());
            if (!passwordMatches) {
                return new ResponseEntity<>("wrong password", HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity<>("login successful welcome " + user.getUsername(), HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>("something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
