package com.academiverse.academiverse_api.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "Questions")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long questionId;
    @ManyToOne
    @JoinColumn(name = "quizId", referencedColumnName = "quizId", nullable = false)
    @JsonIgnore
    private Quiz quiz;
    private String quizQuestionText;
    @OneToMany(mappedBy = "question",cascade = CascadeType.ALL)
    private List<QOption> qOptions;
    @OneToOne
    @JoinColumn(name = "answerId", referencedColumnName = "optionId", nullable = true)
    @JsonIgnore
    private QOption answer;
    private float marks;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long createdBy;
    private Long updatedBy;
}
