package com.geto.suguru.reflection.controller;

import com.geto.suguru.reflection.payload.UserRequest;
import com.geto.suguru.reflection.repo.JournalRepo;
import com.geto.suguru.reflection.repo.UserRepo;
import com.geto.suguru.reflection.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    private UserRepo userRepo;
    private JournalRepo journalRepo;
    public UserService userService;

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
        userService.createNewUser(userinfo);
        return new ResponseEntity<>("User Created Successfully", HttpStatus.CREATED);
    }
}
