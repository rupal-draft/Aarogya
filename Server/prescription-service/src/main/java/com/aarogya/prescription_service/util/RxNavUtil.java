package com.aarogya.prescription_service.util;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Component
public class RxNavUtil {

    private final RestTemplate restTemplate;
    private final Environment env;

    public RxNavUtil(@Qualifier("drugInteractionRestTemplate") RestTemplate restTemplate, Environment env) {
        this.restTemplate = restTemplate;
        this.env = env;
    }

    public String getRxCuiForDrug(String drugName) {
        String url = env.getProperty("external.rxnav.rxcui-url") + drugName;
        try {
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            Map<String, Object> idGroup = (Map<String, Object>) response.getBody().get("idGroup");
            List<String> rxnormIds = (List<String>) idGroup.get("rxnormId");

            return (rxnormIds != null && !rxnormIds.isEmpty()) ? rxnormIds.get(0) : null;
        } catch (Exception e) {
            return null;
        }
    }
}
