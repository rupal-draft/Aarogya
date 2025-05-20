package com.aarogya.api_gateway.config;

import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class PublicEndpointConfig {

    private final Set<String> publicEndpoints = Set.of(

    );

    public boolean isPublicEndpoint(String path) {
        return publicEndpoints.stream().anyMatch(path::startsWith);
    }
}
