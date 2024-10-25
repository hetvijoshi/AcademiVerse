//announcementId
//        instructId
//        announcementTitle
//        announcementDescription
//        createdBy
//        createdDate
//        updatedBy
//        updatedDate

package com.academiverse.academiverse_api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "announcements")
public class Announcement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long announcementId;
    @ManyToOne
    @JoinColumn(name = "instructId", referencedColumnName = "instructId", nullable=false)
    private Instruct instructs;
    private String announcementTitle;
    private String announcementDescription;
    @ManyToOne
    @JoinColumn(name = "userId", referencedColumnName = "userId", nullable=true)
    private User author;
    private Long createdBy;
    private Long updatedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
