package com.academiverse.academiverse_api.service;

import com.academiverse.academiverse_api.dto.request.AnnouncementSaveRequest;
import com.academiverse.academiverse_api.dto.response.BaseResponse;
import com.academiverse.academiverse_api.model.Announcement;
import com.academiverse.academiverse_api.model.Degree;
import com.academiverse.academiverse_api.model.Instruct;
import com.academiverse.academiverse_api.model.User;
import com.academiverse.academiverse_api.repository.AnnouncementRepository;
import com.academiverse.academiverse_api.repository.InstructRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.text.MessageFormat;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnnouncementService {
    private final AnnouncementRepository announcementRepository;
    private final InstructRepository instructRepository;
    public BaseResponse<List<Announcement>> getAnnouncementsByInstructId(Long instructId){
        Optional<Instruct> instruct = instructRepository.findById(instructId);
        if(instruct.isPresent()){
            List<Announcement> announcementList = announcementRepository.findByInstructsInstructId(instructId);
            BaseResponse<List<Announcement>> response = new BaseResponse<>();
            response.data = announcementList;
            response.message = "List of all announcements.";
            response.isError = false;
            return response;
        }
        else{
            BaseResponse<List<Announcement>> response = new BaseResponse<>();
            response.data = null;
            response.isError = true;
            response.message = MessageFormat.format("Instruct with id: {0} does not exist", instructId);
            return response;
        }

    }

    public BaseResponse<Announcement> saveAnnouncement(AnnouncementSaveRequest announcementSaveRequest){
        Optional<Instruct> instruct = instructRepository.findById(announcementSaveRequest.instructId);
        if(instruct.isPresent()){
            Announcement a = new Announcement();
            a.setInstructs(instruct.get());
            a.setAnnouncementTitle(announcementSaveRequest.announcementTitle);
            a.setAnnouncementDescription(announcementSaveRequest.announcementDescription);
            a.setCreatedBy(announcementSaveRequest.createdBy);
            a.setUpdatedBy(announcementSaveRequest.updatedBy);
            a.setCreatedAt(LocalDateTime.now());
            a.setUpdatedAt(LocalDateTime.now());
            Announcement savedAnnouncement = announcementRepository.save(a);
            BaseResponse<Announcement> response = new BaseResponse<>();
            response.data = savedAnnouncement;
            response.isError = false;
            response.message = MessageFormat.format("Announcement with id: {0} saved successfully", savedAnnouncement.getAnnouncementId());
            return response;
        }
        else{
            BaseResponse<Announcement> response = new BaseResponse<>();
            response.data = null;
            response.isError = true;
            response.message = MessageFormat.format("Instruct with id: {0} does not exist", announcementSaveRequest.instructId);
            return response;
        }

    }



}
