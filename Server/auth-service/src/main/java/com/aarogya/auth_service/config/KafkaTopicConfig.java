package com.aarogya.auth_service.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class KafkaTopicConfig {

    @Bean
    public NewTopic sendOtpTopic() {
        return new NewTopic("send-otp", 3, (short) 1);
    }
}
