package com.geto.suguru.reflection.payload;

import com.geto.suguru.reflection.model.ERole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {

    @NonNull
    private String username;

    @NonNull
    private List<ERole> role;
}
