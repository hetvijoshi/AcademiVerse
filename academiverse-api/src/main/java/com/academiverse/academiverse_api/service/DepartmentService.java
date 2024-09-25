package com.academiverse.academiverse_api.service;

import com.academiverse.academiverse_api.dto.response.BaseResponse;
import com.academiverse.academiverse_api.model.Department;
import com.academiverse.academiverse_api.model.User;
import com.academiverse.academiverse_api.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DepartmentService {
    private final DepartmentRepository departmentRepository;

    public BaseResponse<List<Department>> getAllDepartments(){
        List<Department> departmentList = departmentRepository.findAll();
        BaseResponse<List<Department>> response = new BaseResponse<>();
        response.data = departmentList;
        response.message = "List of all department.";
        response.isError = false;
        return response;
    }
}
