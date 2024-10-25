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
@Table(name = "Quizzes")
public class Quiz {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long quizId;
    @ManyToOne
    @JoinColumn(name = "instructId", referencedColumnName = "instructId", nullable = false)
    private Instruct instruct;
    private String quizName;
    private String quizDescription;
    private int quizWeightage;
    private LocalDateTime quizDueDate;
    private int totalMarks;
    private boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long createdBy;
    private Long updatedBy;
}
