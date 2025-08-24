package com.aarogya.patient_management_service.config;

import com.aarogya.patient_management_service.dto.response.DiseaseHistoryResponse;
import com.aarogya.patient_management_service.dto.response.PatientAllergyResponse;
import com.aarogya.patient_management_service.model.DiseaseHistory;
import com.aarogya.patient_management_service.model.PatientAllergy;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration()
                .setMatchingStrategy(MatchingStrategies.STRICT)
                .setFieldMatchingEnabled(true)
                .setFieldAccessLevel(org.modelmapper.config.Configuration.AccessLevel.PRIVATE);

        mapper.createTypeMap(DiseaseHistory.class, DiseaseHistoryResponse.class)
                .addMappings(modeMapper -> {
                    modeMapper.map(DiseaseHistory::isChronic, DiseaseHistoryResponse::setChronic);
                });

        mapper.createTypeMap(PatientAllergy.class, PatientAllergyResponse.class)
                .addMappings(modelMapper -> {
                    modelMapper.map(src -> src.getDiagnosedDate().atStartOfDay(),
                            PatientAllergyResponse::setDiagnosedDate);
                });

        return mapper;
    }
}
