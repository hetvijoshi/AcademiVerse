package com.academiverse.academiverse_api.repository;

import com.academiverse.academiverse_api.model.Grade;
import com.academiverse.academiverse_api.model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GradeRepository extends JpaRepository<Grade, Long> {
    Optional<Grade> findByQuizQuizIdAndUserId(Long quizId, Long userId);
    List<Grade> findByUserIdAndQuizIn(long userId, List<Quiz> quizzes);
    Optional<List<Grade>> findByQuizQuizId(Long quizId);
}
