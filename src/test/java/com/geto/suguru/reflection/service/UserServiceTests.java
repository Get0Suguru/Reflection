package com.geto.suguru.reflection.service;

import com.geto.suguru.reflection.model.User;
import com.geto.suguru.reflection.payload.UserRequest;
import com.geto.suguru.reflection.repo.UserRepo;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ArgumentsSource;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.repository.query.Param;

import java.util.Locale;

import static org.junit.jupiter.api.Assertions.*;

@Disabled
@SpringBootTest
public class UserServiceTests {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private UserService userService;

    @Test
    @Disabled
    public void testFindByUsername(){
        User user = userRepo.findByUsername("kalia");
        assertNotNull(user);
        assertTrue(user.getJournals().isEmpty());
    }

    @ParameterizedTest
    @CsvSource({
            "kalia",
            "naag",
            "ram"
    })
    public void testFindByUsername2(String username){
        User user = userRepo.findByUsername(username);
        assertNotNull(user, "shit got fucked for the name : "+ username);
        assertTrue(user.getJournals().isEmpty());
    }

    // for single value we use @VAlueSource

    // for custom class we use @ArugmentSource

    @ParameterizedTest
    @ArgumentsSource(UserArgumentProvider.class)                      // wants a ArgumentProvider
    public void testDatabaseFeeder(UserRequest user){

        assertTrue(userService.createNewUser(user));        // if true comes test pass if not test fails
        // for our case if new user created -> return true -> test passes

    }

}
