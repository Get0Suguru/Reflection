package com.geto.suguru.reflection.model;

import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection =  "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@RequiredArgsConstructor
public class User {

    @Id
    private ObjectId id;


    @NonNull
    @Indexed(unique = true)    // we keep the username unique coz we delete with that too
    private String username;

    @NonNull
    private String password;

    @NonNull
    private List<ERole> role;

    @DBRef
    private List<Journal> journals = new ArrayList<>();
}
