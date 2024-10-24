package com.academiverse.academiverse_api.dto.request;

import java.util.List;

public class QuizSubmitRequest {
    public Long quizId;
    public Long userId;
    public List<SubmitQuestion> submission;
}
