package com.academiverse.academiverse_api.repository;

import com.academiverse.academiverse_api.model.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByInstructInstructIdAndActive(Long instructId, boolean active);
}
