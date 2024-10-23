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
@Table(name = "instructs")
public class Instruct {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long instructId;

    @ManyToOne
    @JoinColumn(name = "course_Id", referencedColumnName = "courseId", nullable = false)
    private Course course;

    @ManyToOne
    @JoinColumn(name = "user_Id", referencedColumnName = "userId", nullable = false)
    private User professor; // User entity as Professor

    private int courseCapacity;
    private String courseDays;
    private String courseStartTime;
    private String courseEndTime;
    private String semester;
    private int year;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long createdBy;
    private Long updatedBy;
}
