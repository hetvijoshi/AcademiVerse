package com.academiverse.academiverse_api.repository;

import com.academiverse.academiverse_api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUserEmail(String email);
    List<User> findByRoleAndDepartmentDepartmentId(String role, Long departmentId);
}
