package com.aarogya.lab_service.service;

import com.aarogya.lab_service.dto.request.TestOrderRequestDto;
import com.aarogya.lab_service.dto.response.TestOrderResponseDto;
import com.aarogya.lab_service.enums.OrderStatus;
import org.springframework.data.domain.Page;

import java.util.List;

public interface TestOrderService {


    TestOrderResponseDto createTestOrder(TestOrderRequestDto requestDto);


    TestOrderResponseDto updateOrderStatus(String orderId, OrderStatus status, String reason);


    Page<TestOrderResponseDto> getPatientOrders(String patientId, OrderStatus status, int page, int size);


    Page<TestOrderResponseDto> getDoctorOrders(String doctorId, OrderStatus status, int page, int size);


    TestOrderResponseDto getOrderDetails(String orderId);


    List<TestOrderResponseDto> getUrgentOrders();


    List<TestOrderResponseDto> getOverdueOrders();


    TestOrderResponseDto addTestsToOrder(String orderId, List<String> testIds);


    TestOrderResponseDto removeTestsFromOrder(String orderId, List<String> testIds);

    byte[] generateOrderPdf(String orderId);
}
