package com.academiverse.academiverse_api.repository;

import com.academiverse.academiverse_api.model.Department;
import com.academiverse.academiverse_api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
    Optional<Department> findByDepartmentCode(String departmentName);
}
