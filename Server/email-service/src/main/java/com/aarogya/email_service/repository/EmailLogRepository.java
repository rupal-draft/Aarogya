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

    Page<EmailLog> findByStatusOrderByCreatedAtDesc(EmailStatus status, Pageable pageable);

    Page<EmailLog> findByEmailTypeOrderByCreatedAtDesc(EmailType emailType, Pageable pageable);

    List<EmailLog> findByStatusAndRetryCountLessThanMaxRetries(EmailStatus status, Integer maxRetries);

    long countByStatus(EmailStatus status);

    long countByEmailType(EmailType emailType);

    @Query("{'createdAt': {'$gte': ?0, '$lte': ?1}}")
    long countByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    @Query("{'status': ?0, 'createdAt': {'$gte': ?1, '$lte': ?2}}")
    long countByStatusAndCreatedAtBetween(EmailStatus status, LocalDateTime startDate, LocalDateTime endDate);

    @Query("{'recipientEmail': ?0, 'emailType': ?1, 'createdAt': {'$gte': ?2}}")
    List<EmailLog> findRecentEmailsByRecipientAndType(String recipientEmail, EmailType emailType, LocalDateTime since);
}

