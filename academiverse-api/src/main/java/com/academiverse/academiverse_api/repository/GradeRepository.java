package com.academiverse.academiverse_api.repository;

import com.academiverse.academiverse_api.model.Grade;
import com.academiverse.academiverse_api.model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GradeRepository extends JpaRepository<Grade, Long> {
    Optional<Grade> findById(Long gradeId);  // Find grade by ID
    List<Grade> findByStudentId(Long studentId);  // Retrieve grades by student ID
    List<Grade> findByUserIdAndAssignmentAssignmentId(Long userId, Long assignmentId);
    List<Grade> findByUserIdAndQuizIn(Long userId, List<Quiz> quizzes);
    List<Grade> findByQuizQuizId(Long quizId);  // Get grades by quiz ID
    Optional<Grade> findByQuizQuizIdAndUserId(Long quizId, Long userId);
    List<Grade> findGradesByQuizId(Long quizId); // Method to find grades by quiz ID
}
