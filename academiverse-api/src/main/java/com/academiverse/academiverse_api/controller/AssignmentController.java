package com.academiverse.academiverse_api.controller;

import com.academiverse.academiverse_api.dto.request.AssignmentSaveRequest;
import com.academiverse.academiverse_api.dto.request.AssignmentUpdateRequest;
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

    @GetMapping
    public ResponseEntity<BaseResponse> getAllAssignments() {
        return ResponseEntity.ok().body(assignmentService.getAllAssignments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse> getAssignmentById(@PathVariable Long id) {
        return ResponseEntity.ok().body(assignmentService.getAssignmentById(id));
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
}
