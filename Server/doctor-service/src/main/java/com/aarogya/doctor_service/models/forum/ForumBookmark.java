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
@Document(collection = "forum_bookmarks")
@CompoundIndex(def = "{'doctorId': 1, 'threadId': 1}", unique = true)
public class ForumBookmark {
    @Id
    private String id;

    @NotBlank
    private String doctorId;

    @NotBlank
    private String threadId;

    @CreatedDate
    private LocalDateTime createdAt;
}
