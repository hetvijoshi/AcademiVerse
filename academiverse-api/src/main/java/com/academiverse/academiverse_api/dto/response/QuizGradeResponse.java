package com.academiverse.academiverse_api.dto.response;

import com.academiverse.academiverse_api.model.Grade;
import com.academiverse.academiverse_api.model.Quiz;

import java.util.List;

public class QuizGradeResponse {
    public Quiz quiz;
    public List<Grade> grades;
}
