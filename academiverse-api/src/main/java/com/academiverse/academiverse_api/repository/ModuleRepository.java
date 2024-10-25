package com.academiverse.academiverse_api.repository;

import com.academiverse.academiverse_api.model.Module;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ModuleRepository extends JpaRepository<Module, Long> {
    List<Module> findByInstructsInstructIdAndParentModuleIsNull(Long instructId);
}
