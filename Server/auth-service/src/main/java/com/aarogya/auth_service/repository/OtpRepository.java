package com.aarogya.auth_service.repository;

import com.aarogya.auth_service.documents.PasswordResetOtp;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpRepository extends MongoRepository<PasswordResetOtp, String> {

    Optional<PasswordResetOtp> findByEmailAndOtp(String email, String otp);
}
