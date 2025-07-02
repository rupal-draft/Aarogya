package com.aarogya.lab_service.repository;

import com.aarogya.lab_service.enums.OrderPriority;
import com.aarogya.lab_service.enums.OrderStatus;
import com.aarogya.lab_service.model.TestOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TestOrderRepository extends MongoRepository<TestOrder, String> {

    Page<TestOrder> findByPatientIdOrderByOrderDateDesc(String patientId, Pageable pageable);

    Page<TestOrder> findByDoctorIdOrderByOrderDateDesc(String doctorId, Pageable pageable);

    Page<TestOrder> findByStatusOrderByOrderDateDesc(OrderStatus status, Pageable pageable);

    List<TestOrder> findByPriorityOrderByOrderDateAsc(OrderPriority priority);

    Page<TestOrder> findByPatientIdAndStatusOrderByOrderDateDesc(String patientId, OrderStatus status, Pageable pageable);

    Page<TestOrder> findByDoctorIdAndStatusOrderByOrderDateDesc(String doctorId, OrderStatus status, Pageable pageable);

    List<TestOrder> findByOrderDateBetweenOrderByOrderDateDesc(LocalDateTime startDate, LocalDateTime endDate);

    @Query("{ 'status': 'PENDING', 'orderDate': { $gte: ?0 } }")
    List<TestOrder> findPendingOrdersAfterDate(LocalDateTime date);

    @Query("{ 'status': { $in: ['PENDING', 'CONFIRMED'] }, 'expectedCompletionDate': { $lt: ?0 } }")
    List<TestOrder> findOverdueOrders(LocalDateTime currentDate);

    List<TestOrder> findByIsHomeCollectionTrueAndStatusOrderByPreferredCollectionTimeAsc(OrderStatus status);

    long countByStatus(OrderStatus status);

    long countByPatientId(String patientId);

    long countByDoctorId(String doctorId);

    List<TestOrder> findByAssignedTechnicianOrderByOrderDateDesc(String technicianId);
}

