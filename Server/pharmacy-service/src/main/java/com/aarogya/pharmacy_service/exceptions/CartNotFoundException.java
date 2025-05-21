package com.aarogya.pharmacy_service.exceptions;

import org.springframework.http.HttpStatus;

public class CartNotFoundException extends PharmacyException {
    public CartNotFoundException(String patientId) {
        super("Cart not found for patient ID: " + patientId, HttpStatus.NOT_FOUND, "CART_NOT_FOUND");
    }
}
