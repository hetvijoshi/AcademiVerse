package com.academiverse.academiverse_api.controller;

import com.academiverse.academiverse_api.dto.response.BaseResponse;
import com.academiverse.academiverse_api.service.EnrolmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/enrollments")
@RequiredArgsConstructor
@Validated
public class EnrolmentController {
    private final EnrolmentService enrolmentService;

    @GetMapping("/eligible/{instructId}")
    public ResponseEntity<BaseResponse<List<Long>>> getEligibleStudents(@PathVariable Long instructId) {
        return ResponseEntity.ok().body(enrolmentService.getEligibleStudents(instructId));
    }

    @PostMapping("/")
    public ResponseEntity<BaseResponse<String>> enrollStudent(@RequestParam Long userId, @RequestParam Long instructId) {
        return ResponseEntity.ok().body(enrolmentService.enrollStudent(userId, instructId));
    }
}
