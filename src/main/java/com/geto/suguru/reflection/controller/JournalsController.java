package com.geto.suguru.reflection.controller;

import com.geto.suguru.reflection.exception.JournalException;
import com.geto.suguru.reflection.model.Journal;
import com.geto.suguru.reflection.service.JournalService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/journals")
public class JournalsController {

    @Autowired
    private JournalService journalService;

    // get all journals | by username
    @GetMapping("/all")
    public ResponseEntity<List<Journal>> getAllJournalsOfUser() {
        List<Journal> journals = journalService.getAllJournalsOfUser();
        return new ResponseEntity<>(journals, HttpStatus.ACCEPTED);
    }

    // create journal  (by username)
    @PostMapping("/create")
    public ResponseEntity<String> createJournal(@RequestBody Journal journal) {
        try{
            journalService.createJournal(journal);
            return new ResponseEntity<>("Journal Created Successfully", HttpStatus.CREATED);

        }catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }

    }

    // update by journal id
    @PutMapping("/update/{journalId}")
    public ResponseEntity<?> updateJournalById(@PathVariable("journalId") ObjectId journalId, @RequestBody Journal journal) {
        try{
            journalService.updateJournal(journalId, journal);
            return ResponseEntity.ok("Journal updated");
        }catch (JournalException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }

    }

    // get journal by id
    @GetMapping("/{journalId}")
    public ResponseEntity<?> getJournalById(@PathVariable("journalId") ObjectId journalId) throws JournalException {
        try {
            Journal journal = journalService.getJournalEntryById(journalId);
            return new ResponseEntity<>(journal, HttpStatus.OK);
        }
        catch (JournalException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }

    }

   // delete by journal id   || ref inside parent deleted as well
    @DeleteMapping("/delete/{journalId}")
    public ResponseEntity<?> deleteJournalById(@PathVariable("journalId") ObjectId journalId) throws JournalException {
        try {
            journalService.deleteJournal(journalId);
            return new ResponseEntity<>("Journal Deleted Successfully", HttpStatus.OK);
        }
        catch (JournalException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }




}
