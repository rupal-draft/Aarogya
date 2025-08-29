package com.aarogya.prescription_service.repository;

import com.aarogya.prescription_service.model.MedicineInteraction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MedicineInteractionRepository extends MongoRepository<MedicineInteraction, String> {

    @Query("{$or: ["
            + "{'drug1': ?0, 'drug2': ?1}, "
            + "{'drug1': ?1, 'drug2': ?0}"
            + "]}")
    Optional<MedicineInteraction> findInteractionBetweenDrugs(String drug1, String drug2);

    @Query("{'$or': [{'drug1': {'$in': ?0}}, {'drug2': {'$in': ?0}}]}")
    List<MedicineInteraction> findInteractionsForDrugs(List<String> drugNames);
}
