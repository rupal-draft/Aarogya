package com.aarogya.email_service.exceptions;

import lombok.Getter;

@Getter
public class ConfigurationException extends OtpServiceException {

    private final String configProperty;

    public ConfigurationException(String configProperty) {
        super(String.format("Configuration property not found or invalid: %s", configProperty),
                "OTP_CONFIG_001");
        this.configProperty = configProperty;
    }

    public ConfigurationException(String configProperty, String message) {
        super(String.format("Configuration error for %s: %s", configProperty, message),
                "OTP_CONFIG_002");
        this.configProperty = configProperty;
    }

    public ConfigurationException(String configProperty, String message, Throwable cause) {
        super(String.format("Configuration error for %s: %s", configProperty, message),
                cause, "OTP_CONFIG_003");
        this.configProperty = configProperty;
    }

}
