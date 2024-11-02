package com.academiverse.academiverse_api.dto.request;

public class GradeSaveRequest {
    public Long instructId;      // ID of the instruction related to the grade
    public Long studentId;       // ID of the student for whom the grade is being assigned
    public Long assignmentId;    // ID of the assignment related to the grade
    public int marks;            // Marks assigned to the student
    public Long createdBy;       // ID of the user creating the grade
    public Long updatedBy;       // ID of the user updating the grade
}
