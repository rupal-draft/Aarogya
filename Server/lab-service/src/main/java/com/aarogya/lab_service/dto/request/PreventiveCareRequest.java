package com.aarogya.lab_service.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PreventiveCareRequest {
    private int age;
    private String gender;
}
