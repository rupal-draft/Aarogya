package com.aarogya.pharmacy_service.mappers;

import com.aarogya.pharmacy_service.documents.Order;
import com.aarogya.pharmacy_service.dto.order.OrderCreationDTO;
import com.aarogya.pharmacy_service.dto.order.OrderDTO;
import com.aarogya.pharmacy_service.dto.order.OrderStatusUpdateDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface OrderMapper {

    Order toEntity(OrderCreationDTO dto);

    OrderDTO toDTO(Order entity);

    @Mapping(target = "status", ignore = true)
    void updateOrderFromDTO(OrderStatusUpdateDTO dto, @MappingTarget Order entity);
}
