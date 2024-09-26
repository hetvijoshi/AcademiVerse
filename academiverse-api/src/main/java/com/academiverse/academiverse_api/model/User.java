package com.academiverse.academiverse_api.model;

import com.academiverse.academiverse_api.model.Department;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;
    private String name;
    private String userEmail;
    private String role;
    @ManyToOne
    @JoinColumn(name = "department_Id", referencedColumnName = "departmentId", nullable = false)
    private Department department;
    @ManyToOne
    @JoinColumn(name = "degree_Id", referencedColumnName = "degreeId", nullable = true)
    private Degree degree;
    private String major;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long createdBy;
    private Long updatedBy;
}
