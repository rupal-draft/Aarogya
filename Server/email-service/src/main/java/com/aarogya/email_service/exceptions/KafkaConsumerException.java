package com.aarogya.email_service.exceptions;

public class KafkaConsumerException extends OtpServiceException {

    public KafkaConsumerException(String topic) {
        super(String.format("Error consuming message from topic: %s", topic), "OTP_KAFKA_001");
    }

    public KafkaConsumerException(String topic, Throwable cause) {
        super(String.format("Error consuming message from topic: %s", topic), cause, "OTP_KAFKA_002");
    }

    public KafkaConsumerException(String message, String topic, Throwable cause) {
        super(String.format("%s - Topic: %s", message, topic), cause, "OTP_KAFKA_003");
    }
}
