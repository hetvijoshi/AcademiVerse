package com.academiverse.academiverse_api.repository;

import com.academiverse.academiverse_api.model.Instruct;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InstructRepository extends JpaRepository<Instruct, Long> {
}
