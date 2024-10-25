package com.academiverse.academiverse_api.repository;

import com.academiverse.academiverse_api.model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
    List<Quiz> findByInstructInstructIdAndIsActive(long instructId, boolean isActive);
}
