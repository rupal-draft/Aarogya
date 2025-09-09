package com.aarogya.doctor_service.dto.forum.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EngagementTrendDto {
    private Integer year;
    private Integer month;
    private Long threadCount;
    private Long replyCount;
}
