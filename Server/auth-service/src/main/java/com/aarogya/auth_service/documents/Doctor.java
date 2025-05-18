package com.aarogya.auth_service.documents;

import com.aarogya.auth_service.documents.enums.Specialization;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "doctors")
@CompoundIndex(def = "{'email': 1, 'specialization': 1, 'licenseNumber': 1}", unique = true)
public class Doctor {

    @Id
    private String id;

    @Email
    @NotBlank
    @Indexed(unique = true)
    private String email;

    @NotBlank
    private String password;

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @NotBlank
    private Specialization specialization;

    @NotBlank
    @Indexed(unique = true)
    private String licenseNumber;

    @Min(0)
    private Integer experienceYears;

    @Pattern(regexp = "\\+?[0-9]{7,15}", message = "Invalid phone number")
    private String phone;

    private String address;

    private String imageUrl;

    @CreatedDate
    private LocalDateTime createdAt;
}

