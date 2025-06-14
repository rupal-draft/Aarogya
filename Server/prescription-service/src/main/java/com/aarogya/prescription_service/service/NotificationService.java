package com.aarogya.prescription_service.service;

import com.aarogya.prescription_service.dto.DrugInteractionDTO;
import com.aarogya.prescription_service.dto.PrescriptionDTO;
import com.aarogya.prescription_service.model.MedicineInventory;
import com.aarogya.prescription_service.model.Prescription;

public interface NotificationService {

    void sendPrescriptionCreatedNotification(PrescriptionDTO prescription);

    void sendPrescriptionUpdatedNotification(PrescriptionDTO prescription);

    void sendPrescriptionDispensedNotification(Prescription prescription);

    void sendDrugInteractionAlert(String patientId, DrugInteractionDTO interaction);

    void sendLowStockNotification(MedicineInventory medicine);

    void sendMedicineExpiredNotification(MedicineInventory medicine);

    void sendMedicineReorderNotification(MedicineInventory medicine);

    void sendRefillReminderNotification(String patientId, PrescriptionDTO prescription);

    void sendFollowUpReminderNotification(String doctorId, PrescriptionDTO prescription);
}
