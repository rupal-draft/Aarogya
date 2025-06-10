package com.aarogya.pharmacy_service.service.implementations;

import com.aarogya.pharmacy_service.auth.UserContextHolder;
import com.aarogya.pharmacy_service.documents.Medicine;
import com.aarogya.pharmacy_service.documents.Order;
import com.aarogya.pharmacy_service.documents.OrderItem;
import com.aarogya.pharmacy_service.documents.enums.OrderStatus;
import com.aarogya.pharmacy_service.dto.cart.CartDTO;
import com.aarogya.pharmacy_service.dto.order.OrderCreationDTO;
import com.aarogya.pharmacy_service.dto.order.OrderDTO;
import com.aarogya.pharmacy_service.dto.order.OrderItemCreationDTO;
import com.aarogya.pharmacy_service.dto.order.OrderStatusUpdateDTO;
import com.aarogya.pharmacy_service.exceptions.*;
import com.aarogya.pharmacy_service.mapper.OrderMapper;
import com.aarogya.pharmacy_service.repository.MedicineRepository;
import com.aarogya.pharmacy_service.repository.OrderRepository;
import com.aarogya.pharmacy_service.service.CartService;
import com.aarogya.pharmacy_service.service.OrderService;
import com.aarogya.pharmacy_service.utils.CheckRole;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final MedicineRepository medicineRepository;
    private final OrderMapper orderMapper;
    private final CartService cartService;

    @Transactional
    @CacheEvict(value = "orders", allEntries = true)
    public OrderDTO placeOrder(OrderCreationDTO orderCreationDTO) {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        log.info("Placing order for patient: {}", patientId);
        try {
            List<OrderItem> orderItems = orderCreationDTO.getItems().stream()
                    .map(item -> {
                        Medicine medicine = medicineRepository.findById(item.getMedicineId())
                                .orElseThrow(() -> new MedicineNotFoundException(item.getMedicineId()));

                        if (medicine.getStockQuantity() < item.getQuantity()) {
                            throw new InsufficientStockException(medicine.getName());
                        }

                        medicine.setStockQuantity(medicine.getStockQuantity() - item.getQuantity());
                        medicineRepository.save(medicine);

                        return OrderItem.builder()
                                .medicineId(medicine.getId())
                                .medicineName(medicine.getName())
                                .medicineImage(medicine.getImages().getFirst())
                                .quantity(item.getQuantity())
                                .price(medicine.getPrice())
                                .build();
                    })
                    .collect(Collectors.toList());

            BigDecimal totalAmount = orderItems.stream()
                    .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            Order order = Order.builder()
                    .patientId(patientId)
                    .items(orderItems)
                    .totalAmount(totalAmount)
                    .status(OrderStatus.PENDING)
                    .shippingAddress(orderCreationDTO.getShippingAddress())
                    .paymentMethod(orderCreationDTO.getPaymentMethod())
                    .orderDate(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            Order savedOrder = orderRepository.save(order);
            return orderMapper.toDTO(savedOrder);
        } catch (Exception e) {
            log.error("Error while placing order: {}", e.getMessage());
            throw new ServiceUnavailable(e.getLocalizedMessage());
        }
    }

    @Transactional
    @CacheEvict(value = "orders", allEntries = true)
    public OrderDTO placeOrderFromCart(OrderCreationDTO orderCreationDTO) {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        log.info("Placing order from cart for patient: {}", patientId);
        try {
            CartDTO cart = cartService.getCart(patientId);

            OrderCreationDTO orderDTO = OrderCreationDTO.builder()
                    .items(cart.getItems().stream()
                            .map(item -> new OrderItemCreationDTO(item.getMedicineId(), item.getQuantity()))
                            .collect(Collectors.toList()))
                    .shippingAddress(orderCreationDTO.getShippingAddress())
                    .paymentMethod(orderCreationDTO.getPaymentMethod())
                    .build();

            OrderDTO placedOrder = placeOrder(orderDTO);

            cartService.clearCart(patientId);

            return placedOrder;
        } catch (Exception e) {
            log.error("Error while placing order from cart: {}", e.getMessage());
            throw new ServiceUnavailable(e.getLocalizedMessage());
        }
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "orders", key = "#patientId")
    public List<OrderDTO> getOrdersByPatient(String patientId) {
        CheckRole.checkRole(UserContextHolder.getUserDetails().getRole(), "ADMIN");
        log.info("Getting orders for patient: {}", patientId);
        try {
            return orderRepository.findByPatientId(patientId).stream()
                    .map(orderMapper::toDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error while getting orders for patient: {}", e.getMessage());
            throw new ServiceUnavailable(e.getLocalizedMessage());
        }
    }

    @Override
    public List<OrderDTO> getMyOrders() {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        log.info("Getting orders for patient: {}", patientId);
        try {
            return orderRepository.findByPatientId(patientId).stream()
                    .map(orderMapper::toDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error while getting orders for patient: {}", e.getMessage());
            throw new ServiceUnavailable(e.getLocalizedMessage());
        }
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "orders", key = "#id")
    public OrderDTO getOrderById(String id) {
        log.info("Getting order with id: {}", id);
        try {
            Order order = orderRepository.findById(id)
                    .orElseThrow(() -> new OrderNotFoundException(id));
            return orderMapper.toDTO(order);
        } catch (Exception e) {
            log.error("Error while getting order with id: {}", e.getMessage());
            throw new ServiceUnavailable(e.getLocalizedMessage());
        }
    }

    @Transactional
    @CacheEvict(value = "orders", allEntries = true)
    public OrderDTO updateOrderStatus(String id, OrderStatusUpdateDTO statusUpdateDTO) {
        CheckRole.checkRole(UserContextHolder.getUserDetails().getRole(), "ADMIN");
        log.info("Updating order status for order with id: {}", id);
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException(id));

        try {
            OrderStatus newStatus = OrderStatus.valueOf(statusUpdateDTO.getStatus().toUpperCase());
            order.setStatus(newStatus);
            order.setUpdatedAt(LocalDateTime.now());

            Order updatedOrder = orderRepository.save(order);
            return orderMapper.toDTO(updatedOrder);
        } catch (IllegalArgumentException e) {
            throw new InvalidOrderStatusException(statusUpdateDTO.getStatus());
        }
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "orders", key = "#status")
    public List<OrderDTO> getOrdersByStatus(String status) {
        CheckRole.checkRole(UserContextHolder.getUserDetails().getRole(), "ADMIN");
        try {
            OrderStatus orderStatus = OrderStatus.valueOf(status.toUpperCase());
            return orderRepository.findByStatus(orderStatus).stream()
                    .map(orderMapper::toDTO)
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            throw new InvalidOrderStatusException(status);
        }
    }
}
