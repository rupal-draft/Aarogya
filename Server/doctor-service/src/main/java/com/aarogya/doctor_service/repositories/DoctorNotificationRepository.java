package com.aarogya.doctor_service.repositories;

import com.aarogya.doctor_service.models.DoctorNotification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DoctorNotificationRepository extends MongoRepository<DoctorNotification, String> {

    Page<DoctorNotification> findByDoctorIdOrderByCreatedAtDesc(String doctorId, Pageable pageable);

    Page<DoctorNotification> findByDoctorIdAndReadOrderByCreatedAtDesc(String doctorId, boolean read, Pageable pageable);

    List<DoctorNotification> findByDoctorIdAndCreatedAtAfterOrderByCreatedAtDesc(String doctorId, LocalDateTime since);

    long countByDoctorIdAndRead(String doctorId, boolean read);
}
