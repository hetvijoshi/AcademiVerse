package com.academiverse.academiverse_api.repository;

import com.academiverse.academiverse_api.model.Enrolment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EnrolmentRepository extends JpaRepository<Enrolment, Long> {
    List<Enrolment> findByInstructId(Long instructId);

    List<Enrolment> findByUserIdAndIsActive(Long userId, boolean b);
}
