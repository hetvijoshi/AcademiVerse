package com.academiverse.academiverse_api.dto.request;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
public class AnnouncementSaveRequest {
    public Long instructId;
    public String announcementTitle;
    public String announcementDescription;
    public Long createdBy;
    public Long updatedBy;
}
