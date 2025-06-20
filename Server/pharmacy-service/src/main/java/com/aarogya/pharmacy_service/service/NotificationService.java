package com.aarogya.pharmacy_service.service;

import com.aarogya.pharmacy_service.documents.Order;
import com.aarogya.pharmacy_service.dto.order.OrderStatusUpdateDTO;

public interface NotificationService {

    void sendOrderCreatedNotification(Order order);

    void sendOrderStatusUpdateNotification(Order order,  OrderStatusUpdateDTO orderStatusUpdateDTO);
}
