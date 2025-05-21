package com.aarogya.pharmacy_service.controller;

import com.aarogya.pharmacy_service.advices.ApiResponse;
import com.aarogya.pharmacy_service.advices.ErrorResponse;
import com.aarogya.pharmacy_service.dto.order.OrderCreationDTO;
import com.aarogya.pharmacy_service.dto.order.OrderDTO;
import com.aarogya.pharmacy_service.dto.order.OrderStatusUpdateDTO;
import com.aarogya.pharmacy_service.service.OrderService;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/order")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    @RateLimiter(name = "order", fallbackMethod = "placeOrder")
    public ResponseEntity<ApiResponse<OrderDTO>> placeOrder(@Valid @RequestBody OrderCreationDTO orderCreationDTO) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(orderService.placeOrder(orderCreationDTO)));
    }

    @PostMapping("/from-cart/{patientId}")
    @RateLimiter(name = "order", fallbackMethod = "placeOrderFromCart")
    public ResponseEntity<ApiResponse<OrderDTO>> placeOrderFromCart(
            @PathVariable String patientId,
            @Valid @RequestBody OrderCreationDTO orderCreationDTO) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(orderService.placeOrderFromCart(patientId, orderCreationDTO)));
    }

    @GetMapping
    @RateLimiter(name = "order", fallbackMethod = "getPatientOrders")
    public ResponseEntity<ApiResponse<List<OrderDTO>>> getPatientOrders(@RequestParam String patientId) {
        return ResponseEntity.ok(ApiResponse.success(orderService.getOrdersByPatient(patientId)));
    }

    @GetMapping("/{id}")
    @RateLimiter(name = "order", fallbackMethod = "getOrderById")
    public ResponseEntity<ApiResponse<OrderDTO>> getOrderById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(orderService.getOrderById(id)));
    }

    @PutMapping("/{id}/status")
    @RateLimiter(name = "order", fallbackMethod = "updateOrderStatus")
    public ResponseEntity<ApiResponse<OrderDTO>> updateOrderStatus(
            @PathVariable String id,
            @Valid @RequestBody OrderStatusUpdateDTO statusUpdateDTO) {
        return ResponseEntity.ok(ApiResponse.success(orderService.updateOrderStatus(id, statusUpdateDTO)));
    }

    @GetMapping("/status/{status}")
    @RateLimiter(name = "order", fallbackMethod = "getOrdersByStatus")
    public ResponseEntity<ApiResponse<List<OrderDTO>>> getOrdersByStatus(@PathVariable String status) {
        return ResponseEntity.ok(ApiResponse.success(orderService.getOrdersByStatus(status)));
    }

    public ResponseEntity<ErrorResponse> orderRateLimitFallback(Throwable throwable, HttpServletRequest request) {
        ErrorResponse errorResponse = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.TOO_MANY_REQUESTS.value())
                .error("Too Many Requests")
                .message("You are sending too many requests. Please try again later.")
                .path(request.getRequestURI())
                .build();

        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(errorResponse);
    }

    public ResponseEntity<ErrorResponse> placeOrder(Throwable t, HttpServletRequest request) {
        return orderRateLimitFallback(t, request);
    }

    public ResponseEntity<ErrorResponse> placeOrderFromCart(Throwable t, HttpServletRequest request) {
        return orderRateLimitFallback(t, request);
    }

    public ResponseEntity<ErrorResponse> getPatientOrders(Throwable t, HttpServletRequest request) {
        return orderRateLimitFallback(t, request);
    }

    public ResponseEntity<ErrorResponse> getOrderById(Throwable t, HttpServletRequest request) {
        return orderRateLimitFallback(t, request);
    }

    public ResponseEntity<ErrorResponse> updateOrderStatus(Throwable t, HttpServletRequest request) {
        return orderRateLimitFallback(t, request);
    }

    public ResponseEntity<ErrorResponse> getOrdersByStatus(Throwable t, HttpServletRequest request) {
        return orderRateLimitFallback(t, request);
    }
}
