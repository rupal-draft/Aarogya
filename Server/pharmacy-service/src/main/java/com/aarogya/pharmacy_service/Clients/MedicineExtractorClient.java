package com.aarogya.pharmacy_service.Clients;

import com.aarogya.pharmacy_service.dto.medicine.FoundMedicineListResponse;
import com.aarogya.pharmacy_service.dto.medicine.MedicineListRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "medicineExtractor", url = "http://127.0.0.1:5000")
public interface MedicineExtractorClient {

    @PostMapping("/extract-medicines")
    FoundMedicineListResponse extractMedicines(@RequestBody MedicineListRequest request);
}
