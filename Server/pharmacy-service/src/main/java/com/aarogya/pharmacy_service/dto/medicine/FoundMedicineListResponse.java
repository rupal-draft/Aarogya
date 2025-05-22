package com.aarogya.pharmacy_service.dto.medicine;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FoundMedicineListResponse {
    private List<String> medicines_found;
}
