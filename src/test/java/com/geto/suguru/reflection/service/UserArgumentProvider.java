package com.geto.suguru.reflection.service;

import com.geto.suguru.reflection.payload.UserRequest;
import org.junit.jupiter.api.extension.ExtensionContext;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.ArgumentsProvider;
import org.junit.jupiter.params.provider.ArgumentsSource;

import java.util.stream.Stream;

public class UserArgumentProvider implements ArgumentsProvider {

    @Override
    public Stream<? extends Arguments> provideArguments(ExtensionContext context) throws Exception {
        return Stream.of(
                Arguments.of(new UserRequest("kalia", "password")),
                Arguments.of(new UserRequest("naag", "password")),
                Arguments.of(new UserRequest("ram", "password"))
        );
    }
}
