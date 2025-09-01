package com.aarogya.doctor_service.dto.forum.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TagResponse {
    private String id;
    private String name;
    private String description;
    private Integer threadCount;
    private Integer followerCount;
    private Boolean isSubscribed;
}
