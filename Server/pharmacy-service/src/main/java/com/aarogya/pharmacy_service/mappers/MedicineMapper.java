package com.aarogya.pharmacy_service.mappers;

import com.aarogya.pharmacy_service.documents.Medicine;
import com.aarogya.pharmacy_service.dto.medicine.MedicineCreationDTO;
import com.aarogya.pharmacy_service.dto.medicine.MedicineDTO;
import com.aarogya.pharmacy_service.dto.medicine.MedicineResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface MedicineMapper {

    Medicine toEntity(MedicineCreationDTO dto);

    MedicineResponseDTO toResponseDTO(Medicine entity);

    void updateMedicineFromDTO(MedicineDTO dto, @MappingTarget Medicine entity);
}
