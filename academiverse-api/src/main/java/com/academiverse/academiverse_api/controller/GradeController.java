package com.academiverse.academiverse_api.controller;

import com.academiverse.academiverse_api.dto.request.GradeSaveRequest;
import com.academiverse.academiverse_api.dto.response.BaseResponse;
import com.academiverse.academiverse_api.service.GradeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/grades")
@RequiredArgsConstructor
@Validated
public class GradeController {
    private final GradeService gradeService;

    @GetMapping("/{instructId}/{studentId}")
    public ResponseEntity<BaseResponse> getStudentGrades(@PathVariable Long instructId, @PathVariable Long studentId) {
        return ResponseEntity.ok().body(gradeService.getStudentGrades(instructId, studentId));
    }

    @GetMapping("/{instructId}")
    public ResponseEntity<BaseResponse> getInstructGrades(@PathVariable Long instructId) {
        return ResponseEntity.ok().body(gradeService.getInstructGrades(instructId));
    }

    @GetMapping("/assignment/{assignmentId}")
    public ResponseEntity<BaseResponse> getAssignmentGrades(@PathVariable Long assignmentId) {
        return ResponseEntity.ok().body(gradeService.getAssignmentGrades(assignmentId));
    }

    @GetMapping("/quiz/{quizId}")
    public ResponseEntity<BaseResponse> getQuizGrades(@PathVariable Long quizId) {
        return ResponseEntity.ok().body(gradeService.getQuizGrades(quizId));
    }

    @PostMapping("/")
    public ResponseEntity<BaseResponse> saveGrades(@RequestBody GradeSaveRequest gradeSaveRequest) {
        return ResponseEntity.ok().body(gradeService.saveGrades(gradeSaveRequest));
    }
}
