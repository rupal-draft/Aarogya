package com.aarogya.pharmacy_service.mapper;

import com.aarogya.pharmacy_service.documents.Cart;
import com.aarogya.pharmacy_service.dto.cart.CartCreationDTO;
import com.aarogya.pharmacy_service.dto.cart.CartDTO;
import com.aarogya.pharmacy_service.dto.patient.PatientResponseDTO;
import com.aarogya.pharmacy_service.dto.patient.UserResponseDto;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class CartMapper {

    private final ModelMapper modelMapper;

    public CartMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;

        modelMapper.typeMap(CartCreationDTO.class, Cart.class)
                .addMappings(mapper -> mapper.skip(Cart::setId));
    }

    public CartDTO toDTO(Cart entity) {
        return modelMapper.map(entity, CartDTO.class);
    }

    public Cart toEntity(CartCreationDTO dto) {
        return modelMapper.map(dto, Cart.class);
    }

    public UserResponseDto toUser(PatientResponseDTO patientResponseDTO) {
        return modelMapper.map(patientResponseDTO, UserResponseDto.class);
    }
}
