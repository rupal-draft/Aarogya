package com.aarogya.lab_service.service.implementations;

import com.aarogya.lab_service.auth.UserContextHolder;
import com.aarogya.lab_service.dto.request.CreateLabOrderRequest;
import com.aarogya.lab_service.dto.response.LabOrderResponse;
import com.aarogya.lab_service.enums.OrderStatus;
import com.aarogya.lab_service.exceptions.*;
import com.aarogya.lab_service.models.LabOrder;
import com.aarogya.lab_service.models.LabTest;
import com.aarogya.lab_service.repository.LabOrderRepository;
import com.aarogya.lab_service.repository.LabTestRepository;
import com.aarogya.lab_service.service.LabOrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class LabOrderServiceImpl implements LabOrderService {

    private final LabOrderRepository labOrderRepository;
    private final LabTestRepository labTestRepository;
    private final ModelMapper modelMapper;

    @Override
    @Transactional
    @CacheEvict(value = {"labOrders", "patientOrders"}, allEntries = true)
    public LabOrderResponse createOrder(CreateLabOrderRequest request) {
        log.info("Creating lab order for patient: {}", UserContextHolder.getUserDetails().getUserId());

        validateCreateOrderRequest(request);

        String patientId = UserContextHolder.getUserDetails().getUserId();

        List<LabTest> tests = validateAndFetchTests(request.getTestIds());

        List<LabOrder.OrderedTest> orderedTests = tests.stream()
                .map(test -> LabOrder.OrderedTest.builder()
                        .testId(test.getId())
                        .testCode(test.getTestCode())
                        .testName(test.getTestName())
                        .price(test.getPrice())
                        .build()
                )
                .collect(Collectors.toList());

        BigDecimal totalAmount = tests.stream()
                .map(LabTest::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        LabOrder labOrder = LabOrder.builder()
                .patientId(patientId)
                .doctorId(request.getDoctorId())
                .orderedTests(orderedTests)
                .totalAmount(totalAmount)
                .scheduledDateTime(request.getScheduledDateTime())
                .location(request.getLocation())
                .build();

        labOrder.setSpecialInstructions(request.getSpecialInstructions());

        LabOrder savedOrder = labOrderRepository.save(labOrder);
        log.info("Lab order created successfully with ID: {}", savedOrder.getId());

        return mapToOrderResponse(savedOrder);
    }

    @Override
    @Cacheable(value = "patientOrders", key = "#patientId + '_' + #page + '_' + #size")
    public Page<LabOrderResponse> getPatientOrders(String patientId, int page, int size) {
        log.info("Fetching orders for patient: {}, page: {}, size: {}", patientId, page, size);

        Pageable pageable = PageRequest.of(page, size);
        Page<LabOrder> ordersPage = labOrderRepository.findByPatientIdOrderByCreatedAtDesc(patientId, pageable);

        return ordersPage.map(this::mapToOrderResponse);
    }

    @Override
    @Cacheable(value = "labOrders", key = "'doctor_' + #doctorId + '_' + #page + '_' + #size")
    public Page<LabOrderResponse> getDoctorPatientOrders(String doctorId, int page, int size) {
        log.info("Fetching orders for doctor: {}, page: {}, size: {}", doctorId, page, size);

        Pageable pageable = PageRequest.of(page, size);
        Page<LabOrder> ordersPage = labOrderRepository.findByDoctorIdAndStatusNotCancelled(doctorId, pageable);

        return ordersPage.map(this::mapToOrderResponse);
    }

    @Override
    public LabOrderResponse getOrderById(String orderId) {
        log.info("Fetching order by ID: {}", orderId);

        LabOrder order = labOrderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Lab Order", orderId));
        String currentUserId = UserContextHolder.getUserDetails().getUserId();
        if (!order.getPatientId().equals(currentUserId) &&
                (order.getDoctorId() == null || !order.getDoctorId().equals(currentUserId))) {
            throw new AccessForbidden("Access denied to this lab order");
        }

        return mapToOrderResponse(order);
    }

    @Override
    public LabOrderResponse getOrderByNumber(String orderNumber) {
        log.info("Fetching order by number: {}", orderNumber);

        LabOrder order = labOrderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Lab Order with number", orderNumber));

        String currentUserId = UserContextHolder.getUserDetails().getUserId();
        if (!order.getPatientId().equals(currentUserId) &&
                (order.getDoctorId() == null || !order.getDoctorId().equals(currentUserId))) {
            throw new AccessForbidden("Access denied to this lab order");
        }

        return mapToOrderResponse(order);
    }

    @Override
    @Transactional
    @CacheEvict(value = {"labOrders", "patientOrders"}, allEntries = true)
    public LabOrderResponse updateOrderStatus(String orderId, OrderStatus newStatus) {
        log.info("Updating order status for order: {} to status: {}", orderId, newStatus);

        LabOrder order = labOrderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Lab Order", orderId));

        validateStatusTransition(order.getStatus(), newStatus);

        order.setStatus(newStatus);
        LabOrder updatedOrder = labOrderRepository.save(order);

        log.info("Order status updated successfully for order: {}", orderId);
        return mapToOrderResponse(updatedOrder);
    }

    @Override
    @Transactional
    @CacheEvict(value = {"labOrders", "patientOrders"}, allEntries = true)
    public LabOrderResponse cancelOrder(String orderId, String cancellationReason) {
        log.info("Cancelling order: {} with reason: {}", orderId, cancellationReason);

        LabOrder order = labOrderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Lab Order", orderId));

        String currentUserId = UserContextHolder.getUserDetails().getUserId();
        if (!order.getPatientId().equals(currentUserId)) {
            throw new AccessForbidden("Only patient can cancel their own orders");
        }

        if (order.getStatus() == OrderStatus.COMPLETED ||
                order.getStatus() == OrderStatus.CANCELLED) {
            throw new IllegalState("Cannot cancel order in current status: " + order.getStatus());
        }

        order.setStatus(OrderStatus.CANCELLED);
        order.setCancellationReason(cancellationReason);

        LabOrder cancelledOrder = labOrderRepository.save(order);
        log.info("Order cancelled successfully: {}", orderId);

        return mapToOrderResponse(cancelledOrder);
    }

    private void validateCreateOrderRequest(CreateLabOrderRequest request) {
        if (request.getTestIds() == null || request.getTestIds().isEmpty()) {
            throw new ValidationException("testIds", "At least one test must be selected");
        }

        if (request.getScheduledDateTime().isBefore(LocalDateTime.now())) {
            throw new ValidationException("scheduledDateTime", "Scheduled date time must be in the future");
        }

        int hour = request.getScheduledDateTime().getHour();
        if (hour < 8 || hour > 18) {
            throw new ValidationException("scheduledDateTime", "Lab tests can only be scheduled between 8 AM and 6 PM");
        }
    }

    private List<LabTest> validateAndFetchTests(List<String> testIds) {
        List<LabTest> tests = labTestRepository.findAllById(testIds);

        if (tests.size() != testIds.size()) {
            throw new ResourceNotFoundException("Some lab tests not found");
        }

        List<LabTest> inactiveTests = tests.stream()
                .filter(test -> !test.isActive())
                .toList();

        if (!inactiveTests.isEmpty()) {
            throw new ServiceUnavailable("Some selected tests are no longer available");
        }

        return tests;
    }

    private void validateStatusTransition(OrderStatus currentStatus, OrderStatus newStatus) {
        boolean isValidTransition = switch (currentStatus) {
            case PENDING_PAYMENT -> newStatus == OrderStatus.CONFIRMED ||
                    newStatus == OrderStatus.CANCELLED;
            case CONFIRMED -> newStatus == OrderStatus.SAMPLE_COLLECTION_SCHEDULED ||
                    newStatus == OrderStatus.CANCELLED;
            case SAMPLE_COLLECTION_SCHEDULED -> newStatus == OrderStatus.SAMPLE_COLLECTED ||
                    newStatus == OrderStatus.CANCELLED;
            case SAMPLE_COLLECTED -> newStatus == OrderStatus.IN_PROGRESS;
            case IN_PROGRESS -> newStatus == OrderStatus.COMPLETED;
            case COMPLETED, CANCELLED -> false;
        };

        if (!isValidTransition) {
            throw new ServiceUnavailable(
                    String.format("Invalid status transition from %s to %s", currentStatus, newStatus)
            );
        }
    }

    private LabOrderResponse mapToOrderResponse(LabOrder order) {
        LabOrderResponse response = modelMapper.map(order, LabOrderResponse.class);

        // TODO: Fetch patient and doctor names using gRPC clients
        // response.setPatientName(patientGrpcClient.getPatientName(order.getPatientId()));
        // if (order.getDoctorId() != null) {
        //     response.setDoctorName(doctorGrpcClient.getDoctorName(order.getDoctorId()));
        // }

        return response;
    }
}
