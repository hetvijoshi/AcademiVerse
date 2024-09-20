package com.academiverse.academiverse_api.repository;

import com.academiverse.academiverse_api.dto.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {

}
