package com.aarogya.article_service.exceptions;

public class ResourceConflictException extends RuntimeConflict {
    public ResourceConflictException(String message) {
        super(message);
    }
}
