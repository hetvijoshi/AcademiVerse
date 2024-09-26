package com.academiverse.academiverse_api.repository;

import com.academiverse.academiverse_api.model.Degree;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DegreeRepository extends JpaRepository<Degree, Long> {
    Optional<Degree> findByDegreeName(String degreeName);
}

