package com.aarogya.prescription_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TemplateSearchSuggestion {
    private List<String> tagSuggestions;
    private List<String> diagnosisSuggestions;
    private List<String> categorySuggestions;
}
