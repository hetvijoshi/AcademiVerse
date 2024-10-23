package com.academiverse.academiverse_api.service;

import com.academiverse.academiverse_api.dto.request.AnnouncementSaveRequest;
import com.academiverse.academiverse_api.dto.response.BaseResponse;
import com.academiverse.academiverse_api.model.Announcement;
import com.academiverse.academiverse_api.model.Degree;
import com.academiverse.academiverse_api.repository.AnnouncementRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnnouncementService {
    private final AnnouncementRepository announcementRepository;
    public BaseResponse<List<Announcement>> getAnnouncementsByInstructId(Long instructId){
        List<Announcement> announcementList = announcementRepository.findByInstructInstructId(instructId);
        BaseResponse<List<Announcement>> response = new BaseResponse<>();
        response.data = announcementList;
        response.message = "List of all announcements.";
        response.isError = false;
        return response;
    }

    public BaseResponse<Announcement> saveAnnouncement(AnnouncementSaveRequest announcementSaveRequest){

    }



}
