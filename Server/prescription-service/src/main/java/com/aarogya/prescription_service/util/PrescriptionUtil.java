package com.aarogya.prescription_service.util;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.Signature;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.Random;

@Component
public class PrescriptionUtil {

    private static final String PRESCRIPTION_PREFIX = "RX";
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyyMMdd");
    private static final Random random = new Random();

    public String generatePrescriptionNumber() {
        String datePart = LocalDate.now().format(DATE_FORMAT);
        String randomPart = String.format("%06d", random.nextInt(1000000));
        return PRESCRIPTION_PREFIX + datePart + randomPart;
    }

    public String generateDigitalSignature(String data, PrivateKey privateKey) throws Exception {
        Signature signature = Signature.getInstance("SHA256withRSA");
        signature.initSign(privateKey);
        signature.update(data.getBytes(StandardCharsets.UTF_8));
        byte[] digitalSignature = signature.sign();
        return Base64.getEncoder().encodeToString(digitalSignature);
    }

    public boolean isValidPrescriptionNumber(String prescriptionNumber) {
        if (prescriptionNumber == null || prescriptionNumber.length() != 16) {
            return false;
        }

        return prescriptionNumber.startsWith(PRESCRIPTION_PREFIX) &&
                prescriptionNumber.substring(2, 10).matches("\\d{8}") &&
                prescriptionNumber.substring(10).matches("\\d{6}");
    }

    public String calculateAge(LocalDate birthDate) {
        if (birthDate == null) {
            return "Unknown";
        }

        int age = LocalDate.now().getYear() - birthDate.getYear();
        if (LocalDate.now().getDayOfYear() < birthDate.getDayOfYear()) {
            age--;
        }

        return String.valueOf(age);
    }

    public boolean isPrescriptionExpired(LocalDateTime validUntil) {
        return validUntil != null && validUntil.isBefore(LocalDateTime.now());
    }

    public boolean isPrescriptionExpiringSoon(LocalDateTime validUntil, int daysThreshold) {
        if (validUntil == null) {
            return false;
        }

        LocalDateTime threshold = LocalDateTime.now().plusDays(daysThreshold);
        return validUntil.isBefore(threshold) && validUntil.isAfter(LocalDateTime.now());
    }

    public String formatPrescriptionForPrint(String prescriptionNumber, String doctorName, String patientName) {
        return String.format("Prescription #%s\nDoctor: %s\nPatient: %s\nDate: %s",
                prescriptionNumber, doctorName, patientName, LocalDate.now().format(DATE_FORMAT));
    }

    public boolean canRefill(Integer refillsAllowed, Integer refillsUsed) {
        if (refillsAllowed == null || refillsUsed == null) {
            return false;
        }
        return refillsUsed < refillsAllowed;
    }

    public int getRemainingRefills(Integer refillsAllowed, Integer refillsUsed) {
        if (refillsAllowed == null || refillsUsed == null) {
            return 0;
        }
        return Math.max(0, refillsAllowed - refillsUsed);
    }

    public byte[] generateQRCodeImage(String data) throws Exception {
        BitMatrix matrix = new MultiFormatWriter().encode(data, BarcodeFormat.QR_CODE, 250, 250);
        ByteArrayOutputStream stream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(matrix, "PNG", stream);
        return stream.toByteArray();
    }

    public boolean isElectronicPrescriptionValid(String data, String signatureBase64, PublicKey publicKey) throws Exception {
        Signature signature = Signature.getInstance("SHA256withRSA");
        signature.initVerify(publicKey);
        signature.update(data.getBytes(StandardCharsets.UTF_8));
        byte[] signatureBytes = Base64.getDecoder().decode(signatureBase64);
        return signature.verify(signatureBytes);
    }
}
