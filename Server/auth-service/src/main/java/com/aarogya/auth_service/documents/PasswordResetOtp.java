package com.aarogya.auth_service.documents;

import com.aarogya.auth_service.documents.enums.Role;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "password_otps")
@CompoundIndex(def = "{'email': 1, 'otp': 1}", unique = true)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PasswordResetOtp {

    @Id
    private String id;

    private String email;
    private String otp;

    private Role role;
    private LocalDateTime createdAt = LocalDateTime.now();

    public boolean isExpired() {
        return createdAt.plusMinutes(10).isBefore(LocalDateTime.now());
    }
}

