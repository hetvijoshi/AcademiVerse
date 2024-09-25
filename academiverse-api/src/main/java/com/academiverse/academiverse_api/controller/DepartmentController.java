package com.academiverse.academiverse_api.controller;

import com.academiverse.academiverse_api.dto.response.BaseResponse;
import com.academiverse.academiverse_api.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/department")
@RequiredArgsConstructor
@Validated
public class DepartmentController {
    private final DepartmentService departmentService;
    @GetMapping("")
    public ResponseEntity<BaseResponse> getAllDepartments(){
        return ResponseEntity.ok().body(departmentService.getAllDepartments());
    }
}
