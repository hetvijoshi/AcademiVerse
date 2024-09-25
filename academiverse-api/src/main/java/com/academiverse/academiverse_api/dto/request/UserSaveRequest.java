package com.academiverse.academiverse_api.dto.request;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
public class UserSaveRequest {
    public String name;
    public String userEmail;
    public String role;
    public String departmentCode;
    public String degreeName;
    @JsonIgnore
    public LocalDateTime createdAt;
    @JsonIgnore
    public LocalDateTime updatedAt;
    public Long createdBy;
    public Long updatedBy;
}
