package com.aarogya.lab_service.repository;

import com.aarogya.lab_service.enums.ResultFlag;
import com.aarogya.lab_service.enums.ResultStatus;
import com.aarogya.lab_service.model.TestResult;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TestResultRepository extends MongoRepository<TestResult, String> {

    List<TestResult> findByOrderIdOrderByResultDateDesc(String orderId);

    Page<TestResult> findByPatientIdOrderByResultDateDesc(String patientId, Pageable pageable);

    Page<TestResult> findByStatusOrderByResultDateDesc(ResultStatus status, Pageable pageable);

    List<TestResult> findByIsCriticalTrueAndStatusOrderByResultDateDesc(ResultStatus status);

    List<TestResult> findByFlagOrderByResultDateDesc(ResultFlag flag);

    List<TestResult> findByTestIdAndPatientIdOrderByResultDateDesc(String testId, String patientId);

    Optional<TestResult> findByOrderIdAndTestId(String orderId, String testId);

    List<TestResult> findByResultDateBetweenOrderByResultDateDesc(LocalDateTime startDate, LocalDateTime endDate);

    List<TestResult> findByStatusInOrderByResultDateAsc(List<ResultStatus> statuses);

    @Query("{ 'status': 'REVIEWED', 'approvedBy': null }")
    List<TestResult> findResultsRequiringApproval();

    @Query("{ 'flag': { $in: ['HIGH', 'LOW', 'CRITICAL_HIGH', 'CRITICAL_LOW', 'ABNORMAL'] } }")
    List<TestResult> findAbnormalResults();

    long countByStatus(ResultStatus status);

    long countByIsCriticalTrue();
}
