package com.academiverse.academiverse_api.controller;

import com.academiverse.academiverse_api.dto.request.InstructSaveRequest;
import com.academiverse.academiverse_api.dto.request.InstructUpdateRequest;
import com.academiverse.academiverse_api.dto.response.BaseResponse;
import com.academiverse.academiverse_api.service.InstructService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/instructs")
@RequiredArgsConstructor
@Validated
public class InstructController {
    private final InstructService instructService;

    @GetMapping("")
    public ResponseEntity<BaseResponse> getAllInstructs(){
        return ResponseEntity.ok().body(instructService.getAllInstructs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse> getInstructById(@PathVariable Long id){
        return ResponseEntity.ok().body(instructService.getInstructById(id));
    }

    // Endpoint for professors to get only their courses for the current year and semester
    @GetMapping("/professor/{userId}")
    public ResponseEntity<BaseResponse> getProfessorCourses(@PathVariable Long userId,
                                                            @RequestParam int year,
                                                            @RequestParam String semester) {
        return ResponseEntity.ok().body(instructService.getProfessorCourses(userId, year, semester));
    }

    // Endpoint for students to get their enrolled courses
    @GetMapping("/student/{userId}")
    public ResponseEntity<BaseResponse> getStudentEnrolledCourses(@PathVariable Long userId,
                                                                  @RequestParam int year,
                                                                  @RequestParam String semester) {
        return ResponseEntity.ok().body(instructService.getStudentEnrolledCourses(userId, year, semester));
    }

    @PostMapping("/")
    public ResponseEntity<BaseResponse> saveInstruct(@RequestBody InstructSaveRequest instructRequest){
        return ResponseEntity.ok().body(instructService.saveInstruct(instructRequest));
    }

    @PutMapping("/")
    public ResponseEntity<BaseResponse> updateInstruct(@RequestBody InstructUpdateRequest instructRequest){
        return ResponseEntity.ok().body(instructService.updateInstruct(instructRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<BaseResponse> deleteInstructById(@PathVariable Long id){
        return ResponseEntity.ok().body(instructService.deleteInstructById(id));
    }
}
