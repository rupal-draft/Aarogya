package com.aarogya.api_gateway.exception;

import io.jsonwebtoken.JwtException;

public class TokenValidationException extends JwtException {
    public TokenValidationException(String message) {
        super(message);
    }
}
