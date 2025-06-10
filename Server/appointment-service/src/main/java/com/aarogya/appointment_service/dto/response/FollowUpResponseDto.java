package com.aarogya.appointment_service.dto.response;

import com.aarogya.appointment_service.models.enums.FollowUpStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FollowUpResponseDto {

    private String id;
    private AppointmentResponseDto originalAppointment;
    private LocalDate recommendedDate;
    private String reason;
    private FollowUpStatus status;
    private String notes;
    private Integer urgencyLevel;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
