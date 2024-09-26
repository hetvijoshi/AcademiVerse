package com.academiverse.academiverse_api.controller;

import com.academiverse.academiverse_api.dto.response.BaseResponse;
import com.academiverse.academiverse_api.service.DegreeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/degree")
@RequiredArgsConstructor
@Validated
public class DegreeController {
    private final DegreeService degreeService;
    @GetMapping("")
    public ResponseEntity<BaseResponse> getAllDegrees(){
        return ResponseEntity.ok().body(degreeService.getAllDegrees());
    }
}
