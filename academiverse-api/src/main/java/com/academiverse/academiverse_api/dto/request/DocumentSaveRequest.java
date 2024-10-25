package com.academiverse.academiverse_api.dto.request;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
public class DocumentSaveRequest {
    public Long instructId;
    public Long moduleId;
    public String moduleName;
    public String moduleLink;
    public Long createdBy;
    public Long updatedBy;
}
