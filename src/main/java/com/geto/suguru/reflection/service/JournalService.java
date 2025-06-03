package com.geto.suguru.reflection.service;

import ch.qos.logback.core.joran.spi.JoranException;
import com.geto.suguru.reflection.exception.JournalException;
import com.geto.suguru.reflection.model.Journal;
import com.geto.suguru.reflection.model.User;
import com.geto.suguru.reflection.repo.JournalRepo;
import com.geto.suguru.reflection.repo.UserRepo;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class JournalService {

    @Autowired
    private JournalRepo journalRepo;

    @Autowired
    private UserRepo userRepo;

    @Transactional
    public void createJournal(Journal journal) {
        try{
            User user = userRepo.findByUsername(getUsernameFromSecurityContext());

            journal.setDate(LocalDate.now());
            journalRepo.save(journal);                      // to save the journal inc 2 step ( one in journal and other in user)

            user.getJournals().add(journal);
//            user.setUsername(null);                        // test throw error (by the unique = true) can't be null
            userRepo.save(user);                      // save in the user too (will overwrite the user object)

        } catch (Exception e) {
            System.out.println("Well failed to create journal");
            throw new RuntimeException(e);
        }


    }

    public Journal getJournalEntryById(ObjectId journalId) throws JournalException {
        String username = getUsernameFromSecurityContext();
            List<Journal> allJournals = userRepo.findByUsername(username).getJournals();
            Journal journal = allJournals.stream().filter(j -> j.getId().equals(journalId)).findFirst().orElse(null);
        if(journal != null) {
            return journal;
        }else {
            throw new JournalException("Journal not found");
        }
    }

    @Transactional
    public void deleteJournal(ObjectId journalId) throws JournalException {
        User user = userRepo.findByUsername(getUsernameFromSecurityContext());
        boolean deleted = user.getJournals().removeIf(j -> j.getId().equals(journalId));
        if(deleted) {
            journalRepo.deleteById(journalId);
            userRepo.save(user);
        }else {
            throw new JournalException("Journal not found so nothing is deleted");
        }

    }

    @Transactional
    public void updateJournal(ObjectId journalId, Journal updatedJournal) throws JournalException {

        User targetUser = userRepo.findByUsername(getUsernameFromSecurityContext());

        Journal journalToUpdate = targetUser
                .getJournals().stream()
                .filter(j -> j.getId().equals(journalId))
                .findFirst().orElse(null);

        if(journalToUpdate != null) {
            journalToUpdate.setTitle(updatedJournal.getTitle());
            journalToUpdate.setContent(updatedJournal.getContent());
            journalToUpdate.setDate(LocalDate.now());

            journalRepo.save(journalToUpdate);
        // no need to update user obj coz the object if of journal remains same (and we are using reference of journal not the obj in user)
        }else{
            throw new JournalException("Journal not found");
        }
    }

    public List<Journal> getAllJournalsOfUser() {
        return userRepo.findByUsername(getUsernameFromSecurityContext()).getJournals();

    }

//    helper methods -----------------------------------------------------------

    public String getUsernameFromSecurityContext() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }
}
