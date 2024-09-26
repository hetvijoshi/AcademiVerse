package com.academiverse.academiverse_api.dto.request;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateRequest {
    public Long id;
    public String name;
    public String userEmail;
    public String role;
    public Long departmentId;
    public Long degreeId;
    public Long updatedBy;
}
