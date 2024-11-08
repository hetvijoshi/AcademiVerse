package com.academiverse.academiverse_api.service;

import com.academiverse.academiverse_api.dto.request.AssignmentSaveRequest;
import com.academiverse.academiverse_api.dto.request.AssignmentSubmitGetRequest;
import com.academiverse.academiverse_api.dto.request.AssignmentSubmitRequest;
import com.academiverse.academiverse_api.dto.request.AssignmentUpdateRequest;
import com.academiverse.academiverse_api.dto.response.AssignmentByIdResponse;
import com.academiverse.academiverse_api.dto.response.AssignmentResponse;
import com.academiverse.academiverse_api.dto.response.BaseResponse;
import com.academiverse.academiverse_api.model.Assignment;
import com.academiverse.academiverse_api.model.AssignmentSubmission;
import com.academiverse.academiverse_api.model.Instruct;
import com.academiverse.academiverse_api.model.User;
import com.academiverse.academiverse_api.repository.AssignmentRepository;
import com.academiverse.academiverse_api.repository.AssignmentSubmissionRepository;
import com.academiverse.academiverse_api.repository.InstructRepository;
import com.academiverse.academiverse_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.MessageFormat;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AssignmentService {
    private final AssignmentRepository assignmentRepository;
    private final InstructRepository instructRepository;
    private final UserRepository userRepository;
    private final AssignmentSubmissionRepository assignmentSubmissionRepository;
    private final ToDoService toDoService;

    public BaseResponse<List<Assignment>> getAllAssignments() {
        List<Assignment> assignmentList = assignmentRepository.findAll();
        BaseResponse<List<Assignment>> response = new BaseResponse<>();
        response.data = assignmentList;
        response.isError = false;
        response.message = "List of all assignments.";
        return response;
    }

    public BaseResponse<AssignmentByIdResponse> getAssignmentById(Long assignmentId, Long userId) {
        Optional<AssignmentSubmission> optionalAssignmentSubmission = assignmentSubmissionRepository.findByAssignmentAssignmentIdAndUserUserId(assignmentId,userId);
        Optional<Assignment> assignment = assignmentRepository.findById(assignmentId);
        BaseResponse<AssignmentByIdResponse> response = new BaseResponse<>();
        AssignmentByIdResponse res = new AssignmentByIdResponse();
        if(assignment.isPresent()){
            res.assignment = assignment.get();
            res.assignmentSubmission = optionalAssignmentSubmission.orElse(null);
            response.data = res;
            response.isError = false;
            response.message = MessageFormat.format("Assignment with id {0} found.", assignmentId);
        }
        else{
            response.data = null;
            response.isError = true;
            response.message = MessageFormat.format("Assignment with id {0} not found.", assignmentId);
        }
        return response;
    }

    public BaseResponse<Assignment> saveAssignment(AssignmentSaveRequest assignmentRequest) {
        Optional<Instruct> instruct = instructRepository.findById(assignmentRequest.instructId);
        if (instruct.isPresent()) {
            Assignment assignment = new Assignment();
            assignment.setInstruct(instruct.get());
            assignment.setAssignmentTitle(assignmentRequest.assignmentTitle);
            assignment.setAssignmentDescription(assignmentRequest.assignmentDescription);
            assignment.setAssignmentDueDate(assignmentRequest.assignmentDueDate);
            assignment.setAssignmentWeightage(assignmentRequest.assignmentWeightage);
            assignment.setTotalMarks(assignmentRequest.totalMarks);
            assignment.setActive(assignmentRequest.active);
            assignment.setActive(true);
            assignment.setCreatedBy(assignmentRequest.createdBy);
            assignment.setCreatedDate(LocalDateTime.now());
            assignment.setUpdatedBy(assignmentRequest.updatedBy);
            assignment.setUpdatedDate(LocalDateTime.now());

            Assignment savedAssignment = assignmentRepository.save(assignment);

            toDoService.generateToDoForInstruct(assignmentRequest.instructId, "Complete " + savedAssignment.getAssignmentTitle(), savedAssignment.getAssignmentDueDate());

            BaseResponse<Assignment> response = new BaseResponse<>();
            response.data = savedAssignment;
            response.isError = false;
            response.message = MessageFormat.format("Assignment with id {0} saved successfully.", savedAssignment.getAssignmentId());
            return response;
        } else {
            BaseResponse<Assignment> response = new BaseResponse<>();
            response.data = null;
            response.isError = true;
            response.message = "Instruct not found.";
            return response;
        }
    }

    public BaseResponse<Assignment> updateAssignment(AssignmentUpdateRequest assignmentRequest) {
        Optional<Assignment> existingAssignment = assignmentRepository.findById(assignmentRequest.assignmentId);
        if (existingAssignment.isPresent()) {
            Assignment assignment = existingAssignment.get();
            assignment.setAssignmentTitle(assignmentRequest.assignmentTitle);
            assignment.setAssignmentDescription(assignmentRequest.assignmentDescription);
            assignment.setAssignmentDueDate(assignmentRequest.assignmentDueDate);
            assignment.setAssignmentWeightage(assignmentRequest.assignmentWeightage);
            assignment.setTotalMarks(assignmentRequest.totalMarks);
            assignment.setActive(assignmentRequest.active); // Fixed method name to setActive
            assignment.setUpdatedBy(assignmentRequest.updatedBy);
            assignment.setUpdatedDate(LocalDateTime.now());

            Assignment updatedAssignment = assignmentRepository.save(assignment);

            BaseResponse<Assignment> response = new BaseResponse<>();
            response.data = updatedAssignment;
            response.isError = false;
            response.message = MessageFormat.format("Assignment with id {0} updated successfully.", updatedAssignment.getAssignmentId());
            return response;
        } else {
            BaseResponse<Assignment> response = new BaseResponse<>();
            response.data = null;
            response.isError = true;
            response.message = MessageFormat.format("Assignment with id {0} not found.", assignmentRequest.assignmentId);
            return response;
        }
    }

    public BaseResponse<String> deleteAssignmentById(Long id) {
        Optional<Assignment> existingAssignment = assignmentRepository.findById(id);
        BaseResponse<String> response = new BaseResponse<>();
        if (existingAssignment.isPresent()) {
            assignmentRepository.deleteById(id);
            response.data = MessageFormat.format("Assignment with id {0} deleted successfully.", id);
            response.isError = false;
            response.message = MessageFormat.format("Assignment with id {0} is deleted.", id);
        } else {
            response.data = null;
            response.isError = true;
            response.message = MessageFormat.format("Assignment with id {0} not found.", id);
        }
        return response;
    }

    public BaseResponse<List<Assignment>> getActiveAssignmentsForInstruct(Long instructId) {
        List<Assignment> assignments = assignmentRepository.findByInstructInstructIdAndActive(instructId, true);
        BaseResponse<List<Assignment>> response = new BaseResponse<>();
        response.data = assignments;
        response.isError = false;
        response.message = MessageFormat.format("Active assignments for instruct id {0}.", instructId);
        return response;
    }

    public BaseResponse<List<Assignment>> getAssignmentsForInstruct(Long instructId) {
        List<Assignment> assignments = assignmentRepository.findByInstructInstructId(instructId);
        BaseResponse<List<Assignment>> response = new BaseResponse<>();
        response.data = assignments;
        response.isError = false;
        response.message = MessageFormat.format("Active assignments for instruct id {0}.", instructId);
        return response;
    }

    public BaseResponse<List<AssignmentResponse>> getAssignmentsForStudentByInstruct(Long instructId, Long userId) {
        BaseResponse<List<AssignmentResponse>> response = new BaseResponse<>();
        List<Assignment> assignments = assignmentRepository.findByInstructInstructId(instructId);
        List<Long> submittedAssignments = assignmentSubmissionRepository.findByUserUserIdAndAssignmentIn(userId, assignments).stream().map((a)->a.getAssignment().getAssignmentId()).toList();

        response.data = assignments.stream().map((a)->{
            AssignmentResponse res = new AssignmentResponse();
            res.assignment = a;
            res.submitted = submittedAssignments.contains(a.getAssignmentId());
            return res;
        }).toList();

        response.isError = false;
        response.message = "List of assignments";
        return response;
    }

    public BaseResponse<Assignment> activateAssignment(Long assignmentId){
        Optional<Assignment> assignment = assignmentRepository.findById(assignmentId);
        if(assignment.isPresent())
        {
            Assignment sa = assignment.get();
            sa.setActive(!sa.isActive());
            sa = assignmentRepository.save(sa);
            BaseResponse<Assignment> response = new BaseResponse<>();
            response.data = sa;
            response.isError = false;
            response.message = MessageFormat.format("Assignments with id {0} status changed.", assignmentId);
            return response;
        }else{
            BaseResponse<Assignment> response = new BaseResponse<>();
            response.data = null;
            response.isError = true;
            response.message = MessageFormat.format("Assignment with id {0} not found.", assignmentId);
            return response;
        }
    }

    public BaseResponse<AssignmentSubmission> submitAssignment(AssignmentSubmitRequest assignmentSubmitRequest){
        Optional<Assignment> assignment = assignmentRepository.findById(assignmentSubmitRequest.assignmentId);
        Optional<User> user = userRepository.findById(assignmentSubmitRequest.userId);
        if(assignment.isPresent() && user.isPresent()){
            Optional<AssignmentSubmission> prevAssignmentSubmission = assignmentSubmissionRepository.findByAssignmentAssignmentIdAndUserUserId(assignmentSubmitRequest.assignmentId, assignmentSubmitRequest.userId);
            BaseResponse<AssignmentSubmission> response = new BaseResponse<>();
            if(prevAssignmentSubmission.isPresent()){
                AssignmentSubmission assignmentSubmission = prevAssignmentSubmission.get();
                assignmentSubmission.setAssignmentLink(assignmentSubmitRequest.assignmentLink);
                assignmentSubmission.setUpdatedBy(assignmentSubmitRequest.createdBy);
                assignmentSubmission.setUpdatedDate(LocalDateTime.now());
                AssignmentSubmission savedAssignmentSubmission = assignmentSubmissionRepository.save(assignmentSubmission);
                response.data = savedAssignmentSubmission;
                response.isError = false;
                response.message = MessageFormat.format("Assignment submission with id {0} saved successfully.", savedAssignmentSubmission.getAssignmentSubmissionId());
            }
            else{
                AssignmentSubmission assignmentSubmission = new AssignmentSubmission();
                assignmentSubmission.setAssignmentLink(assignmentSubmitRequest.assignmentLink);
                assignmentSubmission.setAssignment(assignment.get());
                assignmentSubmission.setUser(user.get());
                assignmentSubmission.setCreatedBy(assignmentSubmitRequest.createdBy);
                assignmentSubmission.setCreatedDate(LocalDateTime.now());
                assignmentSubmission.setUpdatedBy(assignmentSubmitRequest.createdBy);
                assignmentSubmission.setUpdatedDate(LocalDateTime.now());
                AssignmentSubmission savedAssignmentSubmission = assignmentSubmissionRepository.save(assignmentSubmission);
                response.data = savedAssignmentSubmission;
                response.isError = false;
                response.message = MessageFormat.format("Assignment submission with id {0} saved successfully.", savedAssignmentSubmission.getAssignmentSubmissionId());
            }
            return response;
        }
        else {
            BaseResponse<AssignmentSubmission> response = new BaseResponse<>();
            response.data = null;
            response.isError = true;
            response.message = "Assignment or User not found.";
            return response;
        }
    }
}
