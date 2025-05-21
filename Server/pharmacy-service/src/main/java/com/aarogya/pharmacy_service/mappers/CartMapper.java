package com.aarogya.pharmacy_service.mappers;

import com.aarogya.pharmacy_service.documents.Cart;
import com.aarogya.pharmacy_service.dto.cart.CartCreationDTO;
import com.aarogya.pharmacy_service.dto.cart.CartDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface CartMapper {

    CartDTO toDTO(Cart entity);

    @Mapping(target = "id", ignore = true)
    Cart toEntity(CartCreationDTO dto);
}
