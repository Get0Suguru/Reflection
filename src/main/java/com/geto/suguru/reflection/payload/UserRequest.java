package com.geto.suguru.reflection.payload;

import com.geto.suguru.reflection.model.ERole;
import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserRequest {

    @NonNull
    private String username;

    @NonNull
    private String password;


    private List<ERole> role;
}
