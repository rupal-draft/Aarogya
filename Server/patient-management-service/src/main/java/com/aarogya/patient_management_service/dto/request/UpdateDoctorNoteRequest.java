package com.aarogya.patient_management_service.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateDoctorNoteRequest {

    private String noteType;
    private String title;
    private String content;
    private String category;
    private String priority;
    private Boolean isPrivate;
    private Boolean isUrgent;
}
