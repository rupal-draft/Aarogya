package com.aarogya.prescription_service.service.implementation;

import com.aarogya.prescription_service.client.AppointmentGrpcClient;
import com.aarogya.prescription_service.client.UserGrpcClient;
import com.aarogya.prescription_service.dto.*;
import com.aarogya.prescription_service.exceptions.BadRequestException;
import com.aarogya.prescription_service.exceptions.ResourceNotFound;
import com.aarogya.prescription_service.exceptions.RuntimeConflict;
import com.aarogya.prescription_service.model.Prescription;
import com.aarogya.prescription_service.model.PrescriptionMedicine;
import com.aarogya.prescription_service.model.enums.PrescriptionStatus;
import com.aarogya.prescription_service.repository.PrescriptionMedicineRepository;
import com.aarogya.prescription_service.repository.PrescriptionRepository;
import com.aarogya.prescription_service.service.DrugInteractionService;
import com.aarogya.prescription_service.service.NotificationService;
import com.aarogya.prescription_service.service.PrescriptionService;
import com.aarogya.prescription_service.util.PrescriptionUtil;
import com.aarogya.prescription_service.util.SignatureUtil;
import com.aarogya.prescription_service.validator.PrescriptionValidator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PrescriptionServiceImpl implements PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final PrescriptionMedicineRepository medicineRepository;
    private final DrugInteractionService drugInteractionService;
    private final UserGrpcClient authServiceClient;
    private final AppointmentGrpcClient appointmentServiceClient;
    private final NotificationService notificationService;
    private final ModelMapper modelMapper;
    private final PrescriptionValidator prescriptionValidator;
    private final PrescriptionUtil prescriptionUtil;
    private final SignatureUtil signatureUtil;

    @Override
    @Transactional
    @CacheEvict(value = {"prescriptions", "doctorPrescriptions", "patientPrescriptions"}, allEntries = true)
    public PrescriptionDTO createPrescription(CreatePrescriptionDTO createPrescriptionDTO) throws Exception {
        log.info("Creating prescription for appointment: {}", createPrescriptionDTO.getAppointmentId());
        prescriptionValidator.validateCreatePrescription(createPrescriptionDTO);

        AppointmentDTO appointment = appointmentServiceClient.getAppointment(createPrescriptionDTO.getAppointmentId());
        if (!appointment.getDoctor().getId().equals(createPrescriptionDTO.getDoctorId())) {
            throw new BadRequestException("Appointment does not belong to this doctor");
        }

        DoctorResponseDTO doctor = authServiceClient.getDoctor(createPrescriptionDTO.getDoctorId());
        PatientResponseDTO patient = authServiceClient.getPatient(appointment.getPatientDetails().getId());

        List<DrugInteractionDTO> interactions = drugInteractionService.checkDrugInteractions(
                patient.getId(), createPrescriptionDTO.getMedicines());

        List<DrugInteractionDTO> criticalInteractions = interactions.stream()
                .filter(i -> "MAJOR".equals(i.getInteractionType()) || "HIGH".equals(i.getSeverity()))
                .collect(Collectors.toList());

        if (!criticalInteractions.isEmpty() && !createPrescriptionDTO.isIgnoreInteractions()) {
            throw new RuntimeConflict("Critical drug interactions detected");
        }

        Prescription prescription = Prescription.builder()
                .appointmentId(createPrescriptionDTO.getAppointmentId())
                .doctorId(createPrescriptionDTO.getDoctorId())
                .patientId(patient.getId())
                .diagnosis(createPrescriptionDTO.getDiagnosis())
                .notes(createPrescriptionDTO.getNotes())
                .status(PrescriptionStatus.ACTIVE)
                .validFrom(LocalDateTime.now())
                .validUntil(createPrescriptionDTO.getValidUntil())
                .followUpInstructions(createPrescriptionDTO.getFollowUpInstructions())
                .nextFollowUp(createPrescriptionDTO.getNextFollowUp())
                .emergencyContact(createPrescriptionDTO.getEmergencyContact())
                .emergencyInstructions(createPrescriptionDTO.getEmergencyInstructions())
                .prescriptionNumber(prescriptionUtil.generatePrescriptionNumber())
                .isElectronic(true)
                .insuranceInfo(createPrescriptionDTO.getInsuranceInfo())
                .patientFirstName(patient.getFirstName())
                .patientLastName(patient.getLastName())
                .patientAge(prescriptionUtil.calculateAge(patient.getDateOfBirth()))
                .patientGender(patient.getGender())
                .doctorFirstName(doctor.getFirstName())
                .doctorLastName(doctor.getLastName())
                .doctorSpecialization(doctor.getSpecialization())
                .doctorLicenseNumber(doctor.getLicenseNumber())
                .build();

        String dataToSign = prescription.getPrescriptionNumber() + "|" +
                prescription.getDoctorId() + "|" +
                prescription.getPatientId() + "|" +
                prescription.getDiagnosis() + "|" +
                prescription.getValidFrom();

        String digitalSignature = signatureUtil.sign(dataToSign);

        prescription.setDigitalSignature(digitalSignature);
        prescription.setVerified(true);

        Prescription savedPrescription = prescriptionRepository.save(prescription);

        List<PrescriptionMedicine> medicines = createPrescriptionDTO.getMedicines().stream()
                .map(medicineDTO -> {
                    PrescriptionMedicine medicine = modelMapper.map(medicineDTO, PrescriptionMedicine.class);
                    medicine.setPrescriptionId(savedPrescription.getId());
                    return medicine;
                })
                .collect(Collectors.toList());

        medicineRepository.saveAll(medicines);

        PrescriptionDTO responseDTO = modelMapper.map(savedPrescription, PrescriptionDTO.class);
        responseDTO.setMedicines(medicines.stream()
                .map(medicine -> modelMapper.map(medicine, PrescriptionMedicineDTO.class))
                .collect(Collectors.toList()));

        notificationService.sendPrescriptionCreatedNotification(responseDTO);

        log.info("Prescription created successfully: {}", savedPrescription.getId());
        return responseDTO;
    }

    @Override
    @Transactional
    @CacheEvict(value = {"prescriptions", "doctorPrescriptions", "patientPrescriptions"}, allEntries = true)
    public PrescriptionDTO updatePrescription(String prescriptionId, UpdatePrescriptionDTO updatePrescriptionDTO) throws Exception {
        log.info("Updating prescription: {}", prescriptionId);
        prescriptionValidator.validateUpdatePrescription(updatePrescriptionDTO);

        Prescription prescription = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new ResourceNotFound("No prescription found with id: " + prescriptionId));

        verifyPrescriptionSignature(prescription);

        if (!prescription.getDoctorId().equals(updatePrescriptionDTO.getDoctorId())) {
            throw new BadRequestException("Unauthorized to update this prescription");
        }

        if (updatePrescriptionDTO.getDiagnosis() != null) {
            prescription.setDiagnosis(updatePrescriptionDTO.getDiagnosis());
        }
        if (updatePrescriptionDTO.getNotes() != null) {
            prescription.setNotes(updatePrescriptionDTO.getNotes());
        }
        if (updatePrescriptionDTO.getFollowUpInstructions() != null) {
            prescription.setFollowUpInstructions(updatePrescriptionDTO.getFollowUpInstructions());
        }
        if (updatePrescriptionDTO.getNextFollowUp() != null) {
            prescription.setNextFollowUp(updatePrescriptionDTO.getNextFollowUp());
        }
        if (updatePrescriptionDTO.getEmergencyInstructions() != null) {
            prescription.setEmergencyInstructions(updatePrescriptionDTO.getEmergencyInstructions());
        }

        if (updatePrescriptionDTO.getMedicines() != null && !updatePrescriptionDTO.getMedicines().isEmpty()) {
            List<DrugInteractionDTO> interactions = drugInteractionService.checkDrugInteractions(
                    prescription.getPatientId(), updatePrescriptionDTO.getMedicines());

            List<DrugInteractionDTO> criticalInteractions = interactions.stream()
                    .filter(i -> "MAJOR".equals(i.getInteractionType()) || "HIGH".equals(i.getSeverity()))
                    .collect(Collectors.toList());

            if (!criticalInteractions.isEmpty() && !updatePrescriptionDTO.isIgnoreInteractions()) {
                throw new RuntimeConflict("Critical drug interactions detected");
            }

            medicineRepository.deleteByPrescriptionId(prescriptionId);

            List<PrescriptionMedicine> medicines = updatePrescriptionDTO.getMedicines().stream()
                    .map(medicineDTO -> {
                        PrescriptionMedicine medicine = modelMapper.map(medicineDTO, PrescriptionMedicine.class);
                        medicine.setPrescriptionId(prescriptionId);
                        return medicine;
                    })
                    .collect(Collectors.toList());

            medicineRepository.saveAll(medicines);
        }

        Prescription updatedPrescription = prescriptionRepository.save(prescription);

        PrescriptionDTO responseDTO = modelMapper.map(updatedPrescription, PrescriptionDTO.class);
        List<PrescriptionMedicine> medicines = medicineRepository.findByPrescriptionId(prescriptionId);
        responseDTO.setMedicines(medicines.stream()
                .map(medicine -> modelMapper.map(medicine, PrescriptionMedicineDTO.class))
                .collect(Collectors.toList()));

        notificationService.sendPrescriptionUpdatedNotification(responseDTO);

        log.info("Prescription updated successfully: {}", prescriptionId);
        return responseDTO;
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "prescriptions", key = "#prescriptionId")
    public PrescriptionDTO getPrescriptionById(String prescriptionId) {
        log.info("Getting prescription: {}", prescriptionId);
        Prescription prescription = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new ResourceNotFound("No prescription found with id: " + prescriptionId));

        PrescriptionDTO prescriptionDTO = modelMapper.map(prescription, PrescriptionDTO.class);

        List<PrescriptionMedicine> medicines = medicineRepository.findByPrescriptionId(prescriptionId);
        prescriptionDTO.setMedicines(medicines.stream()
                .map(medicine -> modelMapper.map(medicine, PrescriptionMedicineDTO.class))
                .collect(Collectors.toList()));
        log.info("Prescription fetched successfully: {}", prescriptionId);
        return prescriptionDTO;
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "prescriptions", key = "#appointmentId")
    public List<PrescriptionDTO> getPrescriptionsByAppointment(String appointmentId) {
        log.info("Getting prescriptions for appointment: {}", appointmentId);
        List<Prescription> prescriptions = prescriptionRepository.findByAppointmentId(appointmentId);
        log.info("Prescriptions fetched successfully for appointment: {}", appointmentId);
        return prescriptions.stream()
                .map(prescription -> {
                    PrescriptionDTO prescriptionDTO = modelMapper.map(prescription, PrescriptionDTO.class);

                    List<PrescriptionMedicine> medicines = medicineRepository.findByPrescriptionId(prescription.getId());
                    prescriptionDTO.setMedicines(medicines.stream()
                            .map(medicine -> modelMapper.map(medicine, PrescriptionMedicineDTO.class))
                            .collect(Collectors.toList()));

                    return prescriptionDTO;
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "doctorPrescriptions", key = "#doctorId + ':' + #pageable.pageNumber + ':' + #pageable.pageSize")
    public Page<PrescriptionDTO> getDoctorPrescriptions(String doctorId, Pageable pageable) {
        log.info("Getting prescriptions for doctor: {}", doctorId);
        Page<Prescription> prescriptions = prescriptionRepository.findByDoctorIdOrderByCreatedAtDesc(doctorId, pageable);

        log.info("Prescriptions fetched successfully for doctor: {}", doctorId);
        return prescriptions.map(prescription -> {
            PrescriptionDTO prescriptionDTO = modelMapper.map(prescription, PrescriptionDTO.class);

            List<PrescriptionMedicine> medicines = medicineRepository.findByPrescriptionId(prescription.getId());
            prescriptionDTO.setMedicines(medicines.stream()
                    .map(medicine -> modelMapper.map(medicine, PrescriptionMedicineDTO.class))
                    .collect(Collectors.toList()));
            return prescriptionDTO;
        });
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "patientPrescriptions", key = "#patientId + ':' + #pageable.pageNumber + ':' + #pageable.pageSize")
    public Page<PrescriptionDTO> getPatientPrescriptions(String patientId, Pageable pageable) {
        log.info("Getting prescriptions for patient: {}", patientId);
        Page<Prescription> prescriptions = prescriptionRepository.findByPatientIdOrderByCreatedAtDesc(patientId, pageable);
        log.info("Prescriptions fetched successfully for patient: {}", patientId);
        return prescriptions.map(prescription -> {
            PrescriptionDTO prescriptionDTO = modelMapper.map(prescription, PrescriptionDTO.class);
            List<PrescriptionMedicine> medicines = medicineRepository.findByPrescriptionId(prescription.getId());
            prescriptionDTO.setMedicines(medicines.stream()
                    .map(medicine -> modelMapper.map(medicine, PrescriptionMedicineDTO.class))
                    .collect(Collectors.toList()));

            return prescriptionDTO;
        });
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "doctorPatientPrescriptions", key = "#doctorId + ':' + #patientId")
    public List<PrescriptionDTO> getDoctorPatientPrescriptions(String doctorId, String patientId) {
        log.info("Getting prescriptions for doctor: {} and patient: {}", doctorId, patientId);
        List<Prescription> prescriptions = prescriptionRepository.findByDoctorIdAndPatientIdOrderByCreatedAtDesc(doctorId, patientId);

        return prescriptions.stream()
                .map(prescription -> {
                    PrescriptionDTO prescriptionDTO = modelMapper.map(prescription, PrescriptionDTO.class);
                    List<PrescriptionMedicine> medicines = medicineRepository.findByPrescriptionId(prescription.getId());
                    prescriptionDTO.setMedicines(medicines.stream()
                            .map(medicine -> modelMapper.map(medicine, PrescriptionMedicineDTO.class))
                            .collect(Collectors.toList()));

                    return prescriptionDTO;
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    @CacheEvict(value = {"prescriptions", "doctorPrescriptions", "patientPrescriptions"}, allEntries = true)
    public void deletePrescription(String prescriptionId, String deletedBy) throws Exception {
        Prescription prescription = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new ResourceNotFound("Prescription not found with id: " + prescriptionId));

        if (!prescription.getDoctorId().equals(deletedBy)) {
            throw new BadRequestException("Unauthorized to delete this prescription");
        }
        verifyPrescriptionSignature(prescription);
        prescription.setStatus(PrescriptionStatus.CANCELLED);
        prescriptionRepository.save(prescription);

        log.info("Prescription deleted: {} by {}", prescriptionId, deletedBy);
    }


    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "prescriptions", key = "#startDate + ':' + #endDate")
    public List<PrescriptionDTO> getPrescriptionsWithFollowUpDue(LocalDateTime startDate, LocalDateTime endDate) {
        List<Prescription> prescriptions = prescriptionRepository.findPrescriptionsWithFollowUpDue(startDate, endDate);

        return prescriptions.stream()
                .map(prescription -> modelMapper.map(prescription, PrescriptionDTO.class))
                .collect(Collectors.toList());
    }


    @Override
    @Cacheable(value = "prescriptionSummary", key = "#doctorId + ':' + #startDate + ':' + #endDate")
    @Transactional(readOnly = true)
    public PrescriptionSummaryDTO getPrescriptionSummary(String doctorId, LocalDateTime startDate, LocalDateTime endDate) {
        List<Prescription> prescriptions = prescriptionRepository.findByDoctorIdAndDateRange(doctorId, startDate, endDate);

        int totalPrescriptions = prescriptions.size();
        int activePrescriptions = (int) prescriptions.stream().filter(p -> PrescriptionStatus.ACTIVE.equals(p.getStatus())).count();
        int completedPrescriptions = (int) prescriptions.stream().filter(p -> PrescriptionStatus.COMPLETED.equals(p.getStatus())).count();
        int cancelledPrescriptions = (int) prescriptions.stream().filter(p -> PrescriptionStatus.CANCELLED.equals(p.getStatus())).count();

        List<PrescriptionRepository.DailyPrescriptionCount> dailyCountsRaw =
                prescriptionRepository.getDailyPrescriptionCounts(doctorId, startDate, endDate);

        List<PrescriptionSummaryDTO.DailyCount> dailyCounts = dailyCountsRaw.stream()
                .map(d -> new PrescriptionSummaryDTO.DailyCount(d.getId(), d.getCount()))
                .collect(Collectors.toList());

        List<PrescriptionRepository.DiagnosisCount> topDiagnosesRaw =
                prescriptionRepository.getTopDiagnoses(doctorId, startDate, endDate);

        List<PrescriptionSummaryDTO.DiagnosisCount> topDiagnoses = topDiagnosesRaw.stream()
                .map(d -> new PrescriptionSummaryDTO.DiagnosisCount(d.getId(), d.getCount()))
                .collect(Collectors.toList());

        return PrescriptionSummaryDTO.builder()
                .totalPrescriptions(totalPrescriptions)
                .activePrescriptions(activePrescriptions)
                .completedPrescriptions(completedPrescriptions)
                .cancelledPrescriptions(cancelledPrescriptions)
                .dailyCounts(dailyCounts)
                .topDiagnoses(topDiagnoses)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "searchPrescriptions", key = "#query + ':' + #doctorId")
    public List<PrescriptionDTO> searchPrescriptions(String query, String doctorId) {
        if (query == null || query.trim().isEmpty()) {
            return Collections.emptyList();
        }

        String normalizedQuery = query.toLowerCase();

        List<Prescription> prescriptions = prescriptionRepository
                .findByDoctorIdOrderByCreatedAtDesc(doctorId, null)
                .getContent()
                .stream()
                .filter(prescription -> {
                    String diagnosis = Optional.ofNullable(prescription.getDiagnosis()).orElse("").toLowerCase();
                    String firstName = Optional.ofNullable(prescription.getPatientFirstName()).orElse("").toLowerCase();
                    String lastName = Optional.ofNullable(prescription.getPatientLastName()).orElse("").toLowerCase();
                    String number = Optional.ofNullable(prescription.getPrescriptionNumber()).orElse("").toLowerCase();

                    return diagnosis.contains(normalizedQuery)
                            || firstName.contains(normalizedQuery)
                            || lastName.contains(normalizedQuery)
                            || number.contains(normalizedQuery);
                })
                .collect(Collectors.toList());

        return prescriptions.stream()
                .map(prescription -> {
                    PrescriptionDTO dto = modelMapper.map(prescription, PrescriptionDTO.class);

                    List<PrescriptionMedicine> medicines = medicineRepository.findByPrescriptionId(prescription.getId());
                    List<PrescriptionMedicineDTO> medicineDTOs = medicines.stream()
                            .map(medicine -> modelMapper.map(medicine, PrescriptionMedicineDTO.class))
                            .collect(Collectors.toList());

                    dto.setMedicines(medicineDTOs);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    private void verifyPrescriptionSignature(Prescription prescription) throws Exception {
        String dataToVerify = prescription.getPrescriptionNumber() + "|" +
                prescription.getDoctorId() + "|" +
                prescription.getPatientId() + "|" +
                prescription.getDiagnosis() + "|" +
                prescription.getValidFrom();

        String signatureBase64 = prescription.getDigitalSignature();
        boolean isValid = signatureUtil.verify(dataToVerify, signatureBase64);
        if (!isValid) {
            throw new BadRequestException("Invalid digital signature");
        }
    }
}
