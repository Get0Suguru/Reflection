package com.geto.suguru.reflection;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;

@SpringBootTest
public class TestingRedis {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    @Disabled
    @Test
    public void testRedis(){
        redisTemplate.opsForValue().set("papa", "bhosda");
        Object val = redisTemplate.opsForValue().get("papa");
        System.out.println(val);
        System.out.println(redisTemplate.opsForValue().get("randi"));
    }
}
