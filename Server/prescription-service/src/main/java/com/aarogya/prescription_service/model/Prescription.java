package com.aarogya.prescription_service.model;

import com.aarogya.prescription_service.enums.PrescriptionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "prescriptions")
@CompoundIndex(def = "{'appointmentId': 1, 'patientId': 1, 'doctorId': 1}")
@CompoundIndex(name = "doctor_created_idx", def = "{'doctorId': 1, 'createdAt': -1}")
@CompoundIndex(name = "doctor_meds_idx", def = "{'doctorId': 1, 'medicines.medicineId': 1}")
public class Prescription {
    @Id
    private String id;

    @Indexed
    private String appointmentId;

    @Indexed
    private String patientId;

    @Indexed
    private String doctorId;

    private List<PrescribedMedicine> medicines;
    private String diagnosis;
    private String notes;
    private PrescriptionStatus status;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Version
    private Long version;

    public void addMedicine(PrescribedMedicine medicine) {
        if (this.medicines == null) {
            this.medicines = new ArrayList<>();
        }
        this.medicines.add(medicine);
    }

    public void removeMedicine(String medicineId) {
        if (this.medicines != null) {
            this.medicines.removeIf(med -> med.getMedicineId().equals(medicineId));
        }
    }
}

