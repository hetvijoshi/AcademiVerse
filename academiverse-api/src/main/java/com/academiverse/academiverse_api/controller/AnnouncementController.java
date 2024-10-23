package com.academiverse.academiverse_api.controller;

import com.academiverse.academiverse_api.dto.request.AnnouncementSaveRequest;
import com.academiverse.academiverse_api.dto.response.BaseResponse;
import com.academiverse.academiverse_api.service.AnnouncementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

public class AnnouncementController {
    private AnnouncementService announcementService;
    @GetMapping("/")
    public ResponseEntity<BaseResponse> getAnnouncementsByInstructId(@RequestBody Long instructId){
        return ResponseEntity.ok().body(announcementService.getAnnouncementsByInstructId(instructId));
    }

    @PostMapping("/")
    public ResponseEntity<BaseResponse> postAnnouncement(@RequestBody AnnouncementSaveRequest announcementSaveRequest){
        return ResponseEntity.ok().body(announcementService.saveAnnouncement(announcementSaveRequest));
    }
}
