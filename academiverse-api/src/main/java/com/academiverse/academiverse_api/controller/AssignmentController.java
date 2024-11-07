package com.academiverse.academiverse_api.controller;

import com.academiverse.academiverse_api.dto.request.*;
import com.academiverse.academiverse_api.dto.response.BaseResponse;
import com.academiverse.academiverse_api.service.AssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/assignments")
@RequiredArgsConstructor
@Validated
public class AssignmentController {
    private final AssignmentService assignmentService;

    @GetMapping("/student")
    public ResponseEntity<BaseResponse> getAssignmentsForStudentByInstruct(@RequestParam Long instructId, @RequestParam Long userId ) {
        return ResponseEntity.ok().body(assignmentService.getAssignmentsForStudentByInstruct(instructId, userId));
    }


    @GetMapping("/detail")
    public ResponseEntity<BaseResponse> getAssignmentById(@RequestParam Long assignmentId, @RequestParam Long userId) {
        return ResponseEntity.ok().body(assignmentService.getAssignmentById(assignmentId, userId));
    }

    @PostMapping
    public ResponseEntity<BaseResponse> saveAssignment(@RequestBody AssignmentSaveRequest assignmentRequest) {
        return ResponseEntity.ok().body(assignmentService.saveAssignment(assignmentRequest));
    }

    @PutMapping
    public ResponseEntity<BaseResponse> updateAssignment(@RequestBody AssignmentUpdateRequest assignmentRequest) {
        return ResponseEntity.ok().body(assignmentService.updateAssignment(assignmentRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<BaseResponse> deleteAssignmentById(@PathVariable Long id) {
        return ResponseEntity.ok().body(assignmentService.deleteAssignmentById(id));
    }

    @GetMapping("/instruct/{instructId}/active")
    public ResponseEntity<BaseResponse> getActiveAssignmentsForInstruct(@PathVariable Long instructId) {
        return ResponseEntity.ok().body(assignmentService.getActiveAssignmentsForInstruct(instructId));
    }

    @GetMapping("/instruct/{instructId}")
    public ResponseEntity<BaseResponse> getAssignmentsForInstruct(@PathVariable Long instructId) {
        return ResponseEntity.ok().body(assignmentService.getAssignmentsForInstruct(instructId));
    }

    @PostMapping("/active/{assignmentId}")
    public ResponseEntity<BaseResponse> activateAssignment(@PathVariable Long assignmentId) {
        return ResponseEntity.ok().body(assignmentService.activateAssignment(assignmentId));
    }

    @PostMapping("/submit")
    public ResponseEntity<BaseResponse> saveAssignmentSubmission(@RequestBody AssignmentSubmitRequest assignmentSubmitRequest) {
        return ResponseEntity.ok().body(assignmentService.submitAssignment(assignmentSubmitRequest));
    }

    @GetMapping("/submittedAssignment")
    public ResponseEntity<BaseResponse> getAssignmentSubmission(@RequestBody AssignmentSubmitGetRequest assignmentSubmitGetRequest) {
        return ResponseEntity.ok().body(assignmentService.getAssignmentSubmission(assignmentSubmitGetRequest));
    }

}
