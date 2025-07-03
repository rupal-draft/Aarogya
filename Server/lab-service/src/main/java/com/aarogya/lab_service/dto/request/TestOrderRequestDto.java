package com.aarogya.lab_service.dto.request;

import com.aarogya.lab_service.enums.OrderPriority;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TestOrderRequestDto {

    @NotBlank(message = "Patient ID is required")
    private String patientId;

    @NotEmpty(message = "At least one test must be selected")
    private List<@NotBlank String> testIds;

    private OrderPriority priority = OrderPriority.ROUTINE;

    @Size(max = 1000, message = "Clinical history cannot exceed 1000 characters")
    private String clinicalHistory;

    @Size(max = 500, message = "Provisional diagnosis cannot exceed 500 characters")
    private String provisionalDiagnosis;

    @Size(max = 500, message = "Special instructions cannot exceed 500 characters")
    private String specialInstructions;

    private Boolean isHomeCollection = false;

    @Size(max = 500, message = "Collection address cannot exceed 500 characters")
    private String collectionAddress;

    @Future(message = "Preferred collection time must be in the future")
    private LocalDateTime preferredCollectionTime;
}
