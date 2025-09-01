package com.aarogya.doctor_service.dto.journal.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchSuggestionResponse {
    private List<String> tagSuggestions;
    private List<String> patientSuggestions;
    private List<String> titleSuggestions;
}
