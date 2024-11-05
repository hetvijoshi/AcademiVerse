package com.academiverse.academiverse_api.dto.request;

public class GradeUpdateRequest {
    public Long gradeId;         // ID of the grade to be updated
    public Long instructId;      // ID of the instruction related to the grade
    public Long studentId;       // ID of the student for whom the grade is being updated
    public Long assignmentId;    // ID of the assignment related to the grade
    public int marks;            // Updated marks for the student
    public Long updatedBy;       // ID of the user updating the grade
}
