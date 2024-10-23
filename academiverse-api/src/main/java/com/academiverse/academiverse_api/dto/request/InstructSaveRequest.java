package com.academiverse.academiverse_api.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
public class InstructSaveRequest {
    public Long courseId;
    public int courseCapacity;
    public String courseDays;
    public String courseStartTime;
    public String courseEndTime;
    public Long userId; // Professor ID
    public String semester;
    public int year;
    @JsonIgnore
    public LocalDateTime createdAt;
    @JsonIgnore
    public LocalDateTime updatedAt;
    public Long createdBy;
    public Long updatedBy;
}
