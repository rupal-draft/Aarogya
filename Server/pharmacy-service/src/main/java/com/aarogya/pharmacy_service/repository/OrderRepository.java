package com.aarogya.pharmacy_service.repository;

import com.aarogya.pharmacy_service.documents.Order;
import com.aarogya.pharmacy_service.documents.enums.OrderStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByPatientId(String patientId);
    List<Order> findByStatus(OrderStatus status);
}
