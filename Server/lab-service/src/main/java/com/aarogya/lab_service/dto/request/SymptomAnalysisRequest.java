package com.aarogya.lab_service.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SymptomAnalysisRequest {
    private List<String> symptoms;
    private int age;
    private String gender;
}
