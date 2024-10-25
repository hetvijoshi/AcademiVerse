package com.academiverse.academiverse_api.dto.request;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
public class AssignmentSaveRequest {
    public Long assignmentId;
    public Long instructId;
    public String assignmentTitle;
    public String assignmentDescription;
    public LocalDateTime assignmentDueDate;
    public float assignmentWeightage;
    public int totalMarks;
    public boolean active;
    public Long createdBy;
    public Long updatedBy;
}
