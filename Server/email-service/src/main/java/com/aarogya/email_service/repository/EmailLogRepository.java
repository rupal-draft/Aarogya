package com.aarogya.email_service.repository;

import com.aarogya.email_service.enums.EmailStatus;
import com.aarogya.email_service.enums.EmailType;
import com.aarogya.email_service.model.EmailLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EmailLogRepository extends MongoRepository<EmailLog, String> {

    Page<EmailLog> findByRecipientEmailOrderByCreatedAtDesc(String recipientEmail, Pageable pageable);

    Page<EmailLog> findByRecipientEmailAndEmailTypeOrderByCreatedAtDesc(String recipientEmail, EmailType type, Pageable pageable);

    Page<EmailLog> findByStatusOrderByCreatedAtDesc(EmailStatus status, Pageable pageable);

    Page<EmailLog> findByEmailTypeOrderByCreatedAtDesc(EmailType emailType, Pageable pageable);

    List<EmailLog> findByStatusAndRetryCountLessThan(EmailStatus status, Integer retryLimit);

    long countByRecipientEmail(String recipientEmail);

    long countByRecipientEmailAndStatus(String recipientEmail, EmailStatus status);

    long countByRecipientEmailAndEmailType(String recipientEmail, EmailType type);

    @Query("{'recipientEmail': ?0, 'createdAt': {'$gte': ?1, '$lte': ?2}}")
    long countByRecipientEmailAndCreatedAtBetween(String recipientEmail, LocalDateTime start, LocalDateTime end);


    @Query("{'recipientEmail': ?0, 'emailType': ?1, 'createdAt': {'$gte': ?2}}")
    List<EmailLog> findRecentEmailsByRecipientAndType(String recipientEmail, EmailType emailType, LocalDateTime since);

    long countByRecipientEmailAndCreatedAtAfter(String recipientEmail, LocalDateTime from);

    long countByRecipientEmailAndStatusAndCreatedAtAfter(String recipientEmail, EmailStatus status, LocalDateTime from);

    long countByRecipientEmailAndEmailTypeAndCreatedAtAfter(String recipientEmail, EmailType type, LocalDateTime from);

    @Query("{ 'recipientEmail': ?0, 'emailType': { $in: ?1 }, 'createdAt': { $gte: ?2 } }")
    long countAppointmentEmailsByUserAndDate(String userEmail, List<EmailType> types, LocalDateTime from);

}

