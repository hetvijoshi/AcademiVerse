package com.academiverse.academiverse_api.dto.request;

import java.time.LocalDateTime;
import java.util.List;

public class QuizSaveRequest {
    public Long instructId;
    public String quizName;
    public String quizDescription;
    public int quizWeightage;
    public LocalDateTime quizDueDate;
    public int totalMarks;
    public boolean isActive;
    public List<Question> questions;
    public Long createdBy;
    public Long updatedBy;
}

