package com.aarogya.doctor_service.models.forum;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "forum_thread_views")
@CompoundIndex(def = "{'threadId': 1, 'doctorId': 1}", unique = true)
public class ThreadView {
    @Id
    private String id;

    @NotBlank
    private String threadId;

    @NotBlank
    private String doctorId;

    @CreatedDate
    private LocalDateTime viewedAt;
}
