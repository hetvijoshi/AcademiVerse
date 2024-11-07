package com.academiverse.academiverse_api.dto.request;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
public class AssignmentForStudentGetRequest {
    public Long instructId;
    public Long userId;
}
