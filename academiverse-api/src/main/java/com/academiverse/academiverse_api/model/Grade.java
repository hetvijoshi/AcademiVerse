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
@Table(name = "grades")
public class Grade {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long gradeId;

    private String gradeTitle;  // Optionally, keep this field for distinguishing grades.

    private int obtainedMarks;   // Changed from 'marks' to 'obtainedMarks' for clarity
    private int totalMarks;      // Keep this for grading purposes

    private Long userId;         // Assuming this corresponds to the user (professor or admin)
    private Long studentId;      // Corresponds to the student

    @ManyToOne
    @JoinColumn(name = "assignmentId", referencedColumnName = "assignmentId", nullable = true)
    private Assignment assignment;

    @ManyToOne
    @JoinColumn(name = "quizId", referencedColumnName = "quizId", nullable = true) // Fixed the join column name
    private Quiz quiz;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long createdBy;
    private Long updatedBy;
}
