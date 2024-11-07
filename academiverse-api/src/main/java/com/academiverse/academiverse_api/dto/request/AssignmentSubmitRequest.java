package com.academiverse.academiverse_api.dto.request;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor

public class AssignmentSubmitRequest {
    public Long assignmentId;
    public Long userId;
    public String assignmentLink;
    public Long createdBy;
    public LocalDateTime createdDate;
}
