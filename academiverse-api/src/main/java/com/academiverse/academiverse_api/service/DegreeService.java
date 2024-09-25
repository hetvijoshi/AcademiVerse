package com.academiverse.academiverse_api.service;

import com.academiverse.academiverse_api.dto.response.BaseResponse;
import com.academiverse.academiverse_api.model.Degree;
import com.academiverse.academiverse_api.model.Department;
import com.academiverse.academiverse_api.repository.DegreeRepository;
import com.academiverse.academiverse_api.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DegreeService {
    private final DegreeRepository degreeRepository;
    public BaseResponse<List<Degree>> getAllDegrees(){
        List<Degree> degreeList = degreeRepository.findAll();
        BaseResponse<List<Degree>> response = new BaseResponse<>();
        response.data = degreeList;
        response.message = "List of all degrees.";
        response.isError = false;
        return response;
    }

}
