package com.aarogya.prescription_service.service.implementation;

import com.aarogya.prescription_service.dto.DrugInteractionDTO;
import com.aarogya.prescription_service.dto.PrescriptionDTO;
import com.aarogya.prescription_service.model.Prescription;
import com.aarogya.prescription_service.service.NotificationService;
import org.springframework.stereotype.Service;

@Service
public class NotificationServiceImpl implements NotificationService {
    @Override
    public void sendPrescriptionCreatedNotification(PrescriptionDTO prescription) {

    }

    @Override
    public void sendPrescriptionUpdatedNotification(PrescriptionDTO prescription) {

    }

    @Override
    public void sendPrescriptionDispensedNotification(Prescription prescription) {

    }

    @Override
    public void sendDrugInteractionAlert(String patientId, DrugInteractionDTO interaction) {

    }

    @Override
    public void sendRefillReminderNotification(String patientId, PrescriptionDTO prescription) {

    }

    @Override
    public void sendFollowUpReminderNotification(String doctorId, PrescriptionDTO prescription) {

    }
}
