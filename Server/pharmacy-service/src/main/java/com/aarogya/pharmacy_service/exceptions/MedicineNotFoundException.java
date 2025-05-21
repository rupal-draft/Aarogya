package com.aarogya.pharmacy_service.exceptions;

import org.springframework.http.HttpStatus;

public class MedicineNotFoundException extends PharmacyException {
    public MedicineNotFoundException(String id) {
        super("Medicine not found with ID: " + id, HttpStatus.NOT_FOUND, "MEDICINE_NOT_FOUND");
    }
}
