package com.academiverse.academiverse_api.repository;

import com.academiverse.academiverse_api.model.Grade;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GradeRepository extends JpaRepository<Grade, Long> {
    Optional<Grade> findByQuizQuizIdAndUserId(Long quizId, Long userId);
}
