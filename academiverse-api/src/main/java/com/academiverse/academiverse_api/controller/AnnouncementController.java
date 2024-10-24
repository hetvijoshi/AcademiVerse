package com.academiverse.academiverse_api.controller;

import com.academiverse.academiverse_api.dto.request.AnnouncementSaveRequest;
import com.academiverse.academiverse_api.dto.response.BaseResponse;
import com.academiverse.academiverse_api.service.AnnouncementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/announcement")
@RequiredArgsConstructor
@Validated
public class AnnouncementController {
    private final AnnouncementService announcementService;
    @GetMapping("/")
    public ResponseEntity<BaseResponse> getAnnouncementsByInstructId(@RequestParam Long instructId){
        return ResponseEntity.ok().body(announcementService.getAnnouncementsByInstructId(instructId));
    }

    @PostMapping("/")
    public ResponseEntity<BaseResponse> postAnnouncement(@RequestBody AnnouncementSaveRequest announcementSaveRequest){
        return ResponseEntity.ok().body(announcementService.saveAnnouncement(announcementSaveRequest));
    }
}
