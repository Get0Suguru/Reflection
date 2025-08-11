package com.geto.suguru.reflection.service;

import com.geto.suguru.reflection.model.ERole;
import com.geto.suguru.reflection.model.User;
import com.geto.suguru.reflection.repo.UserRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

// with spring context running

//@SpringBootTest
//public class CustomUserDetailsServiceTests {
//
//    @Autowired
//    private CustomUserDetailsService customUserDetailsService;
//
//    @MockitoBean
//    private UserRepo userRepo;
//
//    @Test
//    void testLoadUserByUsername() {
//        when(userRepo.findByUsername(ArgumentMatchers.anyString())).thenReturn(User.builder().username("kalia").password("random").role(List.of(ERole.ROLE_USER)).build());
//
//        UserDetails user = customUserDetailsService.loadUserByUsername("kalia");
//        assertNotNull(user);
//
//    }
//}


// running shit without spring context

@Disabled
public class CustomUserDetailsServiceTests {

    @InjectMocks
    private CustomUserDetailsService customUserDetailsService;

    @Mock
    private UserRepo userRepo;

    @BeforeEach // run before each test buddy
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testLoadUserByUsername() {
        when(userRepo.findByUsername(ArgumentMatchers.anyString())).thenReturn(User.builder().username(null).password("random").role(List.of(ERole.ROLE_USER)).build());

        UserDetails user = customUserDetailsService.loadUserByUsername("kalia");
        assertNotNull(user);

    }
}