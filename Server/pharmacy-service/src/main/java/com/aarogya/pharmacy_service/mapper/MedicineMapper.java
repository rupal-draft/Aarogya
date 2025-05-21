package com.aarogya.pharmacy_service.mapper;

import com.aarogya.pharmacy_service.documents.Medicine;
import com.aarogya.pharmacy_service.dto.medicine.MedicineCreationDTO;
import com.aarogya.pharmacy_service.dto.medicine.MedicineDTO;
import com.aarogya.pharmacy_service.dto.medicine.MedicineResponseDTO;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class MedicineMapper {

    private final ModelMapper modelMapper;

    public MedicineMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    public Medicine toEntity(MedicineCreationDTO dto) {
        return modelMapper.map(dto, Medicine.class);
    }

    public MedicineResponseDTO toResponseDTO(Medicine entity) {
        return modelMapper.map(entity, MedicineResponseDTO.class);
    }

    public void updateMedicineFromDTO(MedicineDTO dto, Medicine entity) {
        modelMapper.map(dto, entity);
    }
}