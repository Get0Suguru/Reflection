package com.geto.suguru.reflection.controller;

import com.geto.suguru.reflection.payload.UserRequest;
import com.geto.suguru.reflection.payload.UserResponse;
import com.geto.suguru.reflection.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UsersController {

    @Autowired
    private UserService userService;

    @GetMapping("/test-auth")
    public ResponseEntity<String> testAuth() {
        return new ResponseEntity<>("Authorized", HttpStatus.OK);
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateUserByUserName(@RequestBody UserRequest userinfo) {
        userService.updateUserInfo(userinfo);
        return new ResponseEntity<>("User Updated Successfully", HttpStatus.OK);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteUser() {
        userService.deleteUser();
        return new ResponseEntity<>("User Deleted Successfully", HttpStatus.OK);

    }


}
