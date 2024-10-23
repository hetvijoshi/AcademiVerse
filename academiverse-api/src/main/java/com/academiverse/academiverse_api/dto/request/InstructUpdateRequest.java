package com.academiverse.academiverse_api.dto.request;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
public class InstructUpdateRequest {
    public Long instructId;
    public Long courseId;
    public int courseCapacity;
    public String courseDays;
    public String courseStartTime;
    public String courseEndTime;
    public Long userId; // Professor ID
    public String semester;
    public int year;
    public Long updatedBy;
}
