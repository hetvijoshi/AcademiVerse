package com.academiverse.academiverse_api.controller;

import com.academiverse.academiverse_api.dto.request.ModuleSaveRequest;
import com.academiverse.academiverse_api.dto.response.BaseResponse;
import com.academiverse.academiverse_api.service.ModuleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/modules")
@RequiredArgsConstructor
@Validated
public class ModuleController {
    private final ModuleService moduleService;

    @GetMapping("/")
    public ResponseEntity<BaseResponse> getModulesByInstructId(@RequestParam Long instructId){
        return ResponseEntity.ok().body(moduleService.getModulesByInstructId(instructId));
    }

    @PostMapping("/")
    public ResponseEntity<BaseResponse> saveModule(@RequestBody ModuleSaveRequest moduleSaveRequest){
        return ResponseEntity.ok().body(moduleService.saveModule(moduleSaveRequest));
    }
}
