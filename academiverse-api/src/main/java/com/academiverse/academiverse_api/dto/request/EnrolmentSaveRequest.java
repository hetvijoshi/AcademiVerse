package com.academiverse.academiverse_api.dto.request;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
public class EnrolmentSaveRequest {
	  public Long instructId;
	  public Long userId;
	  public Boolean isActive;
	  public Long createdBy;
}



