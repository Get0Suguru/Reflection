package com.geto.suguru.reflection.service;

import com.geto.suguru.reflection.payload.WeatherResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class WeatherService {

    private static final String apiKey = "ef2589b49ea1b042dd560a2ecb2eeaca";

    private static String apiUrl =
            "http://api.weatherstack.com/current?access_key=ACCESS_KEY&query=CITY";

    @Autowired
    private RestTemplate restTemplate;


    public WeatherResponse getWeather(String city){
        String actuallApi = apiUrl.replace("CITY", city).replace("ACCESS_KEY", apiKey);
        ResponseEntity<WeatherResponse> hei = restTemplate.exchange(actuallApi, HttpMethod.GET, null, WeatherResponse.class);
                        // deserialize to weather class  (deserialize means converting json/anything -> pojo (java Object))
        HttpStatusCode statusCode = hei.getStatusCode();
        if(statusCode.is2xxSuccessful()){
            return hei.getBody();
        }else {
            throw new RuntimeException("Failed to fetch weather data");
        }

    }

}


