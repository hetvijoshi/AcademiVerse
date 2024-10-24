package com.academiverse.academiverse_api.repository;

import com.academiverse.academiverse_api.model.Announcement;
import com.academiverse.academiverse_api.model.Degree;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    List<Announcement> findByInstructsInstructId(Long instructId);
}
