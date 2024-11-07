package com.academiverse.academiverse_api.repository;

import com.academiverse.academiverse_api.model.Grade;
import com.academiverse.academiverse_api.model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GradeRepository extends JpaRepository<Grade, Long> {
    List<Grade> findByUserUserIdAndQuizIn(Long userId, List<Quiz> quizzes);
    Optional<List<Grade>> findByQuizQuizId(Long quizId);
    List<Grade> findByAssignmentAssignmentId(Long assignmentId);
    List<Grade> findByAssignmentAssignmentIdIn(List<Long> assignments);
    List<Grade> findByQuizQuizIdIn(List<Long> quizzes);
    Optional<Grade> findByQuizQuizIdAndUserUserId(Long quizId, Long userId);
    List<Grade> findByQuizQuizIdInAndUserUserId(List<Long> quizzes, Long userId);
    List<Grade> findByAssignmentAssignmentIdInAndUserUserId(List<Long> assignments, Long userId);
}
