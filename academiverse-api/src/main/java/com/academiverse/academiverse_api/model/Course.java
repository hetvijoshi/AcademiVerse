package com.academiverse.academiverse_api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long courseId;

    private String courseName;
    private String courseCode;
    private String courseDescription;

    @ManyToOne
    @JoinColumn(name = "department_Id", referencedColumnName = "departmentId", nullable = true)
    private Department department;

    // Assuming Degree is another entity
    @ManyToOne
    @JoinColumn(name = "degree_Id", referencedColumnName = "degreeId", nullable = true)
    private Degree degree;

    private Long createdBy;
    private LocalDateTime createdDate;
    private Long updatedBy;
    private LocalDateTime updatedDate;
}
