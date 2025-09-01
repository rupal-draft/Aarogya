package com.aarogya.doctor_service.repositories.forum;

import com.aarogya.doctor_service.dto.forum.request.ThreadFilterRequest;
import com.aarogya.doctor_service.models.forum.ForumThread;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ThreadRepositoryCustom {
    Page<ForumThread> findByFilters(ThreadFilterRequest filter, Pageable pageable, String doctorId);
}
