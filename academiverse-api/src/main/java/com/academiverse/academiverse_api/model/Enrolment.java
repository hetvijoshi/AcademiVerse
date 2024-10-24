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

    private Long userId; // Student ID
    private Long instructId; // Course ID
    private boolean isActive; // Enrollment status
    private LocalDateTime createdAt; // Optional: add timestamps
    private LocalDateTime updatedAt; // Optional: add timestamps

    // Add createdBy and updatedBy fields if needed
}
