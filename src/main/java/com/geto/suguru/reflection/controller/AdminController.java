package com.geto.suguru.reflection.controller;

import com.geto.suguru.reflection.payload.UserResponse;
import com.geto.suguru.reflection.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    @GetMapping("/all-users")
    public ResponseEntity<?> getAllUsers(){
        List<UserResponse> users = userService.getAllUser();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

}
