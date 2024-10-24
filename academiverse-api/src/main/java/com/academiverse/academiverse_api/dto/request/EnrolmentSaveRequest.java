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
	  @JsonIgnore
	  public LocalDateTime createdAt;
	  @JsonIgnore
	  public LocalDateTime updatedAt;
	  public Long createdBy;
	  public Long updatedBy;
}



