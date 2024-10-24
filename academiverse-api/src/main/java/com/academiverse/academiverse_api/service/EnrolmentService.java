package com.academiverse.academiverse_api.service;

import com.academiverse.academiverse_api.dto.response.BaseResponse;
import com.academiverse.academiverse_api.model.Enrolment;
import com.academiverse.academiverse_api.model.Instruct;
import com.academiverse.academiverse_api.model.User;
import com.academiverse.academiverse_api.repository.EnrolmentRepository;
import com.academiverse.academiverse_api.repository.InstructRepository;
import com.academiverse.academiverse_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EnrolmentService {
    private final EnrolmentRepository enrolmentRepository;
    private final InstructRepository instructRepository;
    private final UserRepository userRepository;

    public BaseResponse<List<Long>> getEligibleStudents(Long instructId) {
        Optional<Instruct> instruct = instructRepository.findById(instructId);
        BaseResponse<List<Long>> response = new BaseResponse<>();

        if (instruct.isPresent()) {
            // Retrieve the department ID from the course
            Long departmentId = instruct.get().getCourse().getDepartment().getDepartmentId();

            // Get all users
            List<User> allUsers = userRepository.findAll(); // Fetch all users

            // Get a list of enrolled students
            List<Long> enrolledStudents = enrolmentRepository.findByInstructId(instructId)
                    .stream()
                    .map(Enrolment::getUserId)
                    .collect(Collectors.toList());

            // Filter eligible students based on department and enrollment status
            List<Long> eligibleStudents = allUsers.stream()
                    .filter(user -> user.getDepartment().equals(departmentId) && !enrolledStudents.contains(user.getUserId()))
                    .map(User::getUserId)
                    .collect(Collectors.toList());

            response.data = eligibleStudents;
            response.isError = false;
            response.message = "Eligible students retrieved successfully.";
        } else {
            response.data = null;
            response.isError = true;
            response.message = "Instruct not found.";
        }
        return response;
    }

    public BaseResponse<String> enrollStudent(Long userId, Long instructId) {
        BaseResponse<String> response = new BaseResponse<>();
        Optional<Instruct> instruct = instructRepository.findById(instructId);
        Optional<User> user = userRepository.findById(userId);

        if (instruct.isPresent() && user.isPresent()) {
            Enrolment enrolment = new Enrolment();
            enrolment.setUserId(userId);
            enrolment.setInstructId(instructId);
            enrolment.setActive(true); // Assuming isActive is true by default
            enrolmentRepository.save(enrolment);

            response.data = "Student enrolled successfully.";
            response.isError = false;
            response.message = "Enrollment successful.";
        } else {
            response.data = null;
            response.isError = true;
            response.message = "User or Instruct not found.";
        }
        return response;
    }
}
