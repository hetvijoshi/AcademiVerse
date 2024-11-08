package com.academiverse.academiverse_api.service;

import com.academiverse.academiverse_api.dto.request.GradeSaveRequest;
import com.academiverse.academiverse_api.dto.response.AssignmentGradeResponse;
import com.academiverse.academiverse_api.dto.response.BaseResponse;
import com.academiverse.academiverse_api.dto.response.InstructGradeResponse;
import com.academiverse.academiverse_api.dto.response.QuizGradeResponse;
import com.academiverse.academiverse_api.model.*;
import com.academiverse.academiverse_api.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class GradeService {
    private final GradeRepository gradeRepository;
    private final AssignmentRepository assignmentRepository;
    private final QuizRepository quizRepository;
    private final EnrolmentRepository enrolmentRepository;
    private final AssignmentSubmissionRepository assignmentSubmissionRepository;

    public BaseResponse<List<Grade>> getStudentGrades(Long instructId, Long studentId) {
        List<Quiz> quizzes= quizRepository.findByInstructInstructIdAndIsActive(instructId, true);
        List<Assignment> assignmentList= assignmentRepository.findByInstructInstructIdAndActive(instructId, true);

        List<Grade> resList = new ArrayList<>();
        if(quizzes.size() >= 0 || assignmentList.size() >= 0){
            resList.addAll(gradeRepository.findByAssignmentAssignmentIdInAndUserUserId(assignmentList.stream().map(a->a.getAssignmentId()).toList(), studentId));
            resList.addAll(gradeRepository.findByQuizQuizIdInAndUserUserId(quizzes.stream().map(a->a.getQuizId()).toList(), studentId));
        }

        BaseResponse<List<Grade>> res = new BaseResponse<>();
        res.data = resList;
        res.isError = false;
        res.message = "Grades fetched successfully.";
        return res;
    }

    public BaseResponse<List<InstructGradeResponse>> getInstructGrades(Long instructId) {
        List<Quiz> quizzes= quizRepository.findByInstructInstructIdAndIsActive(instructId, true);
        List<Assignment> assignmentList= assignmentRepository.findByInstructInstructIdAndActive(instructId, true);
        List<Enrolment> el = enrolmentRepository.findByInstructInstructId(instructId);

        List<Grade> resList = new ArrayList<>();
        if(quizzes.size() >= 0 || assignmentList.size() >= 0){
            resList.addAll(gradeRepository.findByAssignmentAssignmentIdIn(assignmentList.stream().map(a->a.getAssignmentId()).toList()));
            resList.addAll(gradeRepository.findByQuizQuizIdIn(quizzes.stream().map(a->a.getQuizId()).toList()));
        }

        List<InstructGradeResponse> aggRes = new ArrayList<>();
        aggRes.addAll(quizzes.stream().map(
                (q) ->{
                    List<Integer> marks = resList.stream().filter(g-> g.getQuiz() != null && g.getQuiz().getQuizId() == q.getQuizId()).map(g->g.getObtainedMarks()).toList();
                    InstructGradeResponse instructGradeResponse = new InstructGradeResponse();
                    instructGradeResponse.quizId = q.getQuizId();
                    instructGradeResponse.gradeTitle = q.getQuizName();
                    instructGradeResponse.totalMarks = q.getTotalMarks();
                    instructGradeResponse.minMarks = marks.stream().min(Integer::compare).isPresent() ? marks.stream().min(Integer::compare).get():0;
                    instructGradeResponse.maxMarks = marks.stream().max(Integer::compare).isPresent() ? marks.stream().max(Integer::compare).get():0;
                    instructGradeResponse.avgMarks = marks.size() > 0 ? marks.stream().reduce(0,(sub,element)-> sub + element)/marks.size() : 0;
                    instructGradeResponse.submittedCount = marks.size();
                    instructGradeResponse.totalStudents = el.size();
                    return  instructGradeResponse;
                }
        ).toList());

        aggRes.addAll(assignmentList.stream().map(
                (a) ->{
                    List<Integer> marks = resList.stream().filter(g-> g.getAssignment() != null && g.getAssignment().getAssignmentId() == a.getAssignmentId()).map(g->g.getObtainedMarks()).toList();
                    InstructGradeResponse instructGradeResponse = new InstructGradeResponse();
                    instructGradeResponse.assignmentId = a.getAssignmentId();
                    instructGradeResponse.gradeTitle = a.getAssignmentTitle();
                    instructGradeResponse.totalMarks = a.getTotalMarks();
                    instructGradeResponse.minMarks = marks.stream().min(Integer::compare).isPresent() ? marks.stream().min(Integer::compare).get() : 0;
                    instructGradeResponse.maxMarks = marks.stream().max(Integer::compare).isPresent() ? marks.stream().max(Integer::compare).get() : 0;
                    instructGradeResponse.avgMarks = marks.size() > 0 ? marks.stream().reduce(0,(sub,element)-> sub + element)/marks.size() : 0;
                    instructGradeResponse.submittedCount = marks.size();
                    instructGradeResponse.totalStudents = el.size();
                    return  instructGradeResponse;
                }
        ).toList());

        BaseResponse<List<InstructGradeResponse>> res = new BaseResponse<>();
        res.data = aggRes;
        res.isError = false;
        res.message = "Grades fetched successfully.";
        return res;
    }

    public BaseResponse<AssignmentGradeResponse> getAssignmentGrades(Long assignmentId){
        AssignmentGradeResponse res = new AssignmentGradeResponse();
        Optional<Assignment> assignment = assignmentRepository.findById(assignmentId);
        if(assignment.isPresent()){
            res.assignment = assignment.get();
            res.grades = new ArrayList<>();

            List<AssignmentSubmission> submissions = assignmentSubmissionRepository.findByAssignmentAssignmentId(assignmentId);
            res.assignmentSubmissions = submissions;

            List<Enrolment> enrolments = enrolmentRepository.findByInstructInstructId(assignment.get().getInstruct().getInstructId());
            List<Grade> grades = gradeRepository.findByAssignmentAssignmentId(assignmentId);
            res.grades.addAll(enrolments.stream().map(e->{
                Optional<Grade> sg = grades.stream().filter(g-> g.getUser().getUserId() == e.getUser().getUserId()).findFirst();
                Optional<AssignmentSubmission> as = submissions.stream().filter(s->s.getUser().getUserId() == e.getUser().getUserId()).findFirst();
                if(sg.isPresent()){
                    return sg.get();
                }else{
                    Grade g = new Grade();
                    g.setGradeTitle(res.assignment.getAssignmentTitle());
                    g.setObtainedMarks(0);
                    g.setTotalMarks(res.assignment.getTotalMarks());
                    g.setUser(e.getUser());
                    g.setAssignment(res.assignment);
                    g.setCreatedBy(e.getUser().getUserId());
                    g.setUpdatedBy(e.getUser().getUserId());
                    g.setCreatedAt(LocalDateTime.now());
                    g.setUpdatedAt(LocalDateTime.now());
                    return g;
                }
            }).toList());

            BaseResponse<AssignmentGradeResponse> agr = new BaseResponse<>();
            agr.data = res;
            agr.message = "Student grades fetched.";
            agr.isError = false;
            return agr;
        }else{
            BaseResponse<AssignmentGradeResponse> agr = new BaseResponse<>();
            agr.data = null;
            agr.message = "Assignment not found";
            agr.isError = true;
            return agr;
        }
    }

    public BaseResponse<QuizGradeResponse> getQuizGrades(Long quizId){
        QuizGradeResponse res = new QuizGradeResponse();
        Optional<Quiz> quiz = quizRepository.findById(quizId);
        if(quiz.isPresent()){
            res.quiz = quiz.get();
            res.grades = new ArrayList<>();
            List<Enrolment> enrolments = enrolmentRepository.findByInstructInstructId(quiz.get().getInstruct().getInstructId());
            List<Grade> grades = gradeRepository.findByQuizQuizId(quizId).get();
            res.grades.addAll(enrolments.stream().map(e->{
                Optional<Grade> sg = grades.stream().filter(g-> g.getUser().getUserId() == e.getUser().getUserId()).findFirst();
                if(sg.isPresent()){
                    return sg.get();
                }else{
                    Grade g = new Grade();
                    g.setGradeTitle(res.quiz.getQuizName());
                    g.setObtainedMarks(0);
                    g.setTotalMarks(res.quiz.getTotalMarks());
                    g.setUser(e.getUser());
                    g.setQuiz(res.quiz);
                    g.setCreatedBy(e.getUser().getUserId());
                    g.setUpdatedBy(e.getUser().getUserId());
                    g.setCreatedAt(LocalDateTime.now());
                    g.setUpdatedAt(LocalDateTime.now());
                    return g;
                }
            }).toList());

            BaseResponse<QuizGradeResponse> agr = new BaseResponse<>();
            agr.data = res;
            agr.message = "Student grades fetched.";
            agr.isError = false;
            return agr;
        }else{
            BaseResponse<QuizGradeResponse> agr = new BaseResponse<>();
            agr.data = null;
            agr.message = "Quiz not found";
            agr.isError = true;
            return agr;
        }
    }

    public BaseResponse<List<Grade>> saveGrades(GradeSaveRequest gradeSaveRequest){
        if(gradeSaveRequest.grades.size() > 0){
            Long assignmentId = gradeSaveRequest.grades.stream().findFirst().get().getAssignment().getAssignmentId();
            Optional<Assignment> assignment = assignmentRepository.findById(assignmentId);
            if(assignment.isPresent()){
                List<Enrolment> enrolments = enrolmentRepository.findByInstructInstructId(assignment.get().getInstruct().getInstructId());
                List<Grade> grades = gradeRepository.findByAssignmentAssignmentId(assignmentId);

                List<Grade> newGrades = enrolments.stream().map(e->{
                    Optional<Grade> sg = grades.stream().filter(g-> g.getUser().getUserId() == e.getUser().getUserId()).findFirst();
                    if(sg.isPresent()){
                        Optional<Grade> reqGrade = gradeSaveRequest.grades.stream().filter(g->g.getUser().getUserId() == e.getUser().getUserId()).findFirst();
                        Grade g = sg.get();
                        if(reqGrade.isPresent())
                        {
                            g.setObtainedMarks(reqGrade.get().getObtainedMarks());
                            g.setUpdatedBy(reqGrade.get().getUpdatedBy());
                            g.setUpdatedAt(LocalDateTime.now());
                        }
                        return g;
                    }else{
                        Optional<Grade> reqGrade = gradeSaveRequest.grades.stream().filter(g->g.getUser().getUserId() == e.getUser().getUserId()).findFirst();
                        Grade g = new Grade();
                        g.setGradeTitle(assignment.get().getAssignmentTitle());
                        g.setObtainedMarks(reqGrade.get().getObtainedMarks());
                        g.setTotalMarks(assignment.get().getTotalMarks());
                        g.setUser(e.getUser());
                        g.setAssignment(assignment.get());
                        g.setCreatedBy(e.getUser().getUserId());
                        g.setUpdatedBy(e.getUser().getUserId());
                        g.setCreatedAt(LocalDateTime.now());
                        g.setUpdatedAt(LocalDateTime.now());
                        return g;
                    }
                }).toList();

                List<Grade> newSavedGrades = gradeRepository.saveAll(newGrades);

                BaseResponse<List<Grade>> agr = new BaseResponse<>();
                agr.data = newSavedGrades;
                agr.message = "Student grades saved successfully.";
                agr.isError = false;
                return agr;
            }else{
                BaseResponse<List<Grade>> agr = new BaseResponse<>();
                agr.data = null;
                agr.message = "Assignment not found";
                agr.isError = true;
                return agr;
            }
        }
        else{
            BaseResponse<List<Grade>> agr = new BaseResponse<>();
            agr.data = null;
            agr.message = "Request data not valid.";
            agr.isError = true;
            return agr;
        }
    }
}
