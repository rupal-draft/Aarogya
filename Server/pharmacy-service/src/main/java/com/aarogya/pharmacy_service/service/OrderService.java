package com.aarogya.pharmacy_service.service;

import com.aarogya.pharmacy_service.dto.order.OrderCreationDTO;
import com.aarogya.pharmacy_service.dto.order.OrderDTO;
import com.aarogya.pharmacy_service.dto.order.OrderStatusUpdateDTO;

import java.util.List;

public interface OrderService {

    OrderDTO placeOrder(OrderCreationDTO orderCreationDTO);

    OrderDTO placeOrderFromCart(OrderCreationDTO orderCreationDTO);

    List<OrderDTO> getOrdersByPatient(String patientId);

    List<OrderDTO> getMyOrders();

    OrderDTO getOrderById(String id);

    OrderDTO updateOrderStatus(String id, OrderStatusUpdateDTO statusUpdateDTO);

    List<OrderDTO> getOrdersByStatus(String status);
}
