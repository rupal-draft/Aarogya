package com.aarogya.lab_service.controller;

import com.aarogya.lab_service.advices.ApiResponse;
import com.aarogya.lab_service.auth.UserContextHolder;
import com.aarogya.lab_service.dto.request.CreateLabOrderRequest;
import com.aarogya.lab_service.dto.response.LabOrderResponse;
import com.aarogya.lab_service.enums.OrderStatus;
import com.aarogya.lab_service.service.LabOrderService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
@Slf4j
public class LabOrderController {

    private final LabOrderService labOrderService;

    public LabOrderController(LabOrderService labOrderService) {
        this.labOrderService = labOrderService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<LabOrderResponse>> createOrder(
            @Valid @RequestBody CreateLabOrderRequest request) {

        log.info("POST /api/v1/lab/orders - Creating order for user: {}",
                UserContextHolder.getUserDetails().getUserId());

        LabOrderResponse order = labOrderService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Lab order created successfully", order));
    }

    @GetMapping("/my-orders")
    public ResponseEntity<ApiResponse<Page<LabOrderResponse>>> getMyOrders(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) int size) {

        String patientId = UserContextHolder.getUserDetails().getUserId();
        log.info("GET /api/v1/lab/orders/my-orders - patient: {}, page: {}, size: {}",
                patientId, page, size);

        Page<LabOrderResponse> orders = labOrderService.getPatientOrders(patientId, page, size);
        return ResponseEntity.ok(ApiResponse.success("Patient orders retrieved successfully", orders));
    }

    @GetMapping("/doctor-orders")
    public ResponseEntity<ApiResponse<Page<LabOrderResponse>>> getDoctorOrders(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) int size) {

        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.info("GET /api/v1/lab/orders/doctor-orders - doctor: {}, page: {}, size: {}",
                doctorId, page, size);

        Page<LabOrderResponse> orders = labOrderService.getDoctorPatientOrders(doctorId, page, size);
        return ResponseEntity.ok(ApiResponse.success("Doctor patient orders retrieved successfully", orders));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<LabOrderResponse>> getOrderById(
            @PathVariable @NotBlank String orderId) {

        log.info("GET /api/v1/lab/orders/{}", orderId);

        LabOrderResponse order = labOrderService.getOrderById(orderId);
        return ResponseEntity.ok(ApiResponse.success("Lab order retrieved successfully", order));
    }

    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<ApiResponse<LabOrderResponse>> getOrderByNumber(
            @PathVariable @NotBlank String orderNumber) {

        log.info("GET /api/v1/lab/orders/number/{}", orderNumber);

        LabOrderResponse order = labOrderService.getOrderByNumber(orderNumber);
        return ResponseEntity.ok(ApiResponse.success("Lab order retrieved successfully", order));
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<ApiResponse<LabOrderResponse>> updateOrderStatus(
            @PathVariable @NotBlank String orderId,
            @RequestParam String status) {

        log.info("PUT /api/v1/lab/orders/{}/status - new status: {}", orderId, status);

        LabOrderResponse order = labOrderService.updateOrderStatus(orderId, OrderStatus.valueOf(status.toUpperCase()));
        return ResponseEntity.ok(ApiResponse.success("Order status updated successfully", order));
    }

    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<ApiResponse<LabOrderResponse>> cancelOrder(
            @PathVariable @NotBlank String orderId,
            @RequestParam @NotBlank String reason) {

        log.info("PUT /api/v1/lab/orders/{}/cancel - reason: {}", orderId, reason);

        LabOrderResponse order = labOrderService.cancelOrder(orderId, reason);
        return ResponseEntity.ok(ApiResponse.success("Order cancelled successfully", order));
    }
}
