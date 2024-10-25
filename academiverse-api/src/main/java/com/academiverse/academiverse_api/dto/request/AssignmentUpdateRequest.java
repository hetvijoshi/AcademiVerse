package com.academiverse.academiverse_api.dto.request;

import java.time.LocalDateTime;

public class AssignmentUpdateRequest {
    public Long assignmentId;
    public Long instructId;
    public String assignmentTitle;
    public String assignmentDescription;
    public LocalDateTime assignmentDueDate;
    public float assignmentWeightage;
    public int totalMarks;
    public boolean active;
    public Long updatedBy;
}
