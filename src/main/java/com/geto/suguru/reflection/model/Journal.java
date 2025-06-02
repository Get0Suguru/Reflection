package com.geto.suguru.reflection.model;


import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection  = "journals")
@Data
@NoArgsConstructor
@RequiredArgsConstructor
public class Journal {

    @Id
    private ObjectId id;

    @NonNull
    private String title;

    @NonNull
    private String content;

    private LocalDate date;

}
