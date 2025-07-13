package com.aarogya.lab_service.service.implementations;

import com.aarogya.lab_service.Clients.UserGrpcClient;
import com.aarogya.lab_service.auth.UserContextHolder;
import com.aarogya.lab_service.dto.request.TestOrderRequestDto;
import com.aarogya.lab_service.dto.response.TestOrderResponseDto;
import com.aarogya.lab_service.enums.OrderStatus;
import com.aarogya.lab_service.model.LabTest;
import com.aarogya.lab_service.model.TestOrder;
import com.aarogya.lab_service.repository.LabTestRepository;
import com.aarogya.lab_service.repository.TestOrderRepository;
import com.aarogya.lab_service.service.SampleCollectionService;
import com.aarogya.lab_service.service.TestOrderService;
import com.aarogya.lab_service.service.TestResultService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TestOrderServiceImpl implements TestOrderService {

    @Value("${order.maximum.tests:20}")
    private final int maximumTestsPerOrder;

    private final TestOrderRepository testOrderRepository;

    private final LabTestRepository labTestRepository;

    private final UserGrpcClient userGrpcClient;

    private final ModelMapper modelMapper;

    private final SampleCollectionService sampleCollectionService;

    private final TestResultService testResultService;

    @Override
    @Transactional
    @CacheEvict(value = "testOrders", allEntries = true)
    public TestOrderResponseDto createTestOrder(TestOrderRequestDto requestDto) {
        log.info("Creating test order for patient: {}", requestDto.getPatientId());

        validateTestOrderRequest(requestDto);
        String doctorId = UserContextHolder.getUserDetails().getUserId();

        List<LabTest> tests = validateAndGetTests(requestDto.getTestIds());

        TestOrder testOrder = buildTestOrder(requestDto, doctorId, tests);
        testOrder = testOrderRepository.save(testOrder);

        if (requestDto.getPaymentMethod() != null) {
            processPayment(testOrder, requestDto.getPaymentMethod());
        }

        scheduleSampleCollectionIfRequired(testOrder, requestDto);

        sendOrderNotifications(testOrder, tests);

        log.info("Test order created successfully with ID: {}", testOrder.getId());
        return mapToResponseDto(testOrder);
    }

    @Override
    @Transactional
    @CacheEvict(value = "testOrders", allEntries = true)
    public TestOrderResponseDto updateOrderStatus(String orderId, OrderStatus status, String reason) {
        log.info("Updating order status for ID: {} to {}", orderId, status);

        TestOrder testOrder = getOrderById(orderId);
        OrderStatus oldStatus = testOrder.getStatus();

        validateStatusTransition(oldStatus, status);
        updateOrderStatus(testOrder, status, reason);

        testOrder = testOrderRepository.save(testOrder);

        handleStatusChange(testOrder, oldStatus);

        log.info("Order status updated successfully for ID: {}", orderId);
        return mapToResponseDto(testOrder);
    }

    @Override
    @Cacheable(value = "testOrders", key = "#patientId + '#'+ #status + '#'+ #page + '#'+ #size")
    public Page<TestOrderResponseDto> getPatientOrders(String patientId, OrderStatus status, int page, int size) {
        validatePaginationParameters(page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.by("orderDate").descending());

        Page<TestOrder> orders = status != null ?
                testOrderRepository.findByPatientIdAndStatusOrderByOrderDateDesc(patientId, status, pageable) :
                testOrderRepository.findByPatientIdOrderByOrderDateDesc(patientId, pageable);

        return orders.map(this::mapToResponseDto);
    }

    @Override
    @Cacheable(value = "testOrders", key = "#doctorId + '#'+ #status + '#'+ #page + '#'+ #size")
    public Page<TestOrderResponseDto> getDoctorOrders(String doctorId, OrderStatus status, int page, int size) {
        validatePaginationParameters(page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.by("orderDate").descending());

        Page<TestOrder> orders = status != null ?
                testOrderRepository.findByDoctorIdAndStatusOrderByOrderDateDesc(doctorId, status, pageable) :
                testOrderRepository.findByDoctorIdOrderByOrderDateDesc(doctorId, pageable);

        return orders.map(this::mapToResponseDto);
    }

    @Override
    @Cacheable(value = "testOrders", key = "#orderId")
    public TestOrderResponseDto getOrderDetails(String orderId) {
        TestOrder testOrder = getOrderById(orderId);
        TestOrderResponseDto responseDto = mapToResponseDto(testOrder);

        if (testOrder.getStatus() == OrderStatus.COMPLETED) {
            responseDto.setTestResults(testResultService.getResultDetails(orderId));
        }

        return responseDto;
    }

    @Override
    public List<TestOrderResponseDto> getUrgentOrders() {
        return List.of();
    }

    @Override
    public List<TestOrderResponseDto> getOverdueOrders() {
        return List.of();
    }

    @Override
    public TestOrderResponseDto addTestsToOrder(String orderId, List<String> testIds) {
        return null;
    }

    @Override
    public TestOrderResponseDto removeTestsFromOrder(String orderId, List<String> testIds) {
        return null;
    }

    @Override
    public byte[] generateOrderPdf(String orderId) {
        return new byte[0];
    }
}
