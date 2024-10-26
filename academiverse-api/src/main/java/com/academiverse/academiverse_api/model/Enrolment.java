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
@Table(name = "enrolments")
public class Enrolment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long enrolmentId;

    @OneToOne
    @JoinColumn(name = "userId", referencedColumnName = "userId", nullable = false)
    private User user; // Student ID
    @ManyToOne
    @JoinColumn(name = "instructId", referencedColumnName = "instructId", nullable = false)
    private Instruct instruct; // Course ID
    private boolean isActive; // Enrollment status
    private Long createdBy;
    private Long updatedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
