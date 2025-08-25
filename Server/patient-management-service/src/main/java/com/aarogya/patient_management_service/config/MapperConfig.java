package com.aarogya.patient_management_service.config;

import com.aarogya.patient_management_service.dto.response.DiseaseHistoryResponse;
import com.aarogya.patient_management_service.dto.response.PatientAllergyResponse;
import com.aarogya.patient_management_service.model.DiseaseHistory;
import com.aarogya.patient_management_service.model.PatientAllergy;
import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Configuration
public class MapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration()
                .setMatchingStrategy(MatchingStrategies.STRICT)
                .setFieldMatchingEnabled(true)
                .setFieldAccessLevel(org.modelmapper.config.Configuration.AccessLevel.PRIVATE);

        modelMapper.createTypeMap(DiseaseHistory.class, DiseaseHistoryResponse.class)
                .addMappings(mapper -> {
                    mapper.map(DiseaseHistory::isChronic, DiseaseHistoryResponse::setChronic);
                });

        Converter<LocalDate, LocalDateTime> localDateToLocalDateTime =
                ctx -> ctx.getSource() == null ? null : ctx.getSource().atStartOfDay();

        modelMapper.createTypeMap(PatientAllergy.class, PatientAllergyResponse.class)
                .addMappings(mapper ->
                        mapper.using(localDateToLocalDateTime)
                                .map(PatientAllergy::getDiagnosedDate, PatientAllergyResponse::setDiagnosedDate)
                );


        return modelMapper;
    }
}
