package com.aarogya.pharmacy_service.mapper;

import com.aarogya.pharmacy_service.documents.Order;
import com.aarogya.pharmacy_service.documents.OrderItem;
import com.aarogya.pharmacy_service.dto.order.OrderCreationDTO;
import com.aarogya.pharmacy_service.dto.order.OrderDTO;
import com.aarogya.pharmacy_service.dto.order.OrderItemDTO;
import com.aarogya.pharmacy_service.dto.order.OrderStatusUpdateDTO;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class OrderMapper {

    private final ModelMapper modelMapper;

    public OrderMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;

        modelMapper.typeMap(OrderStatusUpdateDTO.class, Order.class)
                .addMappings(mapper -> mapper.skip(Order::setStatus));

        modelMapper.typeMap(OrderItem.class, OrderItemDTO.class);
    }

    public Order toEntity(OrderCreationDTO dto) {
        return modelMapper.map(dto, Order.class);
    }

    public OrderDTO toDTO(Order entity) {
        return modelMapper.map(entity, OrderDTO.class);
    }

    public void updateOrderFromDTO(OrderStatusUpdateDTO dto, Order entity) {
        modelMapper.map(dto, entity);
    }
}

