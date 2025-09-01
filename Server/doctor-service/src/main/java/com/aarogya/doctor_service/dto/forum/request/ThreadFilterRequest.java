package com.aarogya.doctor_service.dto.forum.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ThreadFilterRequest {
    private List<String> tags;
    private String type;
    private String status;
    private String authorId;
    private Boolean bookmarked;
    private Boolean participated;
    private String searchQuery;
    private String sortBy;
    private String sortOrder;
    private Integer page;
    private Integer size;
}
