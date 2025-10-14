package com.aarogya.patient_management_service.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class RecentDoctorNoteDTO {
    private String id;
    private String doctorId;
    private String doctorName;
    private String noteType;
    private String title;
    private String content;
    private String priority;
    private Boolean isPrivate;
    private Boolean isUrgent;
    private LocalDateTime createdAt;
}
