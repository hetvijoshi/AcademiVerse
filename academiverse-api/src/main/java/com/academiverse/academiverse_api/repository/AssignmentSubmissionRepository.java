package com.academiverse.academiverse_api.repository;

import com.academiverse.academiverse_api.model.Assignment;
import com.academiverse.academiverse_api.model.AssignmentSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssignmentSubmissionRepository extends JpaRepository<AssignmentSubmission, Long> {
    Optional<AssignmentSubmission> findByAssignmentAssignmentIdAndUserUserId(Long assignmentId, Long userId);

    List<AssignmentSubmission> findByUserUserIdAndAssignmentIn(Long userId, List<Assignment> assignments);
    List<AssignmentSubmission> findByAssignmentAssignmentId(Long assignmentId);
}
