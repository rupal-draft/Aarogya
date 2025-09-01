package com.aarogya.prescription_service.repository;

import com.aarogya.prescription_service.model.TemplateUsageStat;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TemplateUsageStatRepository extends MongoRepository<TemplateUsageStat, String> {

    List<TemplateUsageStat> findByTemplateIdAndDoctorId(String templateId, String doctorId);

    List<TemplateUsageStat> findByDoctorIdAndUsageDateBetween(String doctorId, LocalDateTime start, LocalDateTime end);

    Integer countByTemplateId(String templateId);

    Integer countByTemplateIdAndUsageDateAfter(String templateId, LocalDateTime date);

    Page<TemplateUsageStat> findByDoctorIdOrderByUsageDateDesc(String doctorId, Pageable pageable);
}
