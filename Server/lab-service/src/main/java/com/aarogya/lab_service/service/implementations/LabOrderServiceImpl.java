package com.aarogya.lab_service.service.implementations;

import com.aarogya.lab_service.auth.UserContextHolder;
import com.aarogya.lab_service.clients.UserGrpcClient;
import com.aarogya.lab_service.dto.grpc.DoctorResponseDTO;
import com.aarogya.lab_service.dto.grpc.PatientResponseDTO;
import com.aarogya.lab_service.dto.request.CreateLabOrderRequest;
import com.aarogya.lab_service.dto.response.LabOrderResponse;
import com.aarogya.lab_service.enums.OrderStatus;
import com.aarogya.lab_service.enums.PaymentStatus;
import com.aarogya.lab_service.enums.TestStatus;
import com.aarogya.lab_service.exceptions.*;
import com.aarogya.lab_service.models.LabOrder;
import com.aarogya.lab_service.models.LabTest;
import com.aarogya.lab_service.repository.LabOrderRepository;
import com.aarogya.lab_service.repository.LabTestRepository;
import com.aarogya.lab_service.service.LabOrderService;
import com.aarogya.lab_service.service.LabResultService;
import com.aarogya.payment_service.events.LabOrderStatusUpdateEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
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
    private final UserGrpcClient userGrpcClient;
    private final LabResultService labResultService;

    @Override
    @Transactional
    @CacheEvict(value = {"labOrders", "patientOrders"}, allEntries = true)
    public LabOrderResponse collectSample(String orderId, String technicianId) {
        log.info("Collecting sample for order: {} by technician: {}", orderId, technicianId);

        LabOrder order = labOrderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Lab Order", orderId));

        if (order.getStatus() != OrderStatus.SAMPLE_COLLECTION_SCHEDULED) {
            throw new LabServiceException("Order is not ready for sample collection", "INVALID_STATUS");
        }

        order.setStatus(OrderStatus.SAMPLE_COLLECTED);

        order.getOrderedTests().forEach(test -> {
            test.setStatus(TestStatus.SAMPLE_COLLECTED);
            test.setSampleCollectedAt(LocalDateTime.now());
        });

        LabOrder updatedOrder = labOrderRepository.save(order);

        labResultService.createResultsForOrder(orderId);

        log.info("Sample collected successfully for order: {}", orderId);
        return mapToOrderResponse(updatedOrder);
    }

    @Override
    public List<LabOrderResponse> getCollectionSchedule(LocalDate date) {
        log.info("Fetching collection schedule for date: {}", date);

        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(23, 59, 59);

        List<LabOrder> orders = labOrderRepository.findByStatusAndScheduledDateTimeBetween(
                OrderStatus.SAMPLE_COLLECTION_SCHEDULED, startOfDay, endOfDay);

        return orders.stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    @CacheEvict(value = {"labOrders", "patientOrders"}, allEntries = true)
    public LabOrderResponse rescheduleOrder(String orderId, LocalDateTime newDateTime) {
        log.info("Rescheduling order: {} to new time: {}", orderId, newDateTime);

        LabOrder order = labOrderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Lab Order", orderId));

        String currentUserId = UserContextHolder.getUserDetails().getUserId();
        if (!order.getPatientId().equals(currentUserId)) {
            throw new AccessForbidden("Access denied to reschedule this order");
        }

        if (order.getStatus() == OrderStatus.SAMPLE_COLLECTED ||
                order.getStatus() == OrderStatus.IN_PROGRESS ||
                order.getStatus() == OrderStatus.COMPLETED ||
                order.getStatus() == OrderStatus.CANCELLED) {
            throw new BadRequestException("Order cannot be rescheduled in current status");
        }

        if (newDateTime.isBefore(LocalDateTime.now())) {
            throw new ValidationException("newDateTime", "New scheduled time must be in the future");
        }

        order.setScheduledDateTime(newDateTime);
        LabOrder rescheduledOrder = labOrderRepository.save(order);

        log.info("Order rescheduled successfully: {}", orderId);
        return mapToOrderResponse(rescheduledOrder);
    }


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
                        .status(TestStatus.ORDERED)
                        .build()
                )
                .collect(Collectors.toList());

        // Calculate total amount
        BigDecimal totalAmount = tests.stream()
                .map(LabTest::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        LabOrder labOrder = LabOrder.builder()
                .orderNumber(generateOrderNumber())
                .patientId(patientId)
                .doctorId(request.getDoctorId())
                .orderedTests(orderedTests)
                .totalAmount(totalAmount)
                .status(OrderStatus.PENDING_PAYMENT)
                .paymentStatus(PaymentStatus.PENDING)
                .scheduledDateTime(request.getScheduledDateTime())
                .location(request.getLocation())
                .specialInstructions(request.getSpecialInstructions())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

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

    @Override
    @Transactional
    @KafkaListener(
            topics = "confirm-lab-order",
            groupId = "confirm-lab-order-group",
            containerFactory = "labOrderStatusUpdateKafkaListenerFactory"
    )
    @CacheEvict(value = {"labOrders", "patientOrders"}, allEntries = true)
    public void confirmOrder(LabOrderStatusUpdateEvent orderStatusUpdateEvent) {
        log.info("Processing order with payment id: {}", orderStatusUpdateEvent.getPaymentId());
        try {
            LabOrder order = labOrderRepository
                    .findById(orderStatusUpdateEvent.getOrderId())
                    .orElseThrow(() -> new ResourceNotFoundException("No order is found with id: " + orderStatusUpdateEvent.getOrderId()));

            order.setStatus(OrderStatus.CONFIRMED);
            order.setPaymentStatus(PaymentStatus.PAID);
            order.setPaymentId(orderStatusUpdateEvent.getPaymentId());
            labOrderRepository.save(order);
            log.info("Order processed with id: {}", order.getId());
        } catch (ResourceNotFoundException e) {
            log.error("Order not found: {}", e.getMessage());
            throw e;
        } catch (DataIntegrityViolationException e) {
            log.error("Data integrity violation while updating Order status", e);
            throw new DataIntegrityViolation("Error updating Order status");
        } catch (Exception e) {
            log.error("Unexpected error updating Order status", e);
            throw new ServiceUnavailable(e.getLocalizedMessage());
        }
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
        PatientResponseDTO patientResponseDTO = userGrpcClient.getPatient(order.getPatientId());
        response.setPatientName(patientResponseDTO.getFirstName() + " " + patientResponseDTO.getLastName());
        if (order.getDoctorId() != null) {
            DoctorResponseDTO doctorResponseDTO = userGrpcClient.getDoctor(order.getDoctorId());
            response.setDoctorName(doctorResponseDTO.getFirstName() + " " + doctorResponseDTO.getLastName());
        }

        if (response.getOrderNumber() == null) response.setOrderNumber("ORD-" + order.getId());
        if (response.getStatus() == null) response.setStatus(OrderStatus.PENDING_PAYMENT);
        if (response.getPaymentStatus() == null) response.setPaymentStatus(PaymentStatus.PENDING);

        if (response.getOrderedTests() != null) {
            response.getOrderedTests().forEach(test -> {
                if (test.getStatus() == null) test.setStatus(TestStatus.ORDERED);
            });
        }

        return response;
    }

    private String generateOrderNumber() {
        long count = labOrderRepository.count() + 1;
        return String.format("LAB-%s-%05d", LocalDate.now().getYear(), count);
    }
}
