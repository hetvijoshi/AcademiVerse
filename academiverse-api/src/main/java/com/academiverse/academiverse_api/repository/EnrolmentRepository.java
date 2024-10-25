package com.academiverse.academiverse_api.repository;

import com.academiverse.academiverse_api.model.Enrolment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EnrolmentRepository extends JpaRepository<Enrolment, Long> {
    List<Enrolment> findByInstructId(Long instructId);

    List<Enrolment> findByUserIdAndIsActive(Long userId, boolean b);
    Optional<Enrolment> findByInstructIdAndUserIdAndIsActive(Long instructId, Long userId, boolean isActive);
}
