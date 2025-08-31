package com.aarogya.doctor_service.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RatingFilterRequest {
    private Integer minRating;
    private Integer maxRating;
    private List<String> tags;
    private Boolean hasReview;
    private Boolean wouldRecommend;
    private Boolean isVerified;
    private String sortBy;
    private String sortOrder;
    private Integer page;
    private Integer size;
}
