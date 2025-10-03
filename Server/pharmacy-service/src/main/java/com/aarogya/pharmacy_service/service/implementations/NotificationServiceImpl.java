package com.aarogya.pharmacy_service.service.implementations;

import com.aarogya.pharmacy_service.documents.Order;
import com.aarogya.pharmacy_service.documents.OrderItem;
import com.aarogya.pharmacy_service.dto.order.OrderStatusUpdateDTO;
import com.aarogya.pharmacy_service.events.NotificationEvent;
import com.aarogya.pharmacy_service.events.enums.NotificationOrderStatus;
import com.aarogya.pharmacy_service.events.messaging.OrderItemNotificationDto;
import com.aarogya.pharmacy_service.events.messaging.OrderNotificationDto;
import com.aarogya.pharmacy_service.service.NotificationService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    private final KafkaTemplate<String, NotificationEvent> orderNotificationKafkaTemplate;
    private final ObjectMapper objectMapper;

    @Override
    public void sendOrderCreatedNotification(Order order) {
        log.info("Sending order created notification for order id {}", order.getId());
        OrderNotificationDto orderNotificationDto = OrderNotificationDto.builder()
                .orderId(order.getId())
                .orderDate(order.getOrderDate())
                .status(NotificationOrderStatus.valueOf(order.getStatus().toString()))
                .totalAmount(order.getTotalAmount())
                .orderItems(new java.util.ArrayList<>())
                .build();
        for(OrderItem orderItem : order.getItems()) {
            OrderItemNotificationDto orderItemNotificationDto = OrderItemNotificationDto.builder()
                    .medicineId(orderItem.getMedicineId())
                    .quantity(orderItem.getQuantity())
                    .medicineName(orderItem.getMedicineName())
                    .medicineImage(orderItem.getMedicineImage())
                    .price(orderItem.getPrice())
                    .build();
            orderNotificationDto.getOrderItems().add(orderItemNotificationDto);
        }
        NotificationEvent notificationEvent = buildNotificationEvent(orderNotificationDto, "Order created");
        orderNotificationKafkaTemplate.send("order-created",order.getId(), notificationEvent);
    }

    @Override
    public void sendOrderStatusUpdateNotification(Order order, OrderStatusUpdateDTO orderStatusUpdateDTO) {
        log.info("Sending order status update notification for order id {}", order.getId());
        OrderNotificationDto orderNotificationDto = OrderNotificationDto.builder()
                .orderId(order.getId())
                .orderDate(order.getOrderDate())
                .status(NotificationOrderStatus.valueOf(order.getStatus().toString()))
                .totalAmount(order.getTotalAmount())
                .orderItems(new java.util.ArrayList<>())
                .build();
        for(OrderItem orderItem : order.getItems()) {
            OrderItemNotificationDto orderItemNotificationDto = OrderItemNotificationDto.builder()
                    .medicineId(orderItem.getMedicineId())
                    .quantity(orderItem.getQuantity())
                    .medicineName(orderItem.getMedicineName())
                    .medicineImage(orderItem.getMedicineImage())
                    .price(orderItem.getPrice())
                    .build();
            orderNotificationDto.getOrderItems().add(orderItemNotificationDto);
        }
        NotificationEvent notificationEvent = buildNotificationEvent(orderNotificationDto,
                "Your order is " + orderStatusUpdateDTO
                .getStatus()
                .toLowerCase());
        orderNotificationKafkaTemplate.send("order-status-update",order.getId(), notificationEvent);
    }

    private NotificationEvent buildNotificationEvent(OrderNotificationDto order, String message) {
        Map<String, Object> data = objectMapper.convertValue(order, new TypeReference<Map<String, Object>>() {});
        return NotificationEvent.builder()
                .data(data)
                .read(false)
                .message(message)
                .timeStamp(LocalDateTime.now())
                .build();
    }
}
