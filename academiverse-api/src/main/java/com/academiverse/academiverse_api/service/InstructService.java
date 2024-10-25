package com.academiverse.academiverse_api.service;

import com.academiverse.academiverse_api.dto.request.InstructSaveRequest;
import com.academiverse.academiverse_api.dto.request.InstructUpdateRequest;
import com.academiverse.academiverse_api.dto.response.BaseResponse;
import com.academiverse.academiverse_api.model.Course;
import com.academiverse.academiverse_api.model.Instruct;
import com.academiverse.academiverse_api.model.Enrolment;
import com.academiverse.academiverse_api.model.User;
import com.academiverse.academiverse_api.repository.CourseRepository;
import com.academiverse.academiverse_api.repository.EnrolmentRepository;
import com.academiverse.academiverse_api.repository.InstructRepository;
import com.academiverse.academiverse_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.text.MessageFormat;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class InstructService {

    private final InstructRepository instructRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final EnrolmentRepository enrolmentRepository;

    public BaseResponse<List<Instruct>> getAllInstructs() {
        List<Instruct> instructList = instructRepository.findAll();
        BaseResponse<List<Instruct>> response = new BaseResponse<>();
        response.data = instructList;
        response.isError = false;
        response.message = "List of all instructs.";
        return response;
    }

    public BaseResponse<Instruct> getInstructById(Long id) {
        Optional<Instruct> optionalInstruct = instructRepository.findById(id);
        BaseResponse<Instruct> response = new BaseResponse<>();
        if (optionalInstruct.isPresent()) {
            response.data = optionalInstruct.get();
            response.isError = false;
            response.message = MessageFormat.format("Instruct with id {0} found.", id);
        } else {
            response.data = null;
            response.isError = true;
            response.message = MessageFormat.format("Instruct with id {0} not found.", id);
        }
        return response;
    }

    public BaseResponse<Instruct> saveInstruct(InstructSaveRequest instructRequest) {
        Optional<Course> course = courseRepository.findById(instructRequest.courseId);
        Optional<User> professor = userRepository.findById(instructRequest.userId);
        if (course.isPresent() && professor.isPresent()) {
            Instruct instruct = new Instruct();
            instruct.setCourse(course.get());
            instruct.setProfessor(professor.get());
            instruct.setCourseCapacity(instructRequest.courseCapacity);
            instruct.setCourseDays(instructRequest.courseDays);
            instruct.setCourseStartTime(instructRequest.courseStartTime);
            instruct.setCourseEndTime(instructRequest.courseEndTime);
            instruct.setSemester(instructRequest.semester);
            instruct.setYear(instructRequest.year);
            instruct.setCreatedAt(LocalDateTime.now());
            instruct.setUpdatedAt(LocalDateTime.now());
            instruct.setCreatedBy(instructRequest.createdBy);
            instruct.setUpdatedBy(instructRequest.updatedBy);

            Instruct savedInstruct = instructRepository.save(instruct);

            BaseResponse<Instruct> response = new BaseResponse<>();
            response.data = savedInstruct;
            response.isError = false;
            response.message = MessageFormat.format("Instruct with id {0} saved successfully.", savedInstruct.getInstructId());
            return response;
        } else {
            BaseResponse<Instruct> response = new BaseResponse<>();
            response.data = null;
            response.isError = true;
            response.message = "Course or Professor not found.";
            return response;
        }
    }

    public BaseResponse<Instruct> updateInstruct(InstructUpdateRequest instructRequest) {
        Optional<Instruct> existingInstruct = instructRepository.findById(instructRequest.instructId);
        if (existingInstruct.isPresent()) {
            Optional<Course> course = courseRepository.findById(instructRequest.courseId);
            Optional<User> professor = userRepository.findById(instructRequest.userId);
            if (course.isPresent() && professor.isPresent()) {
                Instruct instruct = existingInstruct.get();
                instruct.setCourse(course.get());
                instruct.setProfessor(professor.get());
                instruct.setCourseCapacity(instructRequest.courseCapacity);
                instruct.setCourseDays(instructRequest.courseDays);
                instruct.setCourseStartTime(instructRequest.courseStartTime);
                instruct.setCourseEndTime(instructRequest.courseEndTime);
                instruct.setSemester(instructRequest.semester);
                instruct.setYear(instructRequest.year);
                instruct.setUpdatedAt(LocalDateTime.now());
                instruct.setUpdatedBy(instructRequest.updatedBy);

                Instruct updatedInstruct = instructRepository.save(instruct);

                BaseResponse<Instruct> response = new BaseResponse<>();
                response.data = updatedInstruct;
                response.isError = false;
                response.message = MessageFormat.format("Instruct with id {0} updated successfully.", updatedInstruct.getInstructId());
                return response;
            } else {
                BaseResponse<Instruct> response = new BaseResponse<>();
                response.data = null;
                response.isError = true;
                response.message = "Course or Professor not found.";
                return response;
            }
        } else {
            BaseResponse<Instruct> response = new BaseResponse<>();
            response.data = null;
            response.isError = true;
            response.message = MessageFormat.format("Instruct with id {0} not found.", instructRequest.instructId);
            return response;
        }
    }

    public BaseResponse<String> deleteInstructById(Long id) {
        Optional<Instruct> existingInstruct = instructRepository.findById(id);
        BaseResponse<String> response = new BaseResponse<>();
        if (existingInstruct.isPresent()) {
            instructRepository.deleteById(id);
            response.data = MessageFormat.format("Instruct with id {0} deleted successfully.", id);
            response.isError = false;
            response.message = MessageFormat.format("Instruct with id {0} is deleted.", id);
        } else {
            response.data = null;
            response.isError = true;
            response.message = MessageFormat.format("Instruct with id {0} not found.", id);
        }
        return response;
    }

    // For professors: Retrieve courses taught by the professor in the current semester and year
    public BaseResponse<List<Instruct>> getProfessorCourses(Long userId, int year, String semester) {
        List<Instruct> courses = instructRepository.findByProfessorUserIdAndYearAndSemester(userId, year, semester);

        BaseResponse<List<Instruct>> response = new BaseResponse<>();
        response.isError = false;
        response.message = "Courses retrieved successfully";
        response.data = courses;

        return response;
    }
    // For students: Retrieve courses the student is enrolled in
    public BaseResponse<List<Instruct>> getStudentEnrolledCourses(Long userId, int year, String semester) {
        List<Instruct> enrolments = enrolmentRepository
                .findByUserUserIdAndInstructYearAndInstructSemesterAndIsActive(userId, year, semester, true)
                .stream()
                .map(Enrolment::getInstruct)
                .collect(Collectors.toList());;



        BaseResponse<List<Instruct>> response = new BaseResponse<>();
        response.isError = false;
        response.message = "Enrolled courses retrieved successfully";
        response.data = enrolments;

        return response;
    }
}
