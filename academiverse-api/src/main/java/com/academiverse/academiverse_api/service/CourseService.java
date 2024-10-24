package com.academiverse.academiverse_api.service;

import com.academiverse.academiverse_api.dto.response.BaseResponse;
import com.academiverse.academiverse_api.model.Course;
import com.academiverse.academiverse_api.model.User;
import com.academiverse.academiverse_api.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CourseService {
    private final CourseRepository courseRepository;

    public BaseResponse<List<Course>> getAllCourses(){
        List<Course> courseList = courseRepository.findAll();
        BaseResponse<List<Course>> response = new BaseResponse<>();
        response.data = courseList;
        response.message = "List of all courses.";
        response.isError = false;
        return response;
    }

    public BaseResponse<List<Course>> getCoursesByDepartment(long departmentId){
        List<Course> courseList = courseRepository.findByDepartmentDepartmentId(departmentId);
        BaseResponse<List<Course>> response = new BaseResponse<>();
        response.data = courseList;
        response.message = "List of courses.";
        response.isError = false;
        return response;
    }
}
