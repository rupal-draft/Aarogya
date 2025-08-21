package com.aarogya.lab_service.service;

import com.aarogya.lab_service.dto.request.CreateLabOrderRequest;
import com.aarogya.lab_service.dto.response.LabOrderResponse;
import com.aarogya.lab_service.enums.OrderStatus;
import org.springframework.data.domain.Page;

public interface LabOrderService {

    LabOrderResponse createOrder(CreateLabOrderRequest request);

    Page<LabOrderResponse> getPatientOrders(String patientId, int page, int size);

    Page<LabOrderResponse> getDoctorPatientOrders(String doctorId, int page, int size);

    LabOrderResponse getOrderById(String orderId);

    LabOrderResponse getOrderByNumber(String orderNumber);

    LabOrderResponse updateOrderStatus(String orderId, OrderStatus newStatus);

    LabOrderResponse cancelOrder(String orderId, String cancellationReason);
}
