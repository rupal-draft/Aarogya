package com.aarogya.pharmacy_service.exceptions;

import org.springframework.http.HttpStatus;

public class InsufficientStockException extends PharmacyException {
    public InsufficientStockException(String medicineName) {
        super("Insufficient stock for medicine: " + medicineName, HttpStatus.BAD_REQUEST, "INSUFFICIENT_STOCK");
    }
}
