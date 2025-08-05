package com.geto.suguru.reflection.service;

import com.geto.suguru.reflection.model.User;
import com.geto.suguru.reflection.model.UserProfile;
import com.geto.suguru.reflection.repo.UserRepo;
import lombok.SneakyThrows;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private UserRepo userRepo;

    public CustomUserDetailsService(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    @SneakyThrows
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepo.findByUsername(username);

        if(user != null) {
            return new UserProfile(user);
        }else{
            throw new UsernameNotFoundException("User not found");
        }
    }
}
