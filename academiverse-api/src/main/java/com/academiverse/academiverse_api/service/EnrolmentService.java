package com.academiverse.academiverse_api.service;

import com.academiverse.academiverse_api.dto.request.EnrolmentSaveRequest;
import com.academiverse.academiverse_api.dto.response.BaseResponse;
import com.academiverse.academiverse_api.dto.response.EnrolEligibleResponse;
import com.academiverse.academiverse_api.model.Enrolment;
import com.academiverse.academiverse_api.model.Instruct;
import com.academiverse.academiverse_api.model.User;
import com.academiverse.academiverse_api.repository.EnrolmentRepository;
import com.academiverse.academiverse_api.repository.InstructRepository;
import com.academiverse.academiverse_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EnrolmentService {
    private final EnrolmentRepository enrolmentRepository;
    private final InstructRepository instructRepository;
    private final UserRepository userRepository;

    public BaseResponse<List<EnrolEligibleResponse>> getEligibleStudents(Long instructId) {
        Optional<Instruct> instruct = instructRepository.findById(instructId);
        BaseResponse<List<EnrolEligibleResponse>> response = new BaseResponse<>();


        if (instruct.isPresent()) {
            Long departmentId = instruct.get().getCourse().getDepartment().getDepartmentId();

            // Get all users
            List<User> allUsers = userRepository.findByRole("student"); // Fetch all users

            // Get a list of enrolled students
            List<Long> enrolledStudents = enrolmentRepository.findByInstructInstructId(instruct.get().getInstructId())
                    .stream()
                    .map(enrolment -> {
                        return enrolment.getUser().getUserId();
                    })
                    .toList();

            // Filter eligible students based on department and enrollment status
            List<EnrolEligibleResponse> eligibleResponses = allUsers.stream()
                    .filter(user -> user.getDepartment().getDepartmentId().equals(departmentId))
                    .map(user -> {
                        EnrolEligibleResponse enrolEligibleResponse = new EnrolEligibleResponse();

                        if (enrolledStudents.contains(user.getUserId())) {
                            enrolEligibleResponse.user = user;
                            enrolEligibleResponse.isEnrolled = true;
                        }

                        if (user.getDepartment().getDepartmentId().equals(departmentId)) {
                            enrolEligibleResponse.user = user;
                            enrolEligibleResponse.isEnrolled = false;
                        }

                        return enrolEligibleResponse;
                    })
                    .toList();

            response.data = eligibleResponses;
            response.isError = false;
            response.message = "Eligible students retrieved successfully.";
        } else {
            response.data = null;
            response.isError = true;
            response.message = "Instruct not found.";
        }
        return response;
    }

    public BaseResponse<Enrolment> enrollStudent(EnrolmentSaveRequest enrolmentSaveRequest) {
        BaseResponse<Enrolment> response = new BaseResponse<>();
        Optional<Instruct> instruct = instructRepository.findById(enrolmentSaveRequest.instructId);
        Optional<User> user = userRepository.findById(enrolmentSaveRequest.userId);

        if (instruct.isPresent() && user.isPresent()) {
            Enrolment enrolment = new Enrolment();
            enrolment.setUser(user.get());
            enrolment.setInstruct(instruct.get());
            enrolment.setActive(enrolmentSaveRequest.isActive);
            enrolment.setCreatedBy(enrolmentSaveRequest.createdBy);
            enrolment.setUpdatedBy(enrolmentSaveRequest.createdBy);
            enrolment.setUpdatedAt(LocalDateTime.now());
            enrolment.setCreatedAt(LocalDateTime.now());
            enrolment = enrolmentRepository.save(enrolment);

            response.data = enrolment;
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
