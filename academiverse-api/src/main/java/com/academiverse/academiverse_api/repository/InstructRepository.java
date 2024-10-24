package com.academiverse.academiverse_api.repository;

import com.academiverse.academiverse_api.model.Instruct;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InstructRepository extends JpaRepository<Instruct, Long> {

    List<Instruct> findByProfessorUserIdAndYearAndSemester(Long userId, int year, String semester);
}
