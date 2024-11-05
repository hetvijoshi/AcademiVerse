package com.academiverse.academiverse_api.dto.response;

import com.academiverse.academiverse_api.model.Assignment;
import com.academiverse.academiverse_api.model.Grade;

import java.util.List;

public class AssignmentGradeResponse {
    public Assignment assignment;
    public List<Grade> grades;
}
