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
@Table(name = "assignments")
public class Assignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long assignmentId;

    @ManyToOne
    @JoinColumn(name = "instruct_Id", referencedColumnName = "instructId", nullable = false)
    private Instruct instruct;

    private String assignmentTitle;
    @Column(columnDefinition="TEXT")
    private String assignmentDescription;
    private LocalDateTime assignmentDueDate;
    private float assignmentWeightage;
    private int totalMarks;
    @Column(name = "active", nullable = true)
    private boolean active = true;
    private Long createdBy;
    private LocalDateTime createdDate;
    private Long updatedBy;
    private LocalDateTime updatedDate;
}
