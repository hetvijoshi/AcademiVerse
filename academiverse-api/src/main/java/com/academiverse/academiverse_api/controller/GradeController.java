package com.academiverse.academiverse_api.controller;

import com.academiverse.academiverse_api.dto.request.GradeSaveRequest;
import com.academiverse.academiverse_api.dto.request.GradeUpdateRequest;
import com.academiverse.academiverse_api.dto.response.BaseResponse;
import com.academiverse.academiverse_api.model.Grade;
import com.academiverse.academiverse_api.service.GradeService;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grades")
@RequiredArgsConstructor
@Validated
public class GradeController {
    private final GradeService gradeService;

    @PostMapping("/save")
    public ResponseEntity<BaseResponse<Grade>> saveGrade(@RequestBody GradeSaveRequest request) {
        BaseResponse<Grade> response = gradeService.addAssignmentGrade(request); // Changed method name
        return ResponseEntity.ok(response);
    }

    @PutMapping("/update")
    public ResponseEntity<BaseResponse<Grade>> updateGrade(@RequestBody GradeUpdateRequest request) {
        BaseResponse<Grade> response = gradeService.updateGrade(request); // Ensure this method exists in GradeService
        return ResponseEntity.ok(response);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<BaseResponse<List<Grade>>> getStudentGrades(@PathVariable Long studentId) {
        BaseResponse<List<Grade>> response = gradeService.getStudentGrades(studentId);
        return ResponseEntity.ok(response);
    }
}
