package com.aarogya.prescription_service.client;

import com.aarogya.prescription_service.dto.DrugInteractionDTO;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class DrugInteractionApiClient {

    private final RestTemplate restTemplate;
    private final Environment env;
    private final ObjectMapper objectMapper;

    public DrugInteractionDTO checkInteractionByRxCuis(String rxCui1, String rxCui2) {
        String joined = rxCui1 + "+" + rxCui2;
        String url = env.getProperty("external.rxnav.interaction-url") + joined;

        try {
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            return parseInteractionResponse(response.getBody(), rxCui1, rxCui2);
        } catch (Exception e) {
            log.error("Error calling RxNav interaction API: {}", e.getMessage());
            return null;
        }
    }

    private DrugInteractionDTO parseInteractionResponse(String json, String rxCui1, String rxCui2) {
        try {
            JsonNode root = objectMapper.readTree(json);
            JsonNode pairNode = root
                    .path("fullInteractionTypeGroup")
                    .elements().next()
                    .path("fullInteractionType")
                    .elements().next()
                    .path("interactionPair")
                    .elements().next();

            String description = pairNode.path("description").asText(null);
            String severity = pairNode.path("severity").asText(null);

            JsonNode interactionConcepts = pairNode.path("interactionConcept");
            String drug1Name = interactionConcepts.get(0).path("minConceptItem").path("name").asText(null);
            String drug2Name = interactionConcepts.get(1).path("minConceptItem").path("name").asText(null);

            String referenceUrl = "https://lhncbc.nlm.nih.gov/RxNav/";
            String source = "National Institute of Health";
            if (pairNode.has("sourceConceptItem")) {
                referenceUrl = pairNode.path("sourceConceptItem").path("url").asText(null);
                source = pairNode.path("sourceConceptItem").path("name").asText(null);
            }

            return DrugInteractionDTO.builder()
                    .drug1(drug1Name)
                    .drug2(drug2Name)
                    .interactionType("MAJOR".equalsIgnoreCase(severity) ? "MAJOR" : "MINOR")
                    .severity(severity != null ? severity.toUpperCase() : null)
                    .description(description)
                    .referenceUrl(referenceUrl)
                    .source(source)
                    .detectedAt(LocalDateTime.now())
                    .status("ACTIVE")
                    .build();

        } catch (Exception e) {
            log.error("Error parsing RxNav JSON: {}", e.getMessage());
            return null;
        }
    }
}

