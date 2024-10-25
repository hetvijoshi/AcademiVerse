package com.academiverse.academiverse_api.controller;

import com.academiverse.academiverse_api.dto.request.DocumentSaveRequest;
import com.academiverse.academiverse_api.dto.response.BaseResponse;
import com.academiverse.academiverse_api.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/documents")
@RequiredArgsConstructor
@Validated
public class DocumentController {
    private final DocumentService documentService;

    @PostMapping("/")
    public ResponseEntity<BaseResponse> saveDocument(@RequestBody DocumentSaveRequest documentSaveRequest){
        return ResponseEntity.ok().body(documentService.saveDocument(documentSaveRequest));
    }
}
