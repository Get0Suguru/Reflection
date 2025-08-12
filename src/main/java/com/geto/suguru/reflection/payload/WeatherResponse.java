package com.geto.suguru.reflection.payload;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class WeatherResponse {



    private Current current;



    @Data
    public class Current{

        private int temperature;

        @JsonProperty("wind_speed")
        private int windSpeed;

        private int humidity;

        private int feelslike;

    }






}
