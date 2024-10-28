package com.academiverse.academiverse_api.repository;

import com.academiverse.academiverse_api.model.Enrolment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EnrolmentRepository extends JpaRepository<Enrolment, Long> {
    List<Enrolment> findByInstructInstructId(Long instructId);

    List<Enrolment> findByUserUserIdAndInstructYearAndInstructSemesterAndIsActive(Long userId, int year, String semester, boolean b);
    Optional<Enrolment> findByInstructInstructIdAndUserUserIdAndIsActive(Long instructId, Long userId, boolean isActive);
}
