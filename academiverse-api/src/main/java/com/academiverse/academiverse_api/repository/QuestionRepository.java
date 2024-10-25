package com.academiverse.academiverse_api.repository;

import com.academiverse.academiverse_api.model.Question;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByQuizQuizId(long quizId);
    @Transactional
    void deleteByQuizQuizId(long quizId);
}
