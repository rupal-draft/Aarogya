package com.aarogya.doctor_service.dto.journal.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DecryptRequest {
    private String entryId;
    private String encryptionKey;
}
