package com.academiverse.academiverse_api.controller;

import com.academiverse.academiverse_api.dto.request.EnrolmentSaveRequest;
import com.academiverse.academiverse_api.dto.response.BaseResponse;
import com.academiverse.academiverse_api.dto.response.EnrolEligibleResponse;
import com.academiverse.academiverse_api.model.Enrolment;
import com.academiverse.academiverse_api.service.EnrolmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/enrolments")
@RequiredArgsConstructor
@Validated
public class EnrolmentController {
    private final EnrolmentService enrolmentService;

    @GetMapping("/{instructId}")
    public ResponseEntity<BaseResponse> getInstructStudents(@PathVariable Long instructId) {
        return ResponseEntity.ok().body(enrolmentService.getInstructStudents(instructId));
    }

    @GetMapping("/eligible/{instructId}")
    public ResponseEntity<BaseResponse<List<EnrolEligibleResponse>>> getEligibleStudents(@PathVariable Long instructId) {
        return ResponseEntity.ok().body(enrolmentService.getEligibleStudents(instructId));
    }

    @PostMapping("/")
    public ResponseEntity<BaseResponse<Enrolment>> enrollStudent(@RequestBody EnrolmentSaveRequest enrolmentSaveRequest) {
        return ResponseEntity.ok().body(enrolmentService.enrollStudent(enrolmentSaveRequest));
    }
}
