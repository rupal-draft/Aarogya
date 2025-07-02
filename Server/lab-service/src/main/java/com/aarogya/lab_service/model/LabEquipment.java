package com.aarogya.lab_service.model;

import com.aarogya.lab_service.enums.EquipmentStatus;
import com.aarogya.lab_service.enums.EquipmentType;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Document(collection = "lab_equipment")
public class LabEquipment {

    @Id
    private String id;

    @NotBlank
    @Indexed
    private String name;

    @NotBlank
    @Indexed(unique = true)
    private String serialNumber;

    private String manufacturer;

    private String model;

    private EquipmentType type;

    private EquipmentStatus status = EquipmentStatus.ACTIVE;

    private String location;

    private LocalDate purchaseDate;

    private LocalDate warrantyExpiry;

    private LocalDate lastMaintenanceDate;

    private LocalDate nextMaintenanceDate;

    private List<String> supportedTests;

    private Map<String, Object> specifications;

    private String operatingInstructions;

    private List<MaintenanceRecord> maintenanceHistory;

    private String assignedTechnician;

    private Boolean isCalibrated = true;

    private LocalDateTime lastCalibrationDate;

    private LocalDateTime nextCalibrationDate;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @AllArgsConstructor
    @NoArgsConstructor
    @Data
    public static class MaintenanceRecord {
        private LocalDate date;
        private String type;
        private String description;
        private String performedBy;
        private String cost;
        private String nextMaintenanceDate;
    }
}
