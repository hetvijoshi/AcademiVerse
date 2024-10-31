package com.academiverse.academiverse_api.repository;

import com.academiverse.academiverse_api.model.ToDo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ToDoRepository extends JpaRepository<ToDo, Long> {
    List<ToDo> findByInstructInstructIdAndUserUserIdAndIsComplete(Long instructId, Long userId, boolean isComplete);
}
