package com.geto.suguru.reflection.service;

import com.geto.suguru.reflection.model.ERole;
import com.geto.suguru.reflection.model.User;
import com.geto.suguru.reflection.payload.UserRequest;
import com.geto.suguru.reflection.payload.UserResponse;
import com.geto.suguru.reflection.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User findByUsername(String username){
        return userRepo.findByUsername(username);
    }


    public boolean createNewUser(UserRequest userInfo) {

        try{
            User user = new User();
            user.setUsername(userInfo.getUsername());
            user.setPassword(passwordEncoder.encode(userInfo.getPassword()));
            if(userInfo.getRole() == null || userInfo.getRole().isEmpty()){
                user.setRole(List.of(ERole.ROLE_USER));
            }else {
                user.setRole(userInfo.getRole());
            }
            userRepo.save(user);
        }catch (Exception e){
            return false;
        }
        return true;
    }

    public void updateUserInfo(UserRequest newInfo) {
        // we find the entity by username and then update it
        String username = getUsernameFromSecurityContext();
        User userInDb= userRepo.findByUsername(username);
        if(userInDb != null){
            userInDb.setUsername(newInfo.getUsername());
            userInDb.setPassword(passwordEncoder.encode(newInfo.getPassword()));
            userRepo.save(userInDb);
        }
        else {
            throw new RuntimeException("User not found | please recheck the entered username");
        }
    }

    public void deleteUser() {
        String username = getUsernameFromSecurityContext();
        userRepo.deleteByUsername(username);

    }

    public List<UserResponse> getAllUser() {
        List<User> users = userRepo.findAll();
        return users.stream().map(user -> new UserResponse(user.getUsername(), user.getRole())).toList();
    }

//    helper  methods -------------------------------------------------------------------------------------------------

    public String getUsernameFromSecurityContext() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }
}
