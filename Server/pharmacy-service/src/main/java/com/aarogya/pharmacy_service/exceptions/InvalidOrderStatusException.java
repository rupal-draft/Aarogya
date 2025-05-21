package com.aarogya.pharmacy_service.exceptions;

import org.springframework.http.HttpStatus;

public class InvalidOrderStatusException extends PharmacyException {
    public InvalidOrderStatusException(String status) {
        super("Invalid order status: " + status, HttpStatus.BAD_REQUEST, "INVALID_ORDER_STATUS");
    }
}
