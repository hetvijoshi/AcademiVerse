package com.academiverse.academiverse_api.repository;

import com.academiverse.academiverse_api.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    // You can add custom query methods here if needed
}
