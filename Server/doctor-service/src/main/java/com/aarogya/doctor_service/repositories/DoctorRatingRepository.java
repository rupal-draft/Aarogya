package com.aarogya.doctor_service.repositories;

import com.aarogya.doctor_service.models.DoctorRating;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRatingRepository extends MongoRepository<DoctorRating, String> {

    List<DoctorRating> findByDoctorId(String doctorId);

    Optional<DoctorRating> findByDoctorIdAndPatientIdAndAppointmentId(String doctorId, String patientId, String appointmentId);

    @Aggregation(pipeline = {
            "{ $match: { doctorId: ?0 } }",
            "{ $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 }, fiveStarCount: { $sum: { $cond: [ { $eq: ['$rating', 5] }, 1, 0 ] } } } }"
    })
    RatingStats getRatingStatsByDoctorId(String doctorId);

    interface RatingStats {
        Double getAvgRating();
        Integer getCount();
        Integer getFiveStarCount();
    }
}
