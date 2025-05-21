package com.aarogya.pharmacy_service.exceptions;

import org.springframework.http.HttpStatus;

public class OrderNotFoundException extends PharmacyException {
    public OrderNotFoundException(String id) {
        super("Order not found with ID: " + id, HttpStatus.NOT_FOUND, "ORDER_NOT_FOUND");
    }
}

