package com.aarogya.email_service.config;

import com.aarogya.appointment_service.events.AppointmentConfirmationEvent;
import com.aarogya.auth_service.events.SendOtpEvent;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.support.serializer.JsonDeserializer;

import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableKafka
public class KafkaConfig {

    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    @Bean
    public ConsumerFactory<String, SendOtpEvent> otpSendingConsumerFactory() {
        JsonDeserializer<SendOtpEvent> deserializer =
                new JsonDeserializer<>(SendOtpEvent.class);
        deserializer.addTrustedPackages("*");

        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "otp-send-group");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, deserializer);

        return new DefaultKafkaConsumerFactory<>(props, new StringDeserializer(), deserializer);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, SendOtpEvent> otpSendingKafkaListenerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, SendOtpEvent> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(otpSendingConsumerFactory());
        return factory;
    }

    @Bean
    public ConsumerFactory<String, AppointmentConfirmationEvent> appointmentConfirmationConsumerFactory() {
        JsonDeserializer<AppointmentConfirmationEvent> deserializer =
                new JsonDeserializer<>(AppointmentConfirmationEvent.class);
        deserializer.addTrustedPackages("*");

        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "appointment-confirmation-group");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, deserializer);

        return new DefaultKafkaConsumerFactory<>(props, new StringDeserializer(), deserializer);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, AppointmentConfirmationEvent> appointmentConfirmationKafkaListenerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, AppointmentConfirmationEvent> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(appointmentConfirmationConsumerFactory());
        return factory;
    }
}
