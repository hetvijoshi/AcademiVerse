package com.academiverse.academiverse_api.controller;

import com.academiverse.academiverse_api.dto.response.BaseResponse;
import com.academiverse.academiverse_api.service.CourseService;
import com.academiverse.academiverse_api.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/courses")
@RequiredArgsConstructor
@Validated
public class CourseController {
    private final CourseService courseService;

    @GetMapping("")
    public ResponseEntity<BaseResponse> getAllCourses(){
        return ResponseEntity.ok().body(courseService.getAllCourses());
    }

    @GetMapping("/{departmentId}")
    public ResponseEntity<BaseResponse> getCoursesByDepartment(@PathVariable Long departmentId){
        return ResponseEntity.ok().body(courseService.getCoursesByDepartment(departmentId));
    }
}
