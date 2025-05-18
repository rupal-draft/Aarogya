package com.aarogya.auth_service.documents;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "patients")
@CompoundIndex(def = "{'email': 1, 'gender': 1}", unique = true)
public class Patient {

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

    @NotNull
    private LocalDate dateOfBirth;

    @Pattern(regexp = "^(Male|Female|Other)?$", message = "Gender must be Male, Female, or Other")
    private String gender;

    @Pattern(regexp = "^(A|B|AB|O)[+-]?$", message = "Invalid blood group")
    private String bloodGroup;

    @Pattern(regexp = "\\+?[0-9]{7,15}", message = "Invalid phone number")
    private String phone;

    private String address;
    private String imageUrl;

    private String emergencyContact;

    @Pattern(regexp = "\\+?[0-9]{7,15}", message = "Invalid emergency phone number")
    private String emergencyPhone;

    @CreatedDate
    private LocalDateTime createdAt;
}
