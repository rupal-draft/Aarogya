package com.aarogya.doctor_service.dto.forum.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MostUpvotedThreadResponse {
    private String title;
    private List<String> tags;
    private String content;
    private Integer upvoteCount;
    private Boolean isActive;
}
