package com.academiverse.academiverse_api.dto.request;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
public class ModuleSaveRequest {
    public Long instructId;
    public String moduleName;
    public Long createdBy;
    public Long updatedBy;
}
