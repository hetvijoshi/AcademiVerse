package com.academiverse.academiverse_api.service;

import com.academiverse.academiverse_api.dto.request.GradeSaveRequest;
import com.academiverse.academiverse_api.dto.request.GradeUpdateRequest; // Importing GradeUpdateRequest
import com.academiverse.academiverse_api.dto.response.BaseResponse;
import com.academiverse.academiverse_api.model.Grade;
import com.academiverse.academiverse_api.model.Assignment;
import com.academiverse.academiverse_api.repository.AssignmentRepository;
import com.academiverse.academiverse_api.repository.GradeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class GradeService {
    private final GradeRepository gradeRepository;
    private final AssignmentRepository assignmentRepository;

    public GradeService(GradeRepository gradeRepository, AssignmentRepository assignmentRepository) {
        this.gradeRepository = gradeRepository;
        this.assignmentRepository = assignmentRepository;
    }

    public BaseResponse<Grade> addAssignmentGrade(GradeSaveRequest request) {
        BaseResponse<Grade> response = new BaseResponse<>();

        // Find the associated assignment
        Assignment assignment = assignmentRepository.findById(request.assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found."));

        // Create a new Grade object
        Grade grade = new Grade();
        grade.setAssignment(assignment);
        grade.setUserId(request.studentId);
        grade.setObtainedMarks(request.marks);
        grade.setCreatedAt(LocalDateTime.now());
        grade.setUpdatedAt(LocalDateTime.now());
        grade.setCreatedBy(request.createdBy);
        grade.setUpdatedBy(request.updatedBy);

        // Save the grade to the repository
        Grade savedGrade = gradeRepository.save(grade);
        response.data = savedGrade; // Assign the saved grade to response data
        response.isError = false;
        response.message = "Grade added successfully.";
        return response;
    }

    public BaseResponse<List<Grade>> getStudentGrades(Long studentId) {
        BaseResponse<List<Grade>> response = new BaseResponse<>();
        List<Grade> grades = gradeRepository.findByStudentId(studentId); // Ensure this method exists
        response.data = grades; // Assign the list of grades to response data
        response.isError = false; // No error, so set to false
        response.message = "List of grades retrieved successfully.";
        return response;
    }

    public BaseResponse<Grade> updateGrade(GradeUpdateRequest request) {
        BaseResponse<Grade> response = new BaseResponse<>();

        // Find the existing grade by ID
        Grade existingGrade = gradeRepository.findById(request.gradeId)
                .orElseThrow(() -> new RuntimeException("Grade not found."));


        // Update fields
        existingGrade.setObtainedMarks(request.marks);
        existingGrade.setUpdatedAt(LocalDateTime.now());
        existingGrade.setUpdatedBy(request.updatedBy);

        // Save the updated grade
        Grade updatedGrade = gradeRepository.save(existingGrade);
        response.data = updatedGrade;
        response.isError = false;
        response.message = "Grade updated successfully.";
        return response;
    }
}
