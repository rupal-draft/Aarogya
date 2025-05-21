package com.aarogya.pharmacy_service.exceptions;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class PharmacyException extends RuntimeException {
  private final HttpStatus status;
  private final String errorCode;

  public PharmacyException(String message, HttpStatus status, String errorCode) {
    super(message);
    this.status = status;
    this.errorCode = errorCode;
  }
}
