package com.geto.suguru.reflection.repo;

import com.geto.suguru.reflection.model.User;
import lombok.NonNull;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepo extends MongoRepository<User, ObjectId> {

    public User findByUsername(String username);

    void deleteByUsername(@NonNull String username);
}
